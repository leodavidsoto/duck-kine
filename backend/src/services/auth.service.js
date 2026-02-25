const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const env = require('../config/env');

class AuthService {
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
