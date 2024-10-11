/**
 * This file contains the JWT configuration object.
 */

module.exports = {
    secret: process.env.JWT_SECRET,
    expiresIn: '1h',
}; // Export the JWT configuration object
