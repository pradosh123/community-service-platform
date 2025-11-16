const axios = require('axios');

/**
 * SMS Service
 * Handles SMS messaging functionality
 */
class SMSService {
    /**
     * Check if SMS service is enabled
     * @returns {Boolean}
     */
    static isEnabled() {
        return !!(process.env.SMS_API_URL && process.env.SMS_API_KEY);
    }

    /**
     * Send SMS
     * @param {String} phoneNumber - Recipient phone number
     * @param {String} message - Message content
     * @returns {Promise<Object>} Response from SMS API
     */
    static async sendSMS(phoneNumber, message) {
        if (!this.isEnabled()) {
            throw new Error('SMS service is not configured');
        }

        try {
            const response = await axios.post(
                process.env.SMS_API_URL,
                {
                    to: phoneNumber,
                    message: message,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.SMS_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.error('SMS API error:', error.response?.data || error.message);
            throw new Error('Failed to send SMS');
        }
    }
}

module.exports = SMSService;

