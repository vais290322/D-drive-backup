import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL || 'https://backend.aisensy.com';
const API_KEY = process.env.WHATSAPP_API_KEY;

export const sendWhatsAppNotification = async (
    destination: string,
    templateName: string,
    templateParams: string[]
) => {
    if (!API_KEY) {
        console.warn('WhatsApp API Key is missing. Notification skipped.');
        return;
    }

    try {
        const response = await axios.post(
            `${WHATSAPP_API_URL}/tata/test`, // Replace with actual AiSensy endpoint
            {
                to: destination,
                templateName: templateName,
                templateParams: templateParams,
            },
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('WhatsApp Notification Error:', error);
        // Don't throw to avoid blocking main flow
        return null;
    }
};
