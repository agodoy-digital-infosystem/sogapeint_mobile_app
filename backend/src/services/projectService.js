const { Project, User } = require('../models');

const getProjectsByCompany = async (companyId) => {
    try {
        const projects = await Project.findAll({
            where: { companyId },
            include: [{
                model: User,
                through: { attributes: [] }
            }]
        });
        return projects;
    } catch (error) {
        throw error;
    }
};

const addUserToProject = async (projectId, userId) => {
    try {
        const project = await Project.findByPk(projectId);
        if (!project) {
            throw new Error('Project not found');
        }

        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }

        await project.addUser(user);
        return project;
    } catch (error) {
        throw error;
    }
};

const removeUserFromProject = async (projectId, userId) => {
    try {
        const project = await Project.findByPk(projectId);
        if (!project) {
            throw new Error('Project not found');
        }

        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }

        await project.removeUser(user);
        return project;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getProjectsByCompany,
    addUserToProject,
    removeUserFromProject
};
