const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');
const {
    createTask,
    getTasks,
    updateTask,
    deleteTask
} = require('../controllers/taskController');

// Tasks routes
router.route('/:meetingId/tasks')
    .post(protect, isAdmin, createTask)
    .get(protect, getTasks);

router.route('/:id')
    .put(protect, updateTask)
    .delete(protect, isAdmin, deleteTask);

module.exports = router; 