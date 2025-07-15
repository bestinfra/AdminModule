import dotenv from 'dotenv';
import path from 'path';

// Load environment configurations
dotenv.config(); // Load main .env
dotenv.config({ path: path.join(process.cwd(), '.env.meter') }); // Load meter .env

const config = {
    // Application Configuration
    app: {
        name: 'Meter Management System',
        env: process.env.NODE_ENV || 'development',
        port: parseInt(process.env.PORT || '3000'),
        meterPort: parseInt(process.env.METER_APP_PORT || '3001'),
        apiPrefix: '/api'
    },

    // Database Configuration
    database: {
        admin: {
            url: process.env.DATABASE_URL,
            pool: {
                max: parseInt(process.env.DB_POOL_SIZE || '10'),
                timeout: parseInt(process.env.DB_CONNECT_TIMEOUT || '30')
            }
        },
        meter: {
            url: process.env.METER_DATABASE_URL,
            pool: {
                max: parseInt(process.env.METER_DB_POOL_SIZE || '10'),
                timeout: parseInt(process.env.METER_DB_CONNECT_TIMEOUT || '30')
            }
        }
    },

    // JWT Configuration
    jwt: {
        admin: {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRES_IN || '24h'
        },
        meter: {
            secret: process.env.METER_JWT_SECRET,
            expiresIn: process.env.METER_JWT_EXPIRES_IN || '24h'
        }
    },

    // Logging Configuration
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        meterLogLevel: process.env.METER_LOG_LEVEL || 'info',
        file: process.env.LOG_FILE || 'logs/app.log',
        meterLogFile: process.env.METER_LOG_FILE || 'logs/meter.log'
    },

    // Rate Limiting
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15 minutes
        max: parseInt(process.env.RATE_LIMIT_MAX || '100')
    },

    // Feature Flags
    features: {
        realTimeMonitoring: process.env.ENABLE_REAL_TIME_MONITORING === 'true',
        automatedReadings: process.env.ENABLE_AUTOMATED_READINGS === 'true',
        alerts: process.env.ENABLE_ALERTS === 'true'
    },

    // MQTT Configuration (if needed)
    mqtt: {
        enabled: process.env.MQTT_ENABLED === 'true',
        url: process.env.MQTT_BROKER_URL,
        username: process.env.MQTT_USERNAME,
        password: process.env.MQTT_PASSWORD
    },

    // Backup Configuration
    backup: {
        enabled: process.env.BACKUP_ENABLED === 'true',
        path: process.env.BACKUP_PATH || './backups',
        retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '30')
    }
};

// Environment-specific configurations
const envConfig = {
    development: {
        cors: {
            origin: '*'
        }
    },
    production: {
        cors: {
            origin: process.env.CORS_ORIGIN || '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
        }
    }
};

// Merge environment-specific config
Object.assign(config, envConfig[config.app.env] || {});

export default config; 