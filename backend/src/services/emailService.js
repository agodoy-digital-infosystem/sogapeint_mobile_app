// emailService.js

import nodemailer from 'nodemailer';

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    async sendAccountCreationEmail(email, password) {
        const mailOptions = {
            from: `"Sogapeint" <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: 'Bienvenue chez Sogapeint',
            text: `Bienvenue ! Votre compte a été créé.

Identifiants de connexion:
Email: ${email}
Mot de passe: ${password}

Veuillez vous connecter et changer votre mot de passe immédiatement.`,
            html: `<p>Bienvenue ! Votre compte a été créé.</p>
                   <p><strong>Identifiants de connexion:</strong></p>
                   <ul>
                     <li>Email: ${email}</li>
                     <li>Mot de passe: ${password}</li>
                   </ul>
                   <p>Veuillez vous connecter et changer votre mot de passe immédiatement.</p>`,
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error sending account creation email:', error);
            throw error;
        }
    }

    async sendPasswordResetEmail(email, token) {
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        const mailOptions = {
            from: `"Sogapeint" <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: 'Réinitialisation de votre mot de passe',
            text: `Vous avez demandé une réinitialisation de votre mot de passe.

Veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe:
${resetLink}

Ce lien est valable pendant 24 heures.`,
            html: `<p>Vous avez demandé une réinitialisation de votre mot de passe.</p>
                   <p>Veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe:</p>
                   <a href="${resetLink}">${resetLink}</a>
                   <p>Ce lien est valable pendant 24 heures.</p>`,
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error sending password reset email:', error);
            throw error;
        }
    }
}

export default new EmailService();
