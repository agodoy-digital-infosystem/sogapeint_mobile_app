/**
 * Ce fichier contient les services pour la gestion des documents.
 */
const { Document, Project, User, Signature } = require('../models');

const uploadDocument = async (title, type, fileUrl, projectId, companyId) => {
    const document = await Document.create({
        title,
        type,
        fileUrl,
        projectId,
        companyId,
        uploadedAt: new Date(),
    });
    return document;
};

const getDocumentsByProject = async (projectId) => {
    const documents = await Document.findAll({
        where: { projectId },
    });
    return documents;
};

const getDocumentById = async (documentId) => {
    const document = await Document.findByPk(documentId);
    return document;
};

const signDocument = async (documentId, userId, signatureData) => {
    const document = await Document.findByPk(documentId);
    if (!document) {
        throw new Error('Document not found');
    }
    const signature = await Signature.create({
        userId,
        documentId,
        signatureData,
        signedAt: new Date(),
    });
    let signedBy = document.signedBy || [];
    if (!signedBy.includes(userId)) {
        signedBy.push(userId);
        document.signedBy = signedBy;
        await document.save();
    }
    return signature;
};

module.exports = {
    uploadDocument,
    getDocumentsByProject,
    getDocumentById,
    signDocument,
};
