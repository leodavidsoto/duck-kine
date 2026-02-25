require('dotenv').config();

const env = {
    PORT: process.env.PORT || 4000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-change-me',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
    TRANSBANK_COMMERCE_CODE: process.env.TRANSBANK_COMMERCE_CODE,
    TRANSBANK_API_KEY: process.env.TRANSBANK_API_KEY,
    TRANSBANK_ENV: process.env.TRANSBANK_ENV || 'integration',
    EMAIL_API_KEY: process.env.EMAIL_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM || 'no-reply@duckkinesiologia.cl',
};

module.exports = env;
