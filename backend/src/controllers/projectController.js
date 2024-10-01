const { Project, User } = require('../models');

const getProjectsByCompany = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const projects = await Project.findAll({
            where: { companyId },
            include: [{
                model: User,
                attributes: ['id', 'firstName', 'lastName', 'email'],
                through: { attributes: [] }
            }]
        });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const addUserToProject = async (req, res) => {
    try {
        const { projectId, userId } = req.body;

        const project = await Project.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await project.addUser(user);
        res.status(200).json({ message: 'User added to project successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const removeUserFromProject = async (req, res) => {
    try {
        const { projectId, userId } = req.body;

        const project = await Project.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await project.removeUser(user);
        res.status(200).json({ message: 'User removed from project successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getProjectsByCompany,
    addUserToProject,
    removeUserFromProject
};
