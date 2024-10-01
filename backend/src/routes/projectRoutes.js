const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/projectController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

router.get('/', authenticate, ProjectController.getProjectsByCompany);
router.post('/:projectId/users', authenticate, authorize(['Admin', 'Manager']), ProjectController.addUserToProject);
router.delete('/:projectId/users/:userId', authenticate, authorize(['Admin', 'Manager']), ProjectController.removeUserFromProject);

module.exports = router;
