import { escalationLevels } from './utils/escalationLevels.js';

export async function escalateTickets(prisma) {
    try {
        try {
            const [activeAlerts] = await pool.query(
                `SELECT a.alert_id, a.alert_desc, a.meterId, a.location, a.datetime, a.escalation_level, a.escalation_time, a.value, a.error_occured_at,
                    d.dtrNumber
                FROM alerts_tgnpdcl AS a
                LEFT JOIN meters f ON a.meterId = f.meterId
                LEFT JOIN dtrs d ON f.dtr_id = d.id
                WHERE a.status = 'start'
                AND a.escalation_level < ?
                AND NOT EXISTS (
                    SELECT 1
                    FROM ntpl.alerts_tgnpdcl AS b
                    WHERE a.meterId = b.meterId
                    AND a.alert_desc = b.alert_desc
                    AND b.status = 'end'
                )`,
                [escalationLevels.length - 1]
            );

            // if (activeAlerts.length === 0) {
            //     return;
            // }

            // for (const alert of activeAlerts) {
            //     const currentLevel = alert.escalation_level;
            //     const lastUpdated = alert.escalation_time || alert.datetime;
            //     const currentTime = new Date();

            //     const minutesSinceUpdate = Math.floor(
            //         (currentTime - new Date(lastUpdated)) / (1000 * 60)
            //     );

            //     const timeForNextLevel =
            //         escalationLevels[currentLevel].timeToEscalate;

            //     if (minutesSinceUpdate >= timeForNextLevel) {
            //         const nextLevel = parseInt(currentLevel) + 1;

            //         try {
            //             await pool.query(
            //                 `UPDATE alerts_tgnpdcl
            //         SET escalation_level = ?, escalation_time = NOW()
            //         WHERE alert_id = ?`,
            //                 [nextLevel, alert.alert_id]
            //             );

            //             const escalationContacts =
            //                 escalationLevels[currentLevel].contacts;
            //             const dtrName = alert.dtrNumber || 'Unknown DTR';
            //             const feederName =
            //                 alert.meterId || 'Unknown Feeder';

            //             const delay = (ms) =>
            //                 new Promise((resolve) =>
            //                     setTimeout(resolve, ms)
            //                 );

            //             try {
            //                 const alertDesc = alert.alert_desc;
            //                 const alertValue = alert.value || '0.000';

            //                 let unit = '';
            //                 if (
            //                     (alertDesc.includes('Phase)') &&
            //                         alertDesc.includes('Missing')) ||
            //                     alertDesc.includes('HT Fuse')
            //                 ) {
            //                     unit = 'V';
            //                 } else if (
            //                     alertDesc.includes('Fuse Blown') ||
            //                     alertDesc.includes('CT Reversed') ||
            //                     alertDesc.includes('Unbalanced Load')
            //                 ) {
            //                     unit = 'A';
            //                 } else if (
            //                     alertDesc.includes('Power Factor') ||
            //                     alertDesc.includes('Low PF')
            //                 ) {
            //                     unit = '';
            //                 }

            //                 let errorMessage = '';

            //                 if (
            //                     alertDesc.includes('Unbalanced Load') ||
            //                     alertDesc.includes('Load Imbalance')
            //                 ) {
            //                     errorMessage = `${alertDesc}: Neutral Current = ${alertValue} A`;
            //                 } else if (
            //                     alertDesc.includes('Power Failure')
            //                 ) {
            //                     errorMessage = `Power Failure`;
            //                 } else {
            //                     errorMessage = `${alertDesc}: ${alertValue} ${unit}`;
            //                 }

            //                 for (const contact of escalationContacts) {
            //                     const smsService = msg91.getSMS();

            //                     const recipients = [
            //                         {
            //                             mobile: contact.phone.startsWith(
            //                                 '91'
            //                             )
            //                                 ? contact.phone
            //                                 : `91${contact.phone}`,
            //                             var: dtrName,
            //                             var1: feederName,
            //                             var2: errorMessage,
            //                             var3: alert.error_occured_at,
            //                             DLT_TE_ID: config.DLT_TE_ID,
            //                         },
            //                     ];

            //                     console.log(contact);

            //                     const options = {
            //                         senderId: config.MSG_SENDER_ID,
            //                         route: '4',
            //                         country: '91',
            //                     };

            //                     try {
            //                         await smsService.send(
            //                             config.MSG_TEMPLATE_ID,
            //                             recipients[0],
            //                             options
            //                         );
            //                     } catch (error) {
            //                         console.log(error);
            //                     }

            //                     if (
            //                         escalationContacts.indexOf(contact) <
            //                         escalationContacts.length - 1
            //                     ) {
            //                         await delay(5000);
            //                     }
            //                 }
            //             } catch (error) {
            //                 console.log(error);
            //             }
            //         } catch (dbError) {
            //             console.log(dbError);
            //         }
            //     }
            // }
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        console.error('❌ Error in escalation job:', error);
        throw error;
    }
}