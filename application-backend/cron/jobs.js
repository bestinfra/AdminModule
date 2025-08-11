import { escalateTickets } from './escalation.js';
import { generateMonthlyBillsTask } from './billing.js';
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
            // {
            //     name: 'billing-generation',
            //     schedule: '* * * * *', // Every minute
            //     task: generateMonthlyBillsTask,
            //     options: {
            //         timezone: 'Asia/Kolkata',
            //         onError: (error, jobName) => {
            //             console.error(`🚨 Critical error in ${jobName}:`, error);
            //             console.error(`   🔍 Error details:`, error.message);
            //         }
            //     }
            // },
        ];

        jobs.forEach(job => {
            try {
                cronHandler.addJob(
                    job.name,
                    job.schedule,
                    job.task,
                    job.options
                );
            } catch (error) {
                console.error(`❌ Failed to add job "${job.name}":`, error);
            }
        });

        cronHandler.startAllJobs();
        
        return cronHandler;
    } catch (error) {
        console.error('❌ Failed to initialize cron jobs:', error);
        throw error;
    }
}



export default cronHandler; 