const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const env = require('../config/env');

// In-memory reset code store: { email: { code, expiresAt } }
const resetCodes = {};

class AuthService {
    async forgotPassword({ email }) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            // Don't reveal whether user exists — return success either way
            return { message: 'Si el email existe, recibirás un código de recuperación.' };
        }

        const code = String(Math.floor(100000 + Math.random() * 900000));
        resetCodes[email] = { code, expiresAt: Date.now() + 15 * 60 * 1000 };

        // Log code to console (no email service)
        console.log(`\n  🔑 Código de recuperación para ${email}: ${code}\n`);

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
