// authService.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { User, PasswordReset } = require('../models');
const config = require('../config');

class AuthService {
    static generateToken(user) {
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
        return jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });
    }

    static verifyToken(token) {
        try {
            return jwt.verify(token, config.JWT_SECRET);
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    static async generatePasswordResetToken(user) {
        const token = crypto.randomBytes(32).toString('hex');
        const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        await PasswordReset.create({
            userId: user.id,
            resetToken: token,
            expiresAt: new Date(expires),
        });

        return token;
    }

    static async validatePasswordResetToken(token) {
        const passwordReset = await PasswordReset.findOne({
            where: {
                resetToken: token,
                expiresAt: {
                    [require('sequelize').Op.gt]: new Date(),
                },
            },
            include: [User],
        });

        if (!passwordReset) {
            throw new Error('Invalid or expired password reset token');
        }

        return passwordReset.User;
    }
}

module.exports = AuthService;
