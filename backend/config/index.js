// config/index.js
/**
 * Ce fichier combine les configurations d'environnement et de JWT
 * pour les exporter en tant qu'objet de configuration unique.
 * 
 * Il est utilisé pour simplifier l'importation des configurations dans d'autres fichiers.
 */

const jwtConfig = require('./jwtConfig');
const envConfig = require('./env');

module.exports = {
    ...jwtConfig,
    ...envConfig,
}; // Export the merged configuration object
