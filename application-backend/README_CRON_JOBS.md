# Cron Jobs and SMS Alerting System

This document describes the cron jobs and SMS alerting functionality implemented in the application backend.

## Overview

The system includes two main cron jobs:

1. **Power Data Monitoring** - Runs every minute
2. **Escalation Handler** - Runs every 5 minutes

Both jobs include SMS alerting functionality using MSG91.

## Cron Jobs

### 1. Power Data Monitoring (Every Minute)

**Schedule:** `* * * * *` (Every minute)

**Function:** `monitorPowerData()`

**What it does:**
- Monitors all active meters for power-related issues
- Checks for the following alert conditions:
  - Zero or negative power readings
  - Load imbalance (>20% deviation)
  - Low power factor (<85%)
  - Low voltage (<200V)
  - Frequency deviation (<49Hz or >51Hz)

**SMS Alerts:**
- Sends immediate SMS alerts to Level 0 contacts
- Uses MSG91 service for SMS delivery
- Includes DTR name, feeder name, error message, and timestamp

### 2. Escalation Handler (Every 5 Minutes)

**Schedule:** `*/5 * * * *` (Every 5 minutes)

**Function:** `escalateTickets()`

**What it does:**
- Checks for active alerts that need escalation
- Escalates alerts based on time thresholds:
  - Level 0 → Level 1: 15 minutes
  - Level 1 → Level 2: 20 minutes
  - Level 2 → Level 3: 30 minutes
  - Level 3 → Level 4: 45 minutes
  - Level 4 → Level 5: 60 minutes

**SMS Alerts:**
- Sends escalation SMS to appropriate level contacts
- Includes ticket ID, escalation level, and details

## SMS Configuration

### Required Environment Variables

Add these to your `.env` file:

```env
# MSG91 Configuration
MSG_AUTH_TOKEN="your_msg91_auth_token"
MSG_SENDER_ID="BESTINFRA"
MSG_TEMPLATE_ID="your_template_id"
DLT_TE_ID="your_dlt_te_id"
```

### SMS Template Variables

The SMS service uses the following template variables:

**Power Alerts:**
- `var`: DTR Name
- `var1`: Feeder Name
- `var2`: Error Message
- `var3`: Error Occurred At (timestamp)

**Escalation Alerts:**
- `var`: Ticket ID
- `var1`: Escalation Level
- `var2`: Ticket Details
- `var3`: Timestamp

## Database Models

### Alert Model

```sql
model Alert {
  id                Int       @id @default(autoincrement())
  meterId           Int?
  type              String    @db.VarChar(100)
  message           String    @db.VarChar(500)
  status            String    @default("ACTIVE")
  escalationLevel   Int       @default(0)
  errorOccurredAt   DateTime
  smsSent           Boolean   @default(false)
  
  meter             Meter?    @relation(fields: [meterId], references: [id])
  escalationLogs    EscalationLog[]
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}
```

### EscalationLog Model

```sql
model EscalationLog {
  id                Int       @id @default(autoincrement())
  alertId           Int
  escalationLevel   Int
  escalatedAt       DateTime
  contactsNotified  Int
  smsSent           Boolean   @default(false)
  
  alert             Alert     @relation(fields: [alertId], references: [id])
  
  createdAt         DateTime  @default(now())
}
```

## Escalation Levels

The system uses 6 escalation levels (0-5) with the following contacts:

### Level 0 (Initial Alert)
- Line Managers (7 contacts)

### Level 1 (15 minutes)
- Line Inspector
- Senior Line Inspector
- Field Managers (2 contacts)

### Level 2 (20 minutes)
- Assistant Engineer

### Level 3 (30 minutes)
- Assistant Divisional Engineer

### Level 4 (45 minutes)
- Divisional Engineer

### Level 5 (60 minutes)
- Senior Management (3 contacts)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Add MSG91 dependency:
```bash
npm install msg91
```

3. Set up environment variables (see SMS Configuration above)

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the server:
```bash
npm start
```

## Monitoring

The cron jobs log their activities with the following prefixes:
- 🔍 Power monitoring started
- ✅ Power monitoring completed
- 🔄 Escalation check started
- 🚨 Alert escalated
- 📱 SMS sent
- ❌ Error occurred

Check the server logs to monitor the cron job execution and any errors.

## Troubleshooting

### SMS Not Sending
1. Verify MSG91 credentials in environment variables
2. Check if MSG_AUTH_TOKEN is valid
3. Ensure template ID is correct
4. Verify phone numbers are in correct format (91XXXXXXXXXX)

### Cron Jobs Not Running
1. Check if cronHandler is properly initialized
2. Verify timezone settings
3. Check server logs for initialization errors

### Database Errors
1. Ensure Prisma schema is up to date
2. Run `npx prisma generate` to update client
3. Check database connection 