// src/controllers/leaveController.js

const { Leave, User, Project } = require('../models');
const NotificationService = require('../services/notificationService');

/**
 * Get all leave requests for the authenticated user or based on role.
 */
const getLeaves = async (req, res, next) => {
    try {
        const { status } = req.query;
        const user = req.user;

        let whereClause = {};
        if (status) {
            whereClause.status = status;
        }

        if (user.role === 'Admin' || user.role === 'Manager') {
            // Admins and Managers can see all leave requests or filter by status
            const leaves = await Leave.findAll({
                where: whereClause,
                include: [{ model: User, as: 'user' }]
            });
            return res.json(leaves);
        } else {
            // Regular users can only see their own leave requests
            whereClause.userId = user.id;
            const leaves = await Leave.findAll({
                where: whereClause,
                include: [{ model: User, as: 'user' }]
            });
            return res.json(leaves);
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Submit a new leave request.
 */
const createLeave = async (req, res, next) => {
    try {
        const { type, startDate, endDate, description } = req.body;
        const user = req.user;

        // Validate dates
        if (new Date(endDate) < new Date(startDate)) {
            return res.status(400).json({ message: 'End date cannot be before start date.' });
        }

        const leaveRequest = await Leave.create({
            userId: user.id,
            type,
            startDate,
            endDate,
            description,
            status: 'en attente',
            submittedAt: new Date()
        });

        // Send notification to Manager/Admin
        await NotificationService.sendLeaveRequestNotification(leaveRequest.id);

        return res.status(201).json({
            message: 'Leave request submitted successfully.',
            leaveRequestId: leaveRequest.id
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Approve a leave request.
 */
const approveLeave = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = req.user;

        const leaveRequest = await Leave.findByPk(id, {
            include: [{ model: User, as: 'user' }]
        });

        if (!leaveRequest) {
            return res.status(404).json({ message: 'Leave request not found.' });
        }

        if (leaveRequest.status !== 'en attente') {
            return res.status(400).json({ message: 'Leave request is not pending.' });
        }

        leaveRequest.status = 'approuvé';
        await leaveRequest.save();

        // Send notification to the user
        await NotificationService.sendLeaveApprovalNotification(leaveRequest.id, 'approuvé');

        return res.json({ message: 'Leave request approved.' });
    } catch (error) {
        next(error);
    }
};

/**
 * Reject a leave request.
 */
const rejectLeave = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = req.user;

        const leaveRequest = await Leave.findByPk(id, {
            include: [{ model: User, as: 'user' }]
        });

        if (!leaveRequest) {
            return res.status(404).json({ message: 'Leave request not found.' });
        }

        if (leaveRequest.status !== 'en attente') {
            return res.status(400).json({ message: 'Leave request is not pending.' });
        }

        leaveRequest.status = 'rejeté';
        await leaveRequest.save();

        // Send notification to the user
        await NotificationService.sendLeaveApprovalNotification(leaveRequest.id, 'rejeté');

        return res.json({ message: 'Leave request rejected.' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getLeaves,
    createLeave,
    approveLeave,
    rejectLeave
};
