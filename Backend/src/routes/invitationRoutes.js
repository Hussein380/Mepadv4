const express = require('express');
const { 
    sendInvitations, 
    verifyInvitation, 
    updateInvitationStatus,
    getMeetingInvitations
} = require('../controllers/invitationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

// Public routes (no authentication required)
router.route('/:token').get(verifyInvitation);
router.route('/:token/status').put(updateInvitationStatus);

// Protected routes (authentication required)
router.route('/').post(protect, sendInvitations);
router.route('/').get(protect, getMeetingInvitations);

module.exports = router;
