/**
 * passwordHelper.js
 * 
 * Utility functions for password management, including hashing, comparison, and generation.
 */

const bcrypt = require('bcrypt');
const crypto = require('crypto');

/**
 * Hashes a plain text password using bcrypt.
 * 
 * @param {string} password - The plain text password to hash.
 * @returns {Promise<string>} - A promise that resolves to the hashed password.
 */
const hashPassword = async (password) => {
    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};

/**
 * Compares a plain text password with a hashed password.
 * 
 * @param {string} password - The plain text password to compare.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @returns {Promise<boolean>} - A promise that resolves to true if the passwords match, false otherwise.
 */
const comparePassword = async (password, hashedPassword) => {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
};

/**
 * Generates a secure random password.
 * The password will contain at least 12 characters, including uppercase, lowercase, numbers, and special characters.
 * 
 * @returns {string} - The generated password.
 */
const generateRandomPassword = () => {
    const length = 12;
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';
    const allChars = uppercase + lowercase + numbers + specialChars;

    let password = '';
    // Ensure at least one character from each category
    password += uppercase.charAt(crypto.randomInt(0, uppercase.length));
    password += lowercase.charAt(crypto.randomInt(0, lowercase.length));
    password += numbers.charAt(crypto.randomInt(0, numbers.length));
    password += specialChars.charAt(crypto.randomInt(0, specialChars.length));

    // Fill the remaining length with random characters
    for (let i = 4; i < length; i++) {
        password += allChars.charAt(crypto.randomInt(0, allChars.length));
    }

    // Shuffle the password to ensure randomness
    password = shuffleString(password);
    return password;
};

/**
 * Shuffles a string using the Fisher-Yates algorithm.
 * 
 * @param {string} str - The string to shuffle.
 * @returns {string} - The shuffled string.
 */
const shuffleString = (str) => {
    const arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = crypto.randomInt(0, i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
};

/**
 * Generates a secure random token for password reset.
 * 
 * @returns {string} - The generated token.
 */
const generateResetToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

module.exports = {
    hashPassword,
    comparePassword,
    generateRandomPassword,
    generateResetToken
};
