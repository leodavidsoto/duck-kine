require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const env = {
    PORT: process.env.PORT || 4000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-change-me',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    FRONTEND_URL: process.env.FRONTEND_URL || 'https://duckkine.cl',
    BACKEND_URL: process.env.BACKEND_URL || 'https://api.duckkine.cl/api',
    TRANSBANK_COMMERCE_CODE: process.env.TRANSBANK_COMMERCE_CODE,
    TRANSBANK_API_KEY: process.env.TRANSBANK_API_KEY,
    TRANSBANK_ENV: process.env.TRANSBANK_ENV || 'integration',
    EMAIL_API_KEY: process.env.EMAIL_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM || 'no-reply@duckkinesiologia.cl',
    EXTRA_CORS_ORIGINS: process.env.EXTRA_CORS_ORIGINS || '',
    // WhatsApp
    WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID,
    WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN,
    WHATSAPP_VERIFY_TOKEN: process.env.WHATSAPP_VERIFY_TOKEN || 'duckkine-verify',
    WHATSAPP_APP_SECRET: process.env.WHATSAPP_APP_SECRET,
    // Claude AI
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
};

module.exports = env;
