const Task = require('../models/Task');
const Meeting = require('../models/Meeting');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const debug = require('debug')('app:taskController');

// @desc    Create new task
// @route   POST /api/meetings/:meetingId/tasks
// @access  Private (Admin only)
exports.createTask = asyncHandler(async (req, res) => {
    const { meetingId } = req.params;
    const { title, description, deadline, assignedToEmail, priority } = req.body;

    // Check if user is admin
    if (req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Only admins can create tasks');
    }

    // Verify meeting exists
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
        res.status(404);
        throw new Error('Meeting not found');
    }

    // Find user by email
    const assignedUser = await User.findOne({ email: assignedToEmail });
    if (!assignedUser) {
        res.status(404);
        throw new Error('User not found with provided email');
    }

    // Verify user is a participant in the meeting
    if (!meeting.participants.includes(assignedUser._id)) {
        res.status(400);
        throw new Error('User is not a participant in this meeting');
    }

    const task = await Task.create({
        title,
        description,
        deadline,
        assignedTo: assignedUser._id,
        meetingId,
        priority,
        status: 'pending',
        createdBy: req.user.id
    });

    const populatedTask = await Task.findById(task._id)
        .populate('assignedTo', 'email')
        .populate('createdBy', 'email');

    res.status(201).json({
        success: true,
        data: populatedTask
    });
});

// @desc    Get all tasks for a meeting
// @route   GET /api/meetings/:meetingId/tasks
// @access  Private
exports.getTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find({ meetingId: req.params.meetingId })
        .populate('assignedTo', 'email')
        .populate('createdBy', 'email');

    res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks
    });
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = asyncHandler(async (req, res) => {
    let task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    // Make sure user is task creator or task is assigned to user
    if (task.createdBy.toString() !== req.user.id && 
        task.assignedTo.toString() !== req.user.id && 
        req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to update this task');
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: task
    });
});

// @desc    Delete task
// @route   DELETE /tasks/:id
// @access  Private (Admin only)
exports.deleteTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    // Check if user is admin
    if (req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Only admins can delete tasks');
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        data: {}
    });
}); 