const { Signature, User, Document } = require('../models');

const submitSignature = async (userId, documentId, signatureData) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const document = await Document.findByPk(documentId);
    if (!document) {
        throw new Error('Document not found');
    }

    const existingSignature = await Signature.findOne({
        where: { userId, documentId },
    });
    if (existingSignature) {
        throw new Error('Signature already exists for this user and document');
    }

    const signature = await Signature.create({
        userId,
        documentId,
        signatureData,
        signedAt: new Date(),
    });

    if (!document.signedBy.includes(userId)) {
        document.signedBy.push(userId);
        await document.save();
    }

    return signature;
};

const getSignaturesForDocument = async (documentId) => {
    const document = await Document.findByPk(documentId);
    if (!document) {
        throw new Error('Document not found');
    }

    const signatures = await Signature.findAll({
        where: { documentId },
        include: [{ model: User, attributes: ['firstName', 'lastName'] }],
    });

    return signatures.map(sig => ({
        signatureId: sig.id,
        userId: sig.userId,
        userName: `${sig.User.firstName} ${sig.User.lastName}`,
        signatureData: sig.signatureData,
        signedAt: sig.signedAt,
    }));
};

module.exports = {
    submitSignature,
    getSignaturesForDocument,
};
