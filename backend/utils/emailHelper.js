const nodemailer = require('nodemailer');

// Configure the email transporter using environment variables
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Verify the transporter configuration
transporter.verify(function(error, success) {
    if (error) {
        console.error('Error configuring email transporter:', error);
    } else {
        console.log('Email transporter is configured successfully.');
    }
});

/**
 * Sends an account creation email to a new user with their login credentials.
 * @param {string} email - The recipient's email address.
 * @param {string} password - The generated password for the user.
 */
const sendAccountCreationEmail = async (email, password) => {
    const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: 'Bienvenue chez Sogapeint - Vos identifiants de connexion',
        html: `
            <p>Bonjour,</p>
            <p>Votre compte a été créé avec succès.</p>
            <p>Voici vos identifiants de connexion :</p>
            <ul>
                <li><strong>Email :</strong> ${email}</li>
                <li><strong>Mot de passe :</strong> ${password}</li>
            </ul>
            <p>Veuillez vous connecter en utilisant le lien suivant :</p>
            <p><a href="${process.env.FRONTEND_URL}/login">Se connecter</a></p>
            <p>Merci,<br/>L'équipe Sogapeint</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Account creation email sent to ${email}`);
    } catch (error) {
        console.error(`Failed to send account creation email to ${email}:`, error);
        throw error;
    }
};

/**
 * Sends a password reset email to the user with a secure reset link.
 * @param {string} email - The recipient's email address.
 * @param {string} token - The password reset token.
 */
const sendPasswordResetEmail = async (email, token) => {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: 'Réinitialisation de votre mot de passe - Sogapeint',
        html: `
            <p>Bonjour,</p>
            <p>Nous avons reçu une demande de réinitialisation de votre mot de passe.</p>
            <p>Veuillez cliquer sur le lien suivant pour définir un nouveau mot de passe :</p>
            <p><a href="${resetLink}">Réinitialiser le mot de passe</a></p>
            <p>Ce lien est valable pendant 24 heures.</p>
            <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
            <p>Merci,<br/>L'équipe Sogapeint</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Password reset email sent to ${email}`);
    } catch (error) {
        console.error(`Failed to send password reset email to ${email}:`, error);
        throw error;
    }
};

module.exports = {
    sendAccountCreationEmail,
    sendPasswordResetEmail,
};
