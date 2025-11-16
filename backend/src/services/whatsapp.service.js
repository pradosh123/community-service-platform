const axios = require('axios');
const whatsappConfig = require('../config/whatsapp');

/**
 * WhatsApp Service
 * Handles WhatsApp messaging functionality
 */
class WhatsAppService {
    /**
     * Check if WhatsApp service is enabled
     * @returns {Boolean}
     */
    static isEnabled() {
        return whatsappConfig.enabled;
    }

    /**
     * Send WhatsApp message
     * @param {String} phoneNumber - Recipient phone number
     * @param {String} message - Message content
     * @returns {Promise<Object>} Response from WhatsApp API
     */
    static async sendMessage(phoneNumber, message) {
        if (!this.isEnabled()) {
            throw new Error('WhatsApp service is not configured');
        }

        try {
            const response = await axios.post(
                `${whatsappConfig.apiUrl}/send`,
                {
                    phone: phoneNumber,
                    message: message,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${whatsappConfig.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.error('WhatsApp API error:', error.response?.data || error.message);
            throw new Error('Failed to send WhatsApp message');
        }
    }
}

module.exports = WhatsAppService;

