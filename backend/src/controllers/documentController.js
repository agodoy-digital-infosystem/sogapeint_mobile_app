// documentController.js

const { Document, Project, User } = require('../models');
const NotificationService = require('../services/notificationService');
const multer = require('multer');
const path = require('path');

// Configure Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/documents/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter to allow only PDFs
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter }).single('file');

const uploadDocument = (req, res) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: err.message });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }

        const { title, projectId } = req.body;
        const file = req.file;

        if (!title || !projectId || !file) {
            return res.status(400).json({ message: 'Title, projectId, and file are required.' });
        }

        try {
            const project = await Project.findByPk(projectId);
            if (!project) {
                return res.status(404).json({ message: 'Project not found.' });
            }

            // Check user role
            const user = req.user;
            if (!['Admin', 'Collaborateur'].includes(user.role)) {
                return res.status(403).json({ message: 'Access denied.' });
            }

            const newDocument = await Document.create({
                title: title,
                type: 'sécurité',
                projectId: projectId,
                companyId: project.companyId,
                uploadedAt: new Date(),
                signedBy: []
            });

            // Send notification
            await NotificationService.sendDocumentNotification(newDocument.id);

            return res.status(201).json({
                message: 'Document uploaded successfully.',
                documentId: newDocument.id
            });
        } catch (error) {
            return res.status(500).json({ message: 'Server error.', error: error.message });
        }
    });
};

const getDocumentsByProject = async (req, res) => {
    const { projectId } = req.query;

    if (!projectId) {
        return res.status(400).json({ message: 'projectId query parameter is required.' });
    }

    try {
        const project = await Project.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        const documents = await Document.findAll({
            where: { projectId: projectId },
            attributes: ['id', 'title', 'type', 'projectId', 'companyId', 'uploadedAt', 'signedBy']
        });

        return res.status(200).json(documents);
    } catch (error) {
        return res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

const signDocument = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const document = await Document.findByPk(id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found.' });
        }

        // Check if user is associated with the project
        const project = await Project.findByPk(document.projectId);
        if (!project) {
            return res.status(404).json({ message: 'Associated project not found.' });
        }

        const user = await User.findByPk(userId);
        if (!user.projectIds.includes(project.id)) {
            return res.status(403).json({ message: 'You are not associated with this project.' });
        }

        // Check if already signed
        if (document.signedBy.includes(userId)) {
            return res.status(400).json({ message: 'Document already signed by this user.' });
        }

        // Update signedBy
        document.signedBy.push(userId);
        await document.save();

        return res.status(200).json({ message: 'Document signed successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

module.exports = {
    uploadDocument,
    getDocumentsByProject,
    signDocument
};
