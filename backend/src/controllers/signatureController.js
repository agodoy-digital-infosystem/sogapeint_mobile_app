// signatureController.js
const Signature = require('../models/signatureModel');
const Document = require('../models/documentModel');
const User = require('../models/userModel');

// Initialiser le contrôleur de signature
const initController = (req, res) => {
    res.status(200).json({ message: 'Signature controller initialized' });
};

// Soumettre une signature électronique pour un document
const submitSignature = async (req, res) => {
    const { userId, documentId, signatureData } = req.body;

    try {
        // Vérifier l'existence du document et de l'utilisateur
        const document = await Document.findByPk(documentId);
        const user = await User.findByPk(userId);

        if (!document || !user) {
            return res.status(404).json({ message: 'Document or User not found' });
        }

        // Assurer que 'signedBy' est un tableau
        if (!Array.isArray(document.signedBy)) {
            document.signedBy = [];
        }

        // Enregistrer la signature
        const newSignature = await Signature.create({
            userId: userId,
            documentId: documentId,
            signatureData: signatureData,
            signedAt: new Date()
        });

        // Marquer le document comme signé par cet utilisateur
        document.signedBy.push(userId);
        await document.save();

        res.status(201).json({ message: 'Signature submitted successfully', signature: newSignature });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting signature', error: error.message });
    }
};

// Effacer la signature dans le widget
const clearSignature = (req, res) => {
    res.status(200).json({ message: 'Signature cleared' });
};

module.exports = {
    initController,
    submitSignature,
    clearSignature
};
