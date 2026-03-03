const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const env = require('../config/env');

// TODO: Migrate to database-backed reset codes for production scalability
// In-memory store — codes are lost on server restart
const resetCodes = {};

// Clean up expired reset codes every 5 minutes to prevent memory leaks
setInterval(() => {
    const now = Date.now();
    for (const email of Object.keys(resetCodes)) {
        if (now > resetCodes[email].expiresAt) {
            delete resetCodes[email];
        }
    }
}, 5 * 60 * 1000);

class AuthService {
    async forgotPassword({ email }) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return { message: 'Si el email existe, recibirás un código de recuperación.' };
        }

        const code = String(Math.floor(100000 + Math.random() * 900000));
        resetCodes[email] = { code, expiresAt: Date.now() + 15 * 60 * 1000 };

        // TODO: Integrate email service (SendGrid/Resend) for production
        if (env.NODE_ENV !== 'production') {
            console.log(`[AUTH-DEV] Reset code for ${email}: ${code}`);
        }

        return { message: 'Si el email existe, recibirás un código de recuperación.' };
    }

    async resetPassword({ email, code, newPassword }) {
        const entry = resetCodes[email];
        if (!entry || entry.code !== code || Date.now() > entry.expiresAt) {
            throw Object.assign(new Error('Código inválido o expirado'), { statusCode: 400 });
        }

        const passwordHash = await bcrypt.hash(newPassword, 12);
        await prisma.user.update({ where: { email }, data: { passwordHash } });
        delete resetCodes[email];

        return { message: 'Contraseña actualizada exitosamente' };
    }

    async register({ email, password, firstName, lastName, rut, phone }) {
        const passwordHash = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                firstName,
                lastName,
                rut,
                phone,
                role: 'PATIENT',
                patient: { create: {} },
            },
            include: { patient: true },
        });

        const token = this.generateToken(user.id);
        return { user: this.sanitizeUser(user), token };
    }

    async login({ email, password }) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw Object.assign(new Error('Credenciales inválidas'), { statusCode: 401 });

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) throw Object.assign(new Error('Credenciales inválidas'), { statusCode: 401 });

        if (!user.isActive) throw Object.assign(new Error('Cuenta desactivada'), { statusCode: 403 });

        const token = this.generateToken(user.id);
        return { user: this.sanitizeUser(user), token };
    }

    generateToken(userId) {
        return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
    }

    sanitizeUser(user) {
        const { passwordHash, ...safe } = user;
        return safe;
    }
}

module.exports = new AuthService();
