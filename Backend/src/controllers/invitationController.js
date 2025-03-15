const Invitation = require('../models/Invitation');
const Meeting = require('../models/Meeting');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
// Enable email sending
const sendEmail = require('../utils/sendEmail');

// @desc    Send invitations to meeting participants
// @route   POST /api/meetings/:id/invitations
// @access  Private
exports.sendInvitations = asyncHandler(async (req, res) => {
    const meeting = await Meeting.findById(req.params.id);
    
    if (!meeting) {
        res.status(404);
        throw new Error('Meeting not found');
    }
    
    // Check if user is the creator of the meeting
    if (meeting.createdBy && meeting.createdBy.toString() !== req.user.id) {
        res.status(403);
        throw new Error('Not authorized to send invitations for this meeting');
    }
    
    const { participants } = req.body;
    const addedParticipants = [];
    
    // Process each participant
    for (const participant of participants) {
        // Check if participant already exists in the meeting
        const existingParticipant = meeting.participants.find(
            p => p.email === participant.email
        );
        
        if (!existingParticipant) {
            // Add participant to meeting
            meeting.participants.push({
                name: participant.name,
                email: participant.email,
                role: participant.role || 'viewer',
                status: 'invited'
            });
            
            addedParticipants.push({
                name: participant.name,
                email: participant.email
            });
        }
    }
    
    // Save meeting with updated participants
    await meeting.save();
    
    res.status(200).json({
        success: true,
        data: {
            addedParticipants
        }
    });
});

// @desc    Verify invitation token and get meeting data
// @route   GET /api/invitations/:token
// @access  Public
exports.verifyInvitation = asyncHandler(async (req, res) => {
    const invitation = await Invitation.findOne({ token: req.params.token });
    
    if (!invitation) {
        res.status(404);
        throw new Error('Invalid invitation link');
    }
    
    if (invitation.isExpired()) {
        res.status(400);
        throw new Error('Invitation has expired');
    }
    
    const meeting = await Meeting.findById(invitation.meetingId)
        .select('-actionPoints.assignedTo -participants.email')
        .populate('createdBy', 'email');
    
    if (!meeting) {
        res.status(404);
        throw new Error('Meeting not found');
    }
    
    res.status(200).json({
        success: true,
        data: {
            meeting,
            invitation: {
                email: invitation.email,
                status: invitation.status,
                expiresAt: invitation.expiresAt
            }
        }
    });
});

// @desc    Update invitation status (accept/decline)
// @route   PUT /api/invitations/:token/status
// @access  Public
exports.updateInvitationStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    
    if (!status || !['accepted', 'declined'].includes(status)) {
        res.status(400);
        throw new Error('Please provide a valid status (accepted or declined)');
    }
    
    const invitation = await Invitation.findOne({ token: req.params.token });
    
    if (!invitation) {
        res.status(404);
        throw new Error('Invalid invitation link');
    }
    
    if (invitation.isExpired()) {
        res.status(400);
        throw new Error('Invitation has expired');
    }
    
    // Update invitation status
    invitation.status = status;
    await invitation.save();
    
    // Update participant status in the meeting
    const meeting = await Meeting.findById(invitation.meetingId);
    if (meeting) {
        const participant = meeting.participants.find(
            p => p.email === invitation.email
        );
        
        if (participant) {
            participant.status = status;
            await meeting.save();
        }
    }
    
    // If user is logged in, associate this meeting with their account
    if (req.user) {
        // Check if the invitation email matches the logged-in user's email
        const user = await User.findById(req.user.id);
        if (user && user.email === invitation.email) {
            // The meeting is already associated with the user via participants
            // No additional action needed here
        }
    }
    
    res.status(200).json({
        success: true,
        data: {
            status: invitation.status,
            email: invitation.email,
            meetingId: invitation.meetingId
        }
    });
});

// @desc    Get all invitations for a meeting
// @route   GET /api/meetings/:id/invitations
// @access  Private
exports.getMeetingInvitations = asyncHandler(async (req, res) => {
    const meeting = await Meeting.findById(req.params.id);
    
    if (!meeting) {
        res.status(404);
        throw new Error('Meeting not found');
    }
    
    // Check if user is the creator of the meeting
    if (meeting.createdBy && meeting.createdBy.toString() !== req.user.id) {
        res.status(403);
        throw new Error('Not authorized to view invitations for this meeting');
    }
    
    const invitations = await Invitation.find({ meetingId: meeting._id });
    
    res.status(200).json({
        success: true,
        count: invitations.length,
        data: invitations
    });
});
