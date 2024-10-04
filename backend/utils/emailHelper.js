const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const loadTemplate = (templateName, variables) => {
    const filePath = path.join(__dirname, '../templates', `${templateName}.html`);
    const source = fs.readFileSync(filePath, 'utf8');
    const template = handlebars.compile(source);
    return template(variables);
};

const sendAccountCreationEmail = (email, password) => {
    const html = loadTemplate('accountCreation', { 
        email, 
        password,
        frontendUrl: process.env.FRONTEND_URL,
        currentYear: new Date().getFullYear()
    });
    const mailOptions = {
        from: `"Sogapeint" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Bienvenue chez Sogapeint - Vos identifiants de connexion',
        html,
    };

    return transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = (email, token) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const html = loadTemplate('passwordReset', { 
        resetUrl,
        currentYear: new Date().getFullYear()
    });
    const mailOptions = {
        from: `"Sogapeint" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Réinitialisation de votre mot de passe',
        html,
    };

    return transporter.sendMail(mailOptions);
};

module.exports = {
    sendAccountCreationEmail,
    sendPasswordResetEmail,
};
