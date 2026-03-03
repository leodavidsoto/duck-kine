const env = require('./env');

const corsOptions = {
    origin: [
        env.FRONTEND_URL,
        'http://localhost:3000',
        'https://duckkine.cl',
        'https://www.duckkine.cl',
        'https://backend-production-1a1b7.up.railway.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400,
};

module.exports = corsOptions;
