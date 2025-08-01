import { PrismaClient } from '@prisma/client';
import smsService from './smsService.js';
import { escalationLevels } from '../cron/utils/escalationLevels.js';

const prisma = new PrismaClient();

export async function monitorPowerData() {
    try {
        console.log('🔍 Starting power data monitoring...');

        // Get all active meters with recent readings
        const activeMeters = await prisma.meter.findMany({
            where: {
                status: 'ACTIVE',
            },
            include: {
                readings: {
                    orderBy: {
                        timestamp: 'desc',
                    },
                    take: 1,
                },
                dtr: true,
                consumer: true,
            },
        });

        const alerts = [];

        for (const meter of activeMeters) {
            if (!meter.readings || meter.readings.length === 0) {
                continue;
            }

            const latestReading = meter.readings[0];
            const alertsForMeter = await checkPowerAlerts(meter, latestReading);
            alerts.push(...alertsForMeter);
        }

        // Send SMS alerts for detected issues
        for (const alert of alerts) {
            await sendPowerAlert(alert);
        }

        console.log(`✅ Power monitoring completed. Found ${alerts.length} alerts.`);
        return alerts;

    } catch (error) {
        console.error('❌ Error in power monitoring:', error);
        throw error;
    }
}

async function checkPowerAlerts(meter, reading) {
    const alerts = [];
    const now = new Date();

    // Check for zero or negative values
    if (isZeroOrNegative(reading.kw) || isZeroOrNegative(reading.kva)) {
        alerts.push({
            type: 'ZERO_NEGATIVE_POWER',
            meterId: meter.id,
            dtrName: meter.dtr?.name || 'Unknown DTR',
            feederName: meter.dtr?.feederName || 'Unknown Feeder',
            errorMessage: 'Zero or negative power reading detected',
            errorOccurredAt: now.toISOString(),
            reading: reading,
        });
    }

    // Check for load imbalance (if 3-phase data available)
    if (reading.phaseA && reading.phaseB && reading.phaseC) {
        const imbalance = calculateLoadImbalance(reading);
        if (imbalance > 20) { // More than 20% imbalance
            alerts.push({
                type: 'LOAD_IMBALANCE',
                meterId: meter.id,
                dtrName: meter.dtr?.name || 'Unknown DTR',
                feederName: meter.dtr?.feederName || 'Unknown Feeder',
                errorMessage: `Load imbalance detected: ${imbalance.toFixed(1)}%`,
                errorOccurredAt: now.toISOString(),
                reading: reading,
            });
        }
    }

    // Check for low power factor
    if (reading.powerFactor && reading.powerFactor < 0.85) {
        alerts.push({
            type: 'LOW_POWER_FACTOR',
            meterId: meter.id,
            dtrName: meter.dtr?.name || 'Unknown DTR',
            feederName: meter.dtr?.feederName || 'Unknown Feeder',
            errorMessage: `Low power factor detected: ${(reading.powerFactor * 100).toFixed(1)}%`,
            errorOccurredAt: now.toISOString(),
            reading: reading,
        });
    }

    // Check for low voltage
    if (reading.voltage && reading.voltage < 200) { // Below 200V
        alerts.push({
            type: 'LOW_VOLTAGE',
            meterId: meter.id,
            dtrName: meter.dtr?.name || 'Unknown DTR',
            feederName: meter.dtr?.feederName || 'Unknown Feeder',
            errorMessage: `Low voltage detected: ${reading.voltage}V`,
            errorOccurredAt: now.toISOString(),
            reading: reading,
        });
    }

    // Check for high frequency deviation
    if (reading.frequency && (reading.frequency < 49 || reading.frequency > 51)) {
        alerts.push({
            type: 'FREQUENCY_DEVIATION',
            meterId: meter.id,
            dtrName: meter.dtr?.name || 'Unknown DTR',
            feederName: meter.dtr?.feederName || 'Unknown Feeder',
            errorMessage: `Frequency deviation detected: ${reading.frequency}Hz`,
            errorOccurredAt: now.toISOString(),
            reading: reading,
        });
    }

    return alerts;
}

function isZeroOrNegative(value) {
    return value === null || value === undefined || value <= 0;
}

function calculateLoadImbalance(reading) {
    const phaseA = reading.phaseA || 0;
    const phaseB = reading.phaseB || 0;
    const phaseC = reading.phaseC || 0;

    const average = (phaseA + phaseB + phaseC) / 3;
    const maxDeviation = Math.max(
        Math.abs(phaseA - average),
        Math.abs(phaseB - average),
        Math.abs(phaseC - average)
    );

    return (maxDeviation / average) * 100;
}

async function sendPowerAlert(alert) {
    try {
        // Get escalation contacts for level 0 (initial alert)
        const level0Contacts = escalationLevels[0].contacts;

        const alertData = {
            dtrName: alert.dtrName,
            feederName: alert.feederName,
            errorMessage: alert.errorMessage,
            errorOccurredAt: alert.errorOccurredAt,
            contacts: level0Contacts,
        };

        // Send SMS alert
        const smsSent = await smsService.sendPowerAlert(alertData);

        // Log alert to database
        await logAlertToDatabase(alert, smsSent);

        console.log(`🚨 Power alert sent for ${alert.dtrName}: ${alert.errorMessage}`);
        return smsSent;

    } catch (error) {
        console.error('❌ Error sending power alert:', error);
        return false;
    }
}

async function logAlertToDatabase(alert, smsSent) {
    try {
        // Create alert record in database
        await prisma.alert.create({
            data: {
                meterId: alert.meterId,
                type: alert.type,
                message: alert.errorMessage,
                status: 'ACTIVE',
                escalationLevel: 0,
                errorOccurredAt: new Date(alert.errorOccurredAt),
                smsSent: smsSent,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
    } catch (error) {
        console.error('❌ Error logging alert to database:', error);
    }
} 