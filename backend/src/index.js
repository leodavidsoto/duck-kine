require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createServer } = require('http');
const { Server: SocketServer } = require('socket.io');

const env = require('./config/env');
const corsOptions = require('./config/cors');
const { generalLimiter } = require('./middleware/rateLimiter');
const { errorHandler } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth.routes');
const patientsRoutes = require('./routes/patients.routes');
const clinicalRecordsRoutes = require('./routes/clinicalRecords.routes');
const appointmentsRoutes = require('./routes/appointments.routes');
const paymentsRoutes = require('./routes/payments.routes');
const sportsProgramsRoutes = require('./routes/sportsPrograms.routes');
const academyRoutes = require('./routes/academy.routes');
const corporateRoutes = require('./routes/corporate.routes');
const franchiseRoutes = require('./routes/franchise.routes');
const professionalsRoutes = require('./routes/professionals.routes');
const servicesRoutes = require('./routes/services.routes');
const adminRoutes = require('./routes/admin.routes');

// ─── Express App ────────────────────────────────────────
const app = express();
const httpServer = createServer(app);

// Socket.io for realtime notifications
const io = new SocketServer(httpServer, { cors: corsOptions });

// ─── Middleware ─────────────────────────────────────────
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(generalLimiter);

// Multi-tenant clinic context
const { extractClinic } = require('./middleware/tenant');
app.use(extractClinic);

// ─── Health Check ───────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        name: 'Duck Kinesiología API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        environment: env.NODE_ENV,
    });
});

// ─── API Routes ─────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientsRoutes);
app.use('/api/clinical-records', clinicalRecordsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/sports-programs', sportsProgramsRoutes);
app.use('/api/academy', academyRoutes);
app.use('/api/corporate', corporateRoutes);
app.use('/api/franchise', franchiseRoutes);
app.use('/api/professionals', professionalsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/admin', adminRoutes);

// ─── 404 Handler ────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ error: `Ruta ${req.originalUrl} no encontrada` });
});

// ─── Error Handler ──────────────────────────────────────
app.use(errorHandler);

// ─── Socket.io Events ───────────────────────────────────
io.on('connection', (socket) => {
    console.log(`🔌 Cliente conectado: ${socket.id}`);

    socket.on('join', (userId) => {
        socket.join(`user:${userId}`);
        console.log(`👤 Usuario ${userId} se unió a su canal`);
    });

    socket.on('disconnect', () => {
        console.log(`🔌 Cliente desconectado: ${socket.id}`);
    });
});

// Make io accessible to routes
app.set('io', io);

// ─── Start Server ───────────────────────────────────────
const PORT = env.PORT;
httpServer.listen(PORT, () => {
    // Start automated patient journey scheduler
    const scheduler = require('./scheduler');
    scheduler.start();

    console.log(`
  🦆 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     Duck Kinesiología API
     Puerto: ${PORT}
     Entorno: ${env.NODE_ENV}
     Health: http://localhost:${PORT}/api/health
     Scheduler: ✅ activo
  🦆 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});

module.exports = { app, httpServer, io };
