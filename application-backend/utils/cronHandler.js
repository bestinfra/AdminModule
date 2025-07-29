import { CronJob } from 'cron';
import { PrismaClient } from '@prisma/client';

class CronJobHandler {
    constructor() {
        this.jobs = new Map();
        this.prisma = new PrismaClient();
        this.isInitialized = false;
    }

    async initialize() {
        if (this.isInitialized) {
            console.log('⚠️ Cron handler already initialized');
            return;
        }

        try {
            await this.prisma.$connect();
            console.log('✅ Cron handler database connection established');
            
            this.isInitialized = true;
            console.log('✅ Cron job handler initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize cron handler:', error);
            throw error;
        }
    }

    
    startAllJobs() {
        console.log('🚀 Starting all cron jobs...');
        this.jobs.forEach((jobData, name) => {
            jobData.job.start();
            console.log(`▶️ Started: ${name}`);
        });
        console.log(`✅ Started ${this.jobs.size} cron jobs`);
    }

    addJob(name, schedule, task, options = {}) {
        if (this.jobs.has(name)) {
            console.warn(`⚠️ Job "${name}" already exists, replacing...`);
            this.removeJob(name);
        }

        const job = new CronJob(
            schedule,
            async () => {
                try {
                    console.log(`🕐 Executing cron job: ${name}`);
                    await task(this.prisma);
                    console.log(`✅ Cron job "${name}" completed successfully`);
                } catch (error) {
                    console.error(`❌ Cron job "${name}" failed:`, error);
                    
                    if (options.onError) {
                        options.onError(error, name);
                    }
                }
            },
            null,
            false, 
            options.timezone || 'UTC'
        );

        this.jobs.set(name, {
            job,
            schedule,
            task: task.toString(),
            options,
            lastRun: null,
            nextRun: job.nextDate().toDate()
        });

        console.log(`📅 Added cron job: ${name} (${schedule})`);
        return job;
    }
}


const cronHandler = new CronJobHandler();

export default cronHandler; 