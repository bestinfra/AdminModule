-- CreateTable
CREATE TABLE "alerts" (
    "id" SERIAL NOT NULL,
    "meterId" INTEGER,
    "type" VARCHAR(100) NOT NULL,
    "message" VARCHAR(500) NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    "escalationLevel" INTEGER NOT NULL DEFAULT 0,
    "errorOccurredAt" TIMESTAMP(3) NOT NULL,
    "smsSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "escalation_logs" (
    "id" SERIAL NOT NULL,
    "alertId" INTEGER NOT NULL,
    "escalationLevel" INTEGER NOT NULL,
    "escalatedAt" TIMESTAMP(3) NOT NULL,
    "contactsNotified" INTEGER NOT NULL,
    "smsSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "escalation_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_meterId_fkey" FOREIGN KEY ("meterId") REFERENCES "meters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escalation_logs" ADD CONSTRAINT "escalation_logs_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "alerts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
