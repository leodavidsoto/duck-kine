const env = require('./env');

const corsOptions = {
    origin: [env.FRONTEND_URL, 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400,
};

module.exports = corsOptions;
