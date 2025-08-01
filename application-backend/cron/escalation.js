import { PrismaClient } from '@prisma/client';
import { escalationLevels } from './utils/escalationLevels.js';
import smsService from '../utils/smsService.js';

const prisma = new PrismaClient();

export async function escalateTickets() {
    try {
        console.log('🔄 Starting ticket escalation check...');
        
        // Get active alerts that need escalation
        const activeAlerts = await prisma.alert.findMany({
            where: {
                status: 'ACTIVE',
                escalationLevel: {
                    lt: escalationLevels.length - 1
                }
            },
            include: {
                meter: {
                    include: {
                        dtr: true,
                        consumer: true
                    }
                }
            }
        });

        console.log(`📊 Found ${activeAlerts.length} active alerts for escalation`);

        for (const alert of activeAlerts) {
            await processEscalation(alert);
        }

        console.log('✅ Ticket escalation check completed');
        
    } catch (error) {
        console.error('❌ Error in ticket escalation:', error);
        throw error;
    }
}

async function processEscalation(alert) {
    try {
        const currentLevel = alert.escalationLevel;
        const currentLevelConfig = escalationLevels[currentLevel];
        const nextLevelConfig = escalationLevels[currentLevel + 1];

        if (!currentLevelConfig || !nextLevelConfig) {
            console.log(`⚠️ No escalation config found for level ${currentLevel}`);
            return;
        }

        // Check if it's time to escalate
        const timeSinceCreation = Date.now() - new Date(alert.createdAt).getTime();
        const timeToEscalate = currentLevelConfig.timeToEscalate * 60 * 1000; // Convert minutes to milliseconds

        if (timeSinceCreation >= timeToEscalate) {
            // Escalate to next level
            await escalateToNextLevel(alert, nextLevelConfig);
        } else {
            console.log(`⏳ Alert ${alert.id} not ready for escalation yet`);
        }

    } catch (error) {
        console.error(`❌ Error processing escalation for alert ${alert.id}:`, error);
    }
}

async function escalateToNextLevel(alert, nextLevelConfig) {
    try {
        console.log(`🚨 Escalating alert ${alert.id} to level ${nextLevelConfig.level}`);

        // Update alert escalation level
        await prisma.alert.update({
            where: { id: alert.id },
            data: {
                escalationLevel: nextLevelConfig.level,
                updatedAt: new Date(),
            }
        });

        // Send SMS to next level contacts
        const escalationData = {
            ticketId: alert.id,
            level: nextLevelConfig.level,
            contacts: nextLevelConfig.contacts,
            ticketDetails: `${alert.message} - ${alert.meter?.dtr?.name || 'Unknown DTR'}`,
        };

        const smsSent = await smsService.sendEscalationAlert(escalationData);

        // Log escalation event
        await logEscalationEvent(alert, nextLevelConfig, smsSent);

        console.log(`✅ Alert ${alert.id} escalated to level ${nextLevelConfig.level}`);

    } catch (error) {
        console.error(`❌ Error escalating alert ${alert.id}:`, error);
    }
}

async function logEscalationEvent(alert, levelConfig, smsSent) {
    try {
        await prisma.escalationLog.create({
            data: {
                alertId: alert.id,
                escalationLevel: levelConfig.level,
                escalatedAt: new Date(),
                contactsNotified: levelConfig.contacts.length,
                smsSent: smsSent,
                createdAt: new Date(),
            }
        });
    } catch (error) {
        console.error('❌ Error logging escalation event:', error);
    }
}