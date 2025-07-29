import { escalateTickets } from './escalation.js';
import cronHandler from '../utils/cronHandler.js';

export async function initializeCronJobs() {
    try {
        await cronHandler.initialize();

        const jobs = [
            {
                name: 'ticket-escalation',
                schedule: '*/5 * * * * *',
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
            cronHandler.addJob(
                job.name,
                job.schedule,
                job.task,
                job.options
            );
        });

        cronHandler.startAllJobs();
        
        return cronHandler;
    } catch (error) {
        console.error('❌ Failed to initialize cron jobs:', error);
        throw error;
    }
}



export default cronHandler; 