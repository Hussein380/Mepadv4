const express = require('express');
const router = express.Router();
const {
    createMeeting,
    getMeetings,
    getMeeting,
    updateMeeting,
    deleteMeeting,
    updateActionPoint
} = require('../controllers/meetingController');

const { protect } = require('../middleware/authMiddleware');

// Include invitation routes
const invitationRouter = require('./invitationRoutes');
router.use('/:id/invitations', invitationRouter);

router.route('/')
    .get(protect, getMeetings)
    .post(protect, createMeeting);

router.route('/:id')
    .get(protect, getMeeting)
    .put(protect, updateMeeting)
    .delete(protect, deleteMeeting);

router.route('/:id/action-points/:actionId')
    .put(protect, updateActionPoint);

module.exports = router;