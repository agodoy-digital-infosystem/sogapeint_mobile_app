/**
 * Ce fichier représente le point d'entrée des routes pour les signatures électroniques.
 */
const express = require('express');
const SignatureController = require('../controllers/signatureController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Soumettre une signature électronique
router.post('/', authenticateToken, SignatureController.submitSignature);

// Initialiser le contrôleur de signature
router.get('/init', authenticateToken, SignatureController.initController);

// Effacer une signature
router.delete('/clear', authenticateToken, SignatureController.clearSignature);


module.exports = router;
