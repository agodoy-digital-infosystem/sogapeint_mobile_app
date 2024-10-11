// services/emailServices.js
/**
 * Ce fichier contient les services pour l'envoi d'e-mails.
 */
const emailHelper = require('../../utils/emailHelper');

const sendAccountCreationEmail = async (email, password) => {
    try {
        await emailHelper.sendAccountCreationEmail(email, password);
        console.log(`Account creation email sent to ${email}`);
    } catch (error) {
        console.error(`Error sending account creation email to ${email}:`, error);
        throw error;
    }
};

const sendPasswordResetEmail = async (email, token) => {
    try {
        await emailHelper.sendPasswordResetEmail(email, token);
        console.log(`Password reset email sent to ${email}`);
    } catch (error) {
        console.error(`Error sending password reset email to ${email}:`, error);
        throw error;
    }
};

module.exports = {
    sendAccountCreationEmail,
    sendPasswordResetEmail,
};
