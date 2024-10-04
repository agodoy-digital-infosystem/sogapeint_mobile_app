const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/userModel');
const config = require('../../config');

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

        // Mettez à jour le user avec le token et la date d'expiration
        user.passwordResetToken = token;
        user.passwordResetExpires = new Date(expires);
        await user.save();

        return token;
    }

    static async validatePasswordResetToken(token) {
        const user = await User.findOne({
            where: {
                passwordResetToken: token,
                passwordResetExpires: {
                    [require('sequelize').Op.gt]: new Date(),
                },
            },
        });

        if (!user) {
            throw new Error('Invalid or expired password reset token');
        }

        return user;
    }
}

module.exports = AuthService;
