/**
 * Notification Service
 * Centralized notification management
 */
const whatsappService = require('./whatsapp.service');
const smsService = require('./sms.service');

class NotificationService {
    /**
     * Send notification via multiple channels
     * @param {Object} options - Notification options
     * @param {String} options.type - Notification type (email, sms, whatsapp)
     * @param {String} options.to - Recipient
     * @param {String} options.subject - Notification subject
     * @param {String} options.message - Notification message
     */
    static async sendNotification({ type, to, subject, message }) {
        try {
            switch (type) {
                case 'whatsapp':
                    return await whatsappService.sendMessage(to, message);
                case 'sms':
                    return await smsService.sendSMS(to, message);
                default:
                    throw new Error(`Unsupported notification type: ${type}`);
            }
        } catch (error) {
            console.error(`Error sending ${type} notification:`, error);
            throw error;
        }
    }

    /**
     * Send worker registration confirmation
     * @param {String} phoneNumber - Worker phone number
     * @param {String} workerName - Worker name
     */
    static async sendWorkerRegistrationConfirmation(phoneNumber, workerName) {
        const message = `Hello ${workerName}! Your registration as a worker has been received. We'll review your application and get back to you soon.`;

        try {
            // Send via WhatsApp if available, fallback to SMS
            if (whatsappService.isEnabled()) {
                return await whatsappService.sendMessage(phoneNumber, message);
            } else if (smsService.isEnabled()) {
                return await smsService.sendSMS(phoneNumber, message);
            }

            console.log('Notification services not configured. Skipping notification.');
            return null;
        } catch (error) {
            console.error('Error sending registration confirmation:', error);
            // Don't throw - notification failure shouldn't break registration
            return null;
        }
    }
}

module.exports = NotificationService;

