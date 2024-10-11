// services/leaveService.js
/**
 * Ce fichier contient les services pour la gestion des congés.
 */

const { Leave, User, Project } = require('../models');
const NotificationService = require('./notificationService');
const { Op } = require('sequelize');

const getLeaves = async (user, query) => {
    try {
        const { status } = query;
        const whereClause = {};

        if (status) {
            whereClause.status = status;
        }

        if (user.role === 'User') {
            whereClause.userId = user.id;
        } else if (user.role === 'Manager') {
            const projects = await Project.findAll({
                where: { companyId: user.companyId },
                include: [{ model: User, as: 'Users', where: { managerId: user.id } }]
            });
            const userIds = projects.flatMap(project => project.Users.map(u => u.id));
            whereClause.userId = { [Op.in]: userIds };
        } else if (user.role === 'Admin') {
            // Admin can see all leaves
        } else {
            throw new Error('Unauthorized');
        }

        const leaves = await Leave.findAll({
            where: whereClause,
            include: [{ model: User, as: 'User' }]
        });

        return leaves;
    } catch (error) {
        throw error;
    }
};

const submitLeave = async (leaveData) => {
    try {
        const { userId, type, startDate, endDate, description } = leaveData;

        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const leave = await Leave.create({
            userId,
            type,
            startDate,
            endDate,
            description,
            status: 'en attente',
            submittedAt: new Date()
        });

        // Send notification to Manager
        const manager = await User.findOne({ where: { id: user.managerId } });
        if (manager) {
            await NotificationService.sendLeaveRequestNotification(leave.id, manager.id);
        }

        return leave;
    } catch (error) {
        throw error;
    }
};

const approveLeave = async (leaveId, managerId) => {
    try {
        const leave = await Leave.findByPk(leaveId, { include: [{ model: User, as: 'User' }] });
        if (!leave) {
            throw new Error('Leave request not found');
        }

        if (leave.status !== 'en attente') {
            throw new Error('Leave request is not pending');
        }

        leave.status = 'approuvé';
        await leave.save();

        // Send notification to User
        await NotificationService.sendLeaveApprovalNotification(leave.id, leave.status, leave.User.id);

        return leave;
    } catch (error) {
        throw error;
    }
};

const rejectLeave = async (leaveId, managerId) => {
    try {
        const leave = await Leave.findByPk(leaveId, { include: [{ model: User, as: 'User' }] });
        if (!leave) {
            throw new Error('Leave request not found');
        }

        if (leave.status !== 'en attente') {
            throw new Error('Leave request is not pending');
        }

        leave.status = 'rejeté';
        await leave.save();

        // Send notification to User
        await NotificationService.sendLeaveApprovalNotification(leave.id, leave.status, leave.User.id);

        return leave;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getLeaves,
    submitLeave,
    approveLeave,
    rejectLeave
};
