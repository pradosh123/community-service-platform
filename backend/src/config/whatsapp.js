/**
 * WhatsApp Service Configuration
 * Configure WhatsApp API integration
 */
const whatsappConfig = {
    apiUrl: process.env.WHATSAPP_API_URL || '',
    apiKey: process.env.WHATSAPP_API_KEY || '',
    enabled: !!(process.env.WHATSAPP_API_URL && process.env.WHATSAPP_API_KEY),
};

module.exports = whatsappConfig;

