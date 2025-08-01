import MSG91 from 'msg91';

class SMSService {
    constructor() {
        this.msg91 = MSG91.default;
        this.initialize();
    }

    initialize() {
        const authKey = process.env.MSG_AUTH_TOKEN;
        const senderId = process.env.MSG_SENDER_ID;
        const templateId = process.env.MSG_TEMPLATE_ID;
        const dltTeId = process.env.DLT_TE_ID;

        if (!authKey) {
            console.warn('⚠️ MSG_AUTH_TOKEN not found in environment variables');
            return;
        }

        this.msg91.initialize({
            authKey: authKey,
        });

        this.config = {
            senderId: senderId || 'BESTINFRA',
            templateId: templateId,
            dltTeId: dltTeId,
        };

        console.log('✅ SMS Service initialized');
    }

    async sendSMS(recipients, variables = {}) {
        try {
            if (!this.msg91) {
                console.warn('⚠️ SMS service not initialized');
                return false;
            }

            const smsService = this.msg91.getSMS();

            for (const recipient of recipients) {
                const formattedPhone = recipient.phone.startsWith('91') 
                    ? recipient.phone 
                    : `91${recipient.phone}`;

                const smsData = {
                    mobile: formattedPhone,
                    ...variables,
                    DLT_TE_ID: this.config.dltTeId,
                };

                const options = {
                    senderId: this.config.senderId,
                    route: '4',
                    country: '91',
                };

                console.log(`📱 Sending SMS to ${formattedPhone}`);
                
                await smsService.send(
                    this.config.templateId,
                    smsData,
                    options
                );

                console.log(`✅ SMS sent successfully to ${formattedPhone}`);
            }

            return true;
        } catch (error) {
            console.error('❌ Error sending SMS:', error);
            return false;
        }
    }

    async sendPowerAlert(alertData) {
        const { dtrName, feederName, errorMessage, errorOccurredAt, contacts } = alertData;

        const variables = {
            var: dtrName || 'Unknown DTR',
            var1: feederName || 'Unknown Feeder',
            var2: errorMessage || 'Power Alert',
            var3: errorOccurredAt || new Date().toISOString(),
        };

        return await this.sendSMS(contacts, variables);
    }

    async sendEscalationAlert(escalationData) {
        const { ticketId, level, contacts, ticketDetails } = escalationData;

        const variables = {
            var: `Ticket #${ticketId}`,
            var1: `Level ${level}`,
            var2: ticketDetails || 'Ticket requires attention',
            var3: new Date().toISOString(),
        };

        return await this.sendSMS(contacts, variables);
    }
}

export default new SMSService(); 