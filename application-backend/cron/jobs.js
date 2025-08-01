import { escalateTickets } from './escalation.js';
import { monitorPowerData } from '../utils/powerMonitoring.js';
import cronHandler from '../utils/cronHandler.js';

export async function initializeCronJobs() {
    try {
        await cronHandler.initialize();

        const jobs = [
            {
                name: 'power-monitoring',
                schedule: '* * * * *', // Every minute
                task: monitorPowerData,
                options: {
                    timezone: 'Asia/Kolkata',
                    onError: (error, jobName) => {
                        console.error(`🚨 Critical error in ${jobName}:`, error);
                    }
                }
            },
            {
                name: 'ticket-escalation',
                schedule: '*/5 * * * *', // Every 5 minutes
                task: escalateTickets,
                options: {
                    timezone: 'Asia/Kolkata',
                    onError: (error, jobName) => {
                        console.error(`🚨 Critical error in ${jobName}:`, error);
                    }
                }
            },
        ];

        jobs.forEach(job => {
            try {
                cronHandler.addJob(
                    job.name,
                    job.schedule,
                    job.task,
                    job.options
                );
                console.log(`✅ Added cron job: ${job.name} (${job.schedule})`);
            } catch (error) {
                console.error(`❌ Failed to add job "${job.name}":`, error);
            }
        });

        cronHandler.startAllJobs();
        console.log('🚀 All cron jobs started successfully');
        
        return cronHandler;
    } catch (error) {
        console.error('❌ Failed to initialize cron jobs:', error);
        throw error;
    }
}

export default cronHandler; 