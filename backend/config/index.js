// config/index.js

const jwtConfig = require('./jwtConfig');
const envConfig = require('./env');

module.exports = {
    ...jwtConfig,
    ...envConfig,
};
