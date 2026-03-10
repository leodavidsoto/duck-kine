const env = require('./env');

const allowedOrigins = [
    env.FRONTEND_URL,
    'capacitor://localhost',
    'https://duckkine.cl',
    'https://www.duckkine.cl',
];

// Include localhost origins only in development
if (env.NODE_ENV !== 'production') {
    allowedOrigins.push(
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:4000',
        'http://127.0.0.1:4000',
        'https://localhost',
        'http://localhost'
    );
}

// Allow extra origins from env (comma-separated)
if (env.EXTRA_CORS_ORIGINS) {
    allowedOrigins.push(...env.EXTRA_CORS_ORIGINS.split(',').map(o => o.trim()));
}

const corsOptions = {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400,
};

module.exports = corsOptions;
