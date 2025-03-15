const express = require('express');
const meetingController = require('../controllers/meetingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:id/action-points', protect, meetingController.addActionPoint);
router.put('/:id/action-points/:actionId', protect, meetingController.updateActionPoint);
router.delete('/:id/action-points/:actionId', protect, meetingController.deleteActionPoint);

module.exports = router; 