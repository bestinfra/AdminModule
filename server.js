import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import xss from 'xss-clean';
import hpp from 'hpp';
import compression from 'compression';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import cookieParser from 'cookie-parser';
import { jwtDecode } from 'jwt-decode';
import cron from 'node-cron';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import MSG91 from 'msg91';

import config from './config/config.js';
import logger from './utils/logger.js';
import errorHandler from './middlewares/errorHandler.js';
import v1Routes from './routes/v1/index.js';
import { generateBills, generateOverDueBills } from './cron_jobs/index.js';
import pool from './config/db.js';
import dashboardModel from './models/main/dashboard.model.js';
import {
    calculateTotalAmount,
    convertToISTMail,
    delay,
    generateInvoiceNumber,
    getDateInMDYFormat,
    isLoadImbalance,
    isLowPowerFactor,
    isLowVoltage,
    isNegative,
    isZero,
} from './utils/dashboardUtils.js';
import { getPowerDetails } from './controllers/consumer/dashboardController.js';
import { sendZeroValueAlert } from './utils/emailService.js';
import notificationsModel from './models/main/notifications.model.js';

const QUERY_TIMEOUT = 30000;
const app = express();

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            'http://localhost:5173',
            'https://lk-ea.co.in',
            'http://lk-ea.co.in',
        ],
        methods: ['GET', 'POST'],
        credentials: true,
        allowedHeaders: ['my-custom-header'],
    },
});

const msg91 = MSG91.default;

msg91.initialize({
    authKey: config.MSG_AUTH_TOKEN,
});

const connectedClients = new Set();

io.on('connection', async (socket) => {
    connectedClients.add(socket.id);

    await notificationsModel.sendUnreadNotifications(pool, socket);
    await notificationsModel.getNotificationCount(pool, socket);

    socket.on('mark_notification_read', async (notificationId) => {
        await notificationsModel.markNotificationAsRead(
            pool,
            socket,
            notificationId
        );
    });

    socket.on('mark_all_read', async () => {
        await notificationsModel.markAsReadAllNotifications(pool, socket);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        connectedClients.delete(socket.id);
    });
});

// Rate limiter configuration
// const rateLimiter = new RateLimiterMemory({
//     points: 100,
//     duration: 60,
//     blockDuration: 60 * 15,
// });

// Rate limiter middleware
// const rateLimiterMiddleware = async (req, res, next) => {
//     // if (req.path.startsWith('/api/auth/')) {
//     //     return next();
//     // }

//     try {
//         await rateLimiter.consume(req.ip);
//         next();
//     } catch (error) {
//         logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
//         res.status(429).send('Too Many Requests');
//     }
// };

// Body parsers
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", 'data:', 'https:'],
            },
        },
        crossOriginEmbedderPolicy: true,
        crossOriginOpenerPolicy: true,
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        dnsPrefetchControl: true,
        frameguard: { action: 'deny' },
        hidePoweredBy: true,
        hsts: true,
        ieNoOpen: true,
        noSniff: true,
        referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
        xssFilter: true,
    })
);

const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://lk-ea.co.in',
        'http://lk-ea.co.in',
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
    maxAge: 86400,
    exposedHeaders: ['X-Total-Count', 'X-RateLimit-Remaining'],
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(xss());
app.use(hpp());
app.use(compression());
// app.use(rateLimiterMiddleware);

const extractTokenData = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        return next();
    }

    try {
        const decoded = jwtDecode(accessToken);
        req.user = decoded;
        if (decoded.locationHierarchy) {
            const access = await dashboardModel.getLocationAccessCondition(
                pool,
                decoded
            );
            req.locationAccess = access;
        } else if (!decoded.locationHierarchy && decoded.user == 'User') {
            req.user = decoded;
        }
    } catch (error) {
        logger.error('Token/Location access error:', error);
    }

    next();
};

app.use(extractTokenData);

app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`, {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        timestamp: new Date().toISOString(),
    });
    next();
});

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version,
    });
});

app.use(`/api/${config.API_VERSION}`, v1Routes);

app.use(errorHandler);

app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found',
        path: req.originalUrl,
    });
});

const setupCronJobs = () => {
    cron.schedule(
        '0 1 1 * *',
        async () => {
            try {
                await generateBills(pool);
                logger.info('Monthly bills generation completed');
            } catch (error) {
                logger.error('Bills generation failed:', error);
            }
        },
        {
            timezone: 'Asia/Kolkata',
            scheduled: true,
        }
    );

    cron.schedule(
        '0 1 9 * *',
        async () => {
            try {
                await generateOverDueBills(pool);
                logger.info('Overdue bills generation completed');
            } catch (error) {
                logger.error('Overdue bills generation failed:', error);
            }
        },
        {
            timezone: 'Asia/Kolkata',
            scheduled: true,
        }
    );

    cron.schedule(
        '* * * * *',
        async () => {
            try {
                const [consumers] = await pool.query(
                    `SELECT c.meter_serial, c.consumer_name, fm.feeder_name, dm.dtr_name, dm.street_name
                    FROM consumers_lkea c
                    JOIN feeder_master fm ON fm.meter_serial_no = c.meter_serial
                    JOIN dtr_master dm ON fm.dtr_id = dm.dtr_id
                    WHERE c.block_name = 'Block-D'`
                );

                for (const consumer of consumers) {
                    const [power] = await pool.query(
                        `SELECT
                            RPH_LINE_CURRENT as current,
                            YPH_LINE_CURRENT as cYPh,
                            BPH_LINE_CURRENT as cBPh,
                            RPH_VOLTAGE as voltage,
                            YPH_VOLTAGE as vYPh,
                            BPH_VOLTAGE as vBPh,
                            RPH_POWER_FACTOR as powerFactor,
                            YPH_POWER_FACTOR as pfYPh,
                            BPH_POWER_FACTOR as pfBPh,
                            FREQUENCY as frequency,
                            NEUTRAL_CURRENT as neutral_current
                        FROM ntpl.d2
                        WHERE METER_SERIAL_NO = ?
                        ORDER BY METER_TIME_STAMP DESC
                        LIMIT 1`,
                        [consumer.meter_serial]
                    );

                    const [[tamperData]] = await pool.query(
                        `SELECT tamper_datetime, tamper_status 
                        FROM tamper_data 
                        WHERE meter_no = ? AND tamper_type = 13 
                        ORDER BY tamper_datetime DESC 
                        LIMIT 1`,
                        [consumer.meter_serial]
                    );

                    const [[{ last_comm_date }]] = await pool.query(
                        `SELECT D3_TIME_STAMP as last_comm_date
                        FROM d3_b3
                        WHERE METER_SERIAL_NO = ?
                        ORDER BY D3_TIME_STAMP DESC
                        LIMIT 1`,
                        [consumer.meter_serial]
                    );

                    if (power && power.length > 0) {
                        const powerData = power[0];

                        powerData.vRPh = powerData.voltage;
                        powerData.cRPh = powerData.current;

                        const alertMapping = {
                            'Meter Power Fail (R - Phase)': 'Meter Power Fail',
                            'Meter Power Fail (Y - Phase)': 'Meter Power Fail',
                            'Meter Power Fail (B - Phase)': 'Meter Power Fail',
                            'R_PH Missing': 'R_PH Missing',
                            'Y_PH Missing': 'Y_PH Missing',
                            'B_PH Missing': 'B_PH Missing',
                            'LT Fuse Blown (R - Phase)': 'LT Fuse Blown',
                            'LT Fuse Blown (Y - Phase)': 'LT Fuse Blown',
                            'LT Fuse Blown (B - Phase)': 'LT Fuse Blown',
                            'R_PH CT Reversed': 'R_PH CT Reversed',
                            'Y_PH CT Reversed': 'Y_PH CT Reversed',
                            'B_PH CT Reversed': 'B_PH CT Reversed',
                            'Unbalanced Load': 'Unbalanced Load',
                            'Low PF (R - Phase)': 'Low PF',
                            'Low PF (Y - Phase)': 'Low PF',
                            'Low PF (B - Phase)': 'Low PF',
                            'HT Fuse Blown (R - Phase)': 'HT Fuse Blown',
                            'HT Fuse Blown (Y - Phase)': 'HT Fuse Blown',
                            'HT Fuse Blown (B - Phase)': 'HT Fuse Blown',
                        };

                        const zeroValues = {
                            // 'Meter Power Fail (R - Phase)': isZero(
                            //     powerData.powerFactor
                            // ),
                            // 'Meter Power Fail (Y - Phase)': isZero(
                            //     powerData.pfYPh
                            // ),
                            // 'Meter Power Fail (B - Phase)': isZero(
                            //     powerData.pfBPh
                            // ),
                            // 'Power Failure': true,
                            // 'HT Fuse Blown (B - Phase)': true,

                            'Power Failure': isZero(tamperData.tamper_status),

                            'R_PH Missing': isZero(powerData.vRPh),
                            'Y_PH Missing': isZero(powerData.vYPh),
                            'B_PH Missing': isZero(powerData.vBPh),

                            'LT Fuse Blown (R - Phase)': isZero(powerData.cRPh),
                            'LT Fuse Blown (Y - Phase)': isZero(powerData.cYPh),
                            'LT Fuse Blown (B - Phase)': isZero(powerData.cBPh),

                            'R_PH CT Reversed': isNegative(powerData.cRPh),
                            'Y_PH CT Reversed': isNegative(powerData.cYPh),
                            'B_PH CT Reversed': isNegative(powerData.cBPh),

                            'Unbalanced Load': isLoadImbalance(
                                powerData.neutral_current || 0.0
                            ),

                            'Low PF (R - Phase)': isLowPowerFactor(
                                powerData.powerFactor
                            ),
                            'Low PF (Y - Phase)': isLowPowerFactor(
                                powerData.pfYPh
                            ),
                            'Low PF (B - Phase)': isLowPowerFactor(
                                powerData.pfBPh
                            ),
                            'HT Fuse Blown (R - Phase)': isLowVoltage(
                                powerData.vRPh
                            ),
                            'HT Fuse Blown (Y - Phase)': isLowVoltage(
                                powerData.vYPh
                            ),
                            'HT Fuse Blown (B - Phase)': isLowVoltage(
                                powerData.vBPh
                            ),
                        };

                        // const zeroValues = {
                        //     // 'Meter Power Fail (R - Phase)': true,
                        //     // 'Meter Power Fail (Y - Phase)': true,
                        //     // 'Meter Power Fail (B - Phase)': true,
                        //     'Power Failure': true,
                        //     'R_PH Missing': true,
                        //     'Y_PH Missing': true,
                        //     'B_PH Missing': true,
                        //     'LT Fuse Blown (R - Phase)': true,
                        //     'LT Fuse Blown (Y - Phase)': true,
                        //     'LT Fuse Blown (B - Phase)': true,
                        //     'R_PH CT Reversed': true,
                        //     'Y_PH CT Reversed': true,
                        //     'B_PH CT Reversed': true,
                        //     'Unbalanced Load': true,
                        //     'Low PF (R - Phase)': true,
                        //     'Low PF (Y - Phase)': true,
                        //     'Low PF (B - Phase)': true,
                        //     'HT Fuse Blown (R - Phase)': true,
                        //     'HT Fuse Blown (Y - Phase)': true,
                        //     'HT Fuse Blown (B - Phase)': true,
                        // };

                        const hasZeroValues = Object.values(zeroValues).some(
                            (value) => value === true
                        );

                        if (config.NODE_ENV === 'production') {
                            const alertsToSend = {};
                            const resolvedAlerts = {};

                            const propertyMap = {
                                'Meter Power Fail (R - Phase)': 'powerFactor',
                                'Meter Power Fail (Y - Phase)': 'pfYPh',
                                'Meter Power Fail (B - Phase)': 'pfBPh',

                                'R_PH Missing': 'vRPh',
                                'Y_PH Missing': 'vYPh',
                                'B_PH Missing': 'vBPh',

                                'LT Fuse Blown (R - Phase)': 'cRPh',
                                'LT Fuse Blown (Y - Phase)': 'cYPh',
                                'LT Fuse Blown (B - Phase)': 'cBPh',

                                'R_PH CT Reversed': 'cRPh',
                                'Y_PH CT Reversed': 'cYPh',
                                'B_PH CT Reversed': 'cBPh',

                                'Unbalanced Load': 'neutral_current',

                                'Low PF (R - Phase)': 'powerFactor',
                                'Low PF (Y - Phase)': 'pfYPh',
                                'Low PF (B - Phase)': 'pfBPh',

                                'HT Fuse Blown (R - Phase)': 'vRPh',
                                'HT Fuse Blown (Y - Phase)': 'vYPh',
                                'HT Fuse Blown (B - Phase)': 'vBPh',
                            };

                            const [existingAlerts] = await pool.query(
                                `SELECT alert_desc, status
                                    FROM ntpl.alerts_tgnpdcl AS a
                                    WHERE feeder_name = ? 
                                    AND status = 'start'
                                    AND NOT EXISTS (
                                        SELECT 1
                                        FROM ntpl.alerts_tgnpdcl AS b
                                        WHERE a.feeder_name = b.feeder_name
                                        AND a.alert_desc = b.alert_desc
                                        AND b.status = 'end'
                                        AND b.datetime > a.datetime
                                    )
                        )`,
                                [consumer.feeder_name]
                            );

                            const existingAlertsMap = new Map();
                            existingAlerts.forEach((alert) => {
                                existingAlertsMap.set(alert.alert_desc, alert);
                            });

                            for (const [
                                alertType,
                                isTriggered,
                            ] of Object.entries(zeroValues)) {
                                if (!isTriggered) {
                                    // const alertDesc =
                                    //     alertMapping[alertType] || alertType;
                                    const alertDesc = alertType;
                                    if (existingAlertsMap.has(alertDesc)) {
                                        resolvedAlerts[alertType] = false;

                                        await pool.query(
                                            `INSERT INTO alerts_tgnpdcl
                                     (alert_desc, status, feeder_name, location, datetime)
                                     VALUES (?, 'end', ?, ?, NOW())`,
                                            [
                                                alertDesc,
                                                consumer.feeder_name,
                                                consumer.street_name,
                                            ]
                                        );

                                        const notificationContent = `Alert resolved: ${alertDesc} is no longer active for feeder ${consumer.feeder_name}`;

                                        const [result] = await pool.query(
                                            `INSERT INTO notifications_tgnpdcl
                                     (title, content, is_read, created_at)
                                     VALUES (?, ?, 0, NOW())`,
                                            [
                                                `${alertDesc} Resolved`,
                                                notificationContent,
                                            ]
                                        );

                                        if (io && connectedClients.size > 0) {
                                            await notificationsModel.sendUnreadNotifications(
                                                pool,
                                                io
                                            );
                                            await notificationsModel.getNotificationCount(
                                                pool,
                                                io
                                            );
                                        }
                                    }
                                }
                            }

                            if (hasZeroValues) {
                                for (const [
                                    alertType,
                                    isTriggered,
                                ] of Object.entries(zeroValues)) {
                                    if (isTriggered) {
                                        // const alertDesc =
                                        //     alertMapping[alertType] || alertType;
                                        const alertDesc = alertType;

                                        if (!existingAlertsMap.has(alertDesc)) {
                                            try {
                                                alertsToSend[alertType] = true;

                                                await pool.query(
                                                    `INSERT INTO alerts_tgnpdcl
                                             (alert_desc, status, feeder_name, location, datetime, escalation_level, escalation_time, value, error_occured_at)
                                             VALUES (?, 'start', ?, ?, NOW(), 1, NOW(), ?, ?)`,
                                                    [
                                                        alertDesc,
                                                        consumer.feeder_name,
                                                        consumer.street_name,
                                                        alertType ==
                                                        'Power Failure'
                                                            ? 0
                                                            : powerData[
                                                                  propertyMap[
                                                                      alertType
                                                                  ]
                                                              ],
                                                        convertToISTMail(
                                                            last_comm_date
                                                        ),
                                                    ]
                                                );

                                                let notificationContent = '';

                                                if (
                                                    alertDesc.includes(
                                                        'Meter Power Fail'
                                                    )
                                                ) {
                                                    notificationContent = `Meter power failure detected for feeder ${consumer.feeder_name}`;
                                                } else if (
                                                    alertDesc.includes(
                                                        'Missing'
                                                    )
                                                ) {
                                                    notificationContent = `Phase missing detected: ${alertType} for feeder ${consumer.feeder_name}. Requires immediate attention.`;
                                                } else if (
                                                    alertDesc.includes(
                                                        'CT Open'
                                                    )
                                                ) {
                                                    notificationContent = `CT open circuit detected: ${alertType} for feeder ${consumer.feeder_name}. Please inspect connections.`;
                                                } else if (
                                                    alertDesc.includes(
                                                        'CT Reversed'
                                                    )
                                                ) {
                                                    notificationContent = `CT reversed polarity detected: ${alertType} for feeder ${consumer.feeder_name}. Check installation.`;
                                                } else if (
                                                    alertDesc ===
                                                    'Unbalanced Load'
                                                ) {
                                                    notificationContent = `Load imbalance detected for feeder ${consumer.feeder_name}. Neutral current: ${powerData.neutral_current}A.`;
                                                } else if (
                                                    alertDesc === 'Low PF'
                                                ) {
                                                    notificationContent = `Low power factor detected (${alertType}) for feeder ${consumer.feeder_name}. Current values - R: ${powerData.powerFactor}, Y: ${powerData.pfYPh}, B: ${powerData.pfBPh}.`;
                                                } else if (
                                                    alertDesc ===
                                                    'HT Fuse Blown'
                                                ) {
                                                    notificationContent = `Low voltage detected (${alertType}) for feeder ${consumer.feeder_name}. Current values - R: ${powerData.vRPh}V, Y: ${powerData.vYPh}V, B: ${powerData.vBPh}V.`;
                                                } else {
                                                    notificationContent = `Alert: ${alertDesc} detected for feeder ${
                                                        consumer.feeder_name
                                                    }. Last communication: ${convertToISTMail(
                                                        last_comm_date
                                                    )}.`;
                                                }

                                                const [result] =
                                                    await pool.query(
                                                        `INSERT INTO notifications_tgnpdcl
                                             (title, content, is_read, created_at)
                                             VALUES (?, ?, 0, NOW())`,
                                                        [
                                                            `${alertDesc} Alert`,
                                                            notificationContent,
                                                        ]
                                                    );

                                                const newNotification = {
                                                    id: result.insertId,
                                                    title: `${alertDesc} Alert`,
                                                    content:
                                                        notificationContent,
                                                    created_at: new Date(),
                                                    is_read: 0,
                                                };

                                                if (
                                                    io &&
                                                    connectedClients.size > 0
                                                ) {
                                                    await notificationsModel.sendUnreadNotifications(
                                                        pool,
                                                        io
                                                    );
                                                    await notificationsModel.getNotificationCount(
                                                        pool,
                                                        io
                                                    );
                                                }
                                            } catch (error) {
                                                console.error(
                                                    `Error processing alert ${alertDesc}:`,
                                                    error
                                                );
                                            }
                                        }
                                    }
                                }
                            }

                            const combinedAlerts = {
                                ...alertsToSend,
                                ...resolvedAlerts,
                            };

                            const hasZeroValuesFromCombinedAlerts =
                                Object.values(combinedAlerts).some(
                                    (value) => value === true
                                );

                            if (hasZeroValuesFromCombinedAlerts) {
                                await sendZeroValueAlert(
                                    consumer.meter_serial,
                                    consumer.feeder_name,
                                    consumer.dtr_name,
                                    combinedAlerts,
                                    { ...powerData, ...tamperData },
                                    convertToISTMail(last_comm_date),
                                    msg91
                                );
                            }
                        }
                    }
                }
            } catch (e) {
                console.log(e);
            }
        },
        {
            timezone: 'Asia/Kolkata',
            scheduled: true,
        }
    );

    cron.schedule(
        '*/5 * * * *',
        async () => {
            const escalationLevels = [
                {
                    level: 0,
                    name: 'Created',
                    timeToEscalate: 0,
                    contacts: [
                        {
                            role: 'LM',
                            name: 'Line Manager',
                            phone: '919440811581',
                        },
                        {
                            role: 'LM1',
                            name: 'Line Manager',
                            phone: '917901678140',
                        },
                        {
                            role: 'LM2',
                            name: 'Line Manager',
                            phone: '918332969755',
                        },
                        {
                            role: 'LM3',
                            name: 'Line Manager',
                            phone: '919701253249',
                        },
                        {
                            role: 'LM4',
                            name: 'Line Manager',
                            phone: '916303457002',
                        },
                        {
                            role: 'LM5',
                            name: 'Line Manager',
                            phone: '917780314837',
                        },
                        {
                            role: 'LM6',
                            name: 'Line Manager',
                            phone: '919849569000',
                        },
                    ],
                },
                {
                    level: 1,
                    name: 'Level 1',
                    timeToEscalate: 15,
                    contacts: [
                        {
                            role: 'LI',
                            name: 'Line Inspector',
                            phone: '917702943339',
                        },
                        {
                            role: 'SLI',
                            name: 'Senior Line Inspector',
                            phone: '916302631535',
                        },
                        {
                            role: 'FM',
                            name: 'Field Manager',
                            phone: '919700393611',
                        },
                        {
                            role: 'FMM',
                            name: 'Field Manager',
                            phone: '919849569000',
                        },
                    ],
                },
                {
                    level: 2,
                    name: 'Level 2',
                    timeToEscalate: 20,
                    contacts: [
                        {
                            role: 'AE',
                            name: 'Assistant Engineer',
                            phone: '919701253249',
                        },
                    ],
                },
                {
                    level: 3,
                    name: 'Level 3',
                    timeToEscalate: 30,
                    contacts: [
                        {
                            role: 'ADE',
                            name: 'Assistant Divisional Engineer',
                            phone: '916302631535',
                        },
                    ],
                },
                {
                    level: 4,
                    name: 'Level 4',
                    timeToEscalate: 45,
                    contacts: [
                        {
                            role: 'DE',
                            name: 'Divisional Engineer',
                            phone: '916303457002',
                        },
                    ],
                },
                {
                    level: 5,
                    name: 'Level 5',
                    timeToEscalate: 60,
                    contacts: [
                        {
                            role: 'Management',
                            name: 'Senior Management',
                            phone: '917702943339',
                        },
                        {
                            role: 'Management',
                            name: 'Senior Management',
                            phone: '919849569000',
                        },
                        {
                            role: 'Management',
                            name: 'Senior Management',
                            phone: '917780314837',
                        },
                    ],
                },
            ];

            try {
                const [activeAlerts] = await pool.query(
                    `SELECT a.alert_id, a.alert_desc, a.feeder_name, a.location, a.datetime, a.escalation_level, a.escalation_time, a.value, a.error_occured_at,
                        d.dtr_name, d.street_name, d.city
                    FROM alerts_tgnpdcl AS a
                    LEFT JOIN feeder_master f ON a.feeder_name = f.feeder_name
                    LEFT JOIN dtr_master d ON f.dtr_id = d.dtr_id
                    WHERE a.status = 'start'
                    AND a.escalation_level < ?
                    AND NOT EXISTS (
                        SELECT 1
                        FROM ntpl.alerts_tgnpdcl AS b
                        WHERE a.feeder_name = b.feeder_name
                        AND a.alert_desc = b.alert_desc
                        AND b.status = 'end'
                    )`,
                    [escalationLevels.length - 1]
                );

                if (activeAlerts.length === 0) {
                    return;
                }

                for (const alert of activeAlerts) {
                    const currentLevel = alert.escalation_level;
                    const lastUpdated = alert.escalation_time || alert.datetime;
                    const currentTime = new Date();

                    const minutesSinceUpdate = Math.floor(
                        (currentTime - new Date(lastUpdated)) / (1000 * 60)
                    );

                    const timeForNextLevel =
                        escalationLevels[currentLevel].timeToEscalate;

                    if (minutesSinceUpdate >= timeForNextLevel) {
                        const nextLevel = parseInt(currentLevel) + 1;

                        try {
                            await pool.query(
                                `UPDATE alerts_tgnpdcl
                        SET escalation_level = ?, escalation_time = NOW()
                        WHERE alert_id = ?`,
                                [nextLevel, alert.alert_id]
                            );

                            const escalationContacts =
                                escalationLevels[currentLevel].contacts;
                            const dtrName = alert.dtr_name || 'Unknown DTR';
                            const feederName =
                                alert.feeder_name || 'Unknown Feeder';

                            const delay = (ms) =>
                                new Promise((resolve) =>
                                    setTimeout(resolve, ms)
                                );

                            try {
                                const alertDesc = alert.alert_desc;
                                const alertValue = alert.value || '0.000';

                                let unit = '';
                                if (
                                    (alertDesc.includes('Phase)') &&
                                        alertDesc.includes('Missing')) ||
                                    alertDesc.includes('HT Fuse')
                                ) {
                                    unit = 'V';
                                } else if (
                                    alertDesc.includes('Fuse Blown') ||
                                    alertDesc.includes('CT Reversed') ||
                                    alertDesc.includes('Unbalanced Load')
                                ) {
                                    unit = 'A';
                                } else if (
                                    alertDesc.includes('Power Factor') ||
                                    alertDesc.includes('Low PF')
                                ) {
                                    unit = '';
                                }

                                let errorMessage = '';

                                if (
                                    alertDesc.includes('Unbalanced Load') ||
                                    alertDesc.includes('Load Imbalance')
                                ) {
                                    errorMessage = `${alertDesc}: Neutral Current = ${alertValue} A`;
                                } else if (
                                    alertDesc.includes('Power Failure')
                                ) {
                                    errorMessage = `Power Failure`;
                                } else {
                                    errorMessage = `${alertDesc}: ${alertValue} ${unit}`;
                                }

                                for (const contact of escalationContacts) {
                                    const smsService = msg91.getSMS();

                                    const recipients = [
                                        {
                                            mobile: contact.phone.startsWith(
                                                '91'
                                            )
                                                ? contact.phone
                                                : `91${contact.phone}`,
                                            var: dtrName,
                                            var1: feederName,
                                            var2: errorMessage,
                                            var3: alert.error_occured_at,
                                            DLT_TE_ID: config.DLT_TE_ID,
                                        },
                                    ];

                                    console.log(contact);

                                    const options = {
                                        senderId: config.MSG_SENDER_ID,
                                        route: '4',
                                        country: '91',
                                    };

                                    try {
                                        await smsService.send(
                                            config.MSG_TEMPLATE_ID,
                                            recipients[0],
                                            options
                                        );
                                    } catch (error) {
                                        console.log(error);
                                    }

                                    if (
                                        escalationContacts.indexOf(contact) <
                                        escalationContacts.length - 1
                                    ) {
                                        await delay(5000);
                                    }
                                }
                            } catch (error) {
                                console.log(error);
                            }
                        } catch (dbError) {
                            console.log(dbError);
                        }
                    }
                }
            } catch (error) {
                console.log(error);
            }
        },
        {
            timezone: 'Asia/Kolkata',
            scheduled: true,
        }
    );
};

app.listen(config.PORT, () => {
    logger.info(`Server is running on port ${config.PORT}`);
    console.log(`Server is running on port ${config.PORT}`);

    setupCronJobs();
});

server.listen(config.SOCKET_PORT, () => {
    console.log(`Socket Server is running on port ${config.SOCKET_PORT}`);
});

// ````````````````````````````````````````````````````````

// const passworGenerator = async () => {
//     const excludeIDs = [2, 3, 304, 305, 306];
//     try {
//         const [users] = await pool.query(
//             `
//             SELECT name
//             FROM users
//             WHERE id NOT IN (?)
//         `,
//             [excludeIDs]
//         );
//         for (let user of users) {
//             let ou = user.name;
//             let u = user.name + '@bi';
//             const salt = await bcrypt.genSalt(12);
//             const passwordHash = await bcrypt.hash(u, salt);
//             console.log(u, passwordHash);
//             await pool.query(
//                 `
//                 UPDATE users
//                 SET password = ?
//                 WHERE name = ?
//             `,
//                 [passwordHash, ou]
//             );
//         }
//     } catch (e) {
//         console.log(e);
//     }
// };
