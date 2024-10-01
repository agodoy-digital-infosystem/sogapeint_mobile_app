const express = require('express');
const router = express.Router();
const DocumentController = require('../controllers/documentController');
const { authenticateJWT } = require('../middlewares/authenticate');
const { authorizeRoles } = require('../middlewares/authorize');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/documents/');
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ 
    storage: storage,
    fileFilter: function(req, file, cb){
        if(file.mimetype === 'application/pdf'){
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    }
});

// GET /documents
router.get('/', authenticateJWT, DocumentController.getDocuments);

// POST /documents
router.post('/', authenticateJWT, authorizeRoles('Admin', 'Collaborateur'), upload.single('file'), DocumentController.uploadDocument);

// GET /documents/:id
router.get('/:id', authenticateJWT, DocumentController.getDocumentById);

module.exports = router;
