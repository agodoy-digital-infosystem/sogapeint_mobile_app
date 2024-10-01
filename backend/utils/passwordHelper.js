const bcrypt = require('bcrypt');
const crypto = require('crypto');

/**
 * Generates a random password with at least 12 characters, including uppercase, lowercase, numbers, and special characters.
 * @returns {string} The generated password.
 */
const generateRandomPassword = () => {
    const length = 12;
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    const allChars = uppercase + lowercase + numbers + specialChars;

    let password = '';
    password += uppercase.charAt(crypto.randomInt(0, uppercase.length));
    password += lowercase.charAt(crypto.randomInt(0, lowercase.length));
    password += numbers.charAt(crypto.randomInt(0, numbers.length));
    password += specialChars.charAt(crypto.randomInt(0, specialChars.length));

    for (let i = 4; i < length; i++) {
        password += allChars.charAt(crypto.randomInt(0, allChars.length));
    }

    // Shuffle the password to prevent predictable patterns
    password = password.split('').sort(() => 0.5 - Math.random()).join('');
    return password;
};

/**
 * Hashes a password using bcrypt.
 * @param {string} password - The plain text password.
 * @returns {Promise<string>} The hashed password.
 */
const hashPassword = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

/**
 * Compares a plain text password with a hashed password.
 * @param {string} password - The plain text password.
 * @param {string} hashedPassword - The hashed password.
 * @returns {Promise<boolean>} True if the passwords match, false otherwise.
 */
const comparePassword = async (password, hashedPassword) => {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
};

/**
 * Generates a secure random token for password reset.
 * @returns {string} The generated token.
 */
const generateResetToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

module.exports = {
    generateRandomPassword,
    hashPassword,
    comparePassword,
    generateResetToken
};
