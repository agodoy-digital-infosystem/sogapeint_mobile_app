// src/controllers/authController.js

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const AuthService = require('../services/authService');
const EmailService = require('../services/emailService');

const authController = {};

// Login Method
authController.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        // Find user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Generate JWT
        const token = AuthService.generateToken(user);

        // Prepare user data to return
        const userData = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            companyId: user.companyId,
            projectIds: user.projectIds
        };

        return res.status(200).json({ token, user: userData });
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

// Register Method
authController.register = async (req, res) => {
    try {
        const { firstName, lastName, email, role, companyId, projectIds } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !role || !companyId) {
            return res.status(400).json({ message: 'All required fields must be provided.' });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use.' });
        }

        // Generate a secure random password
        const password = AuthService.generateSecurePassword();

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({
            id: uuidv4(),
            firstName,
            lastName,
            email,
            role,
            companyId,
            projectIds,
            password: hashedPassword
        });

        // Send account creation email
        await EmailService.sendAccountCreationEmail(email, password);

        // Prepare user data to return
        const userData = {
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            role: newUser.role,
            companyId: newUser.companyId,
            projectIds: newUser.projectIds
        };

        return res.status(201).json(userData);
    } catch (error) {
        console.error('Register Error:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

// Logout Method
authController.logout = async (req, res) => {
    try {
        // Invalidate the JWT token if using a blacklist
        // This implementation depends on how AuthService manages tokens
        // For stateless JWT, logout is typically handled on the client side

        return res.status(200).json({ message: 'Logged out successfully.' });
    } catch (error) {
        console.error('Logout Error:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

// Request Password Reset Method
authController.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        // Find user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            // To prevent email enumeration, respond with success message
            return res.status(200).json({ message: 'Password reset link sent.' });
        }

        // Generate password reset token and expiration
        const { resetToken, resetTokenExpires } = AuthService.generatePasswordResetToken();

        // Update user with reset token and expiration
        user.resetToken = resetToken;
        user.resetTokenExpires = resetTokenExpires;
        await user.save();

        // Send password reset email
        await EmailService.sendPasswordResetEmail(email, resetToken);

        return res.status(200).json({ message: 'Password reset link sent.' });
    } catch (error) {
        console.error('Request Password Reset Error:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

// Reset Password Method
authController.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Token and new password are required.' });
        }

        // Validate the reset token
        const user = await AuthService.validatePasswordResetToken(token);

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired password reset token.' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password and clear reset token
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpires = null;
        await user.save();

        return res.status(200).json({ message: 'Password has been reset.' });
    } catch (error) {
        console.error('Reset Password Error:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = authController;
