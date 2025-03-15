const express = require('express');
const { 
    verifyInvitation, 
    updateInvitationStatus 
} = require('../controllers/invitationController');
const { optionalProtect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes with optional authentication
router.route('/:token').get(verifyInvitation);
router.route('/:token/status').put(optionalProtect, updateInvitationStatus);

module.exports = router;
