const Meeting = require('../models/Meeting');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const Task = require('../models/Task');

// @desc    Create new meeting
// @route   POST /api/meetings
// @access  Private
exports.createMeeting = async (req, res) => {
    try {
        // Add the current user as the creator
        const meetingData = {
            ...req.body,
            createdBy: req.user._id
        };

        console.log('Creating meeting with data:', meetingData); // Debug log

        const meeting = await Meeting.create(meetingData);

        res.status(201).json({
            success: true,
            data: meeting
        });
    } catch (error) {
        console.error('Meeting creation error:', error);
        res.status(400).json({
            success: false,
            error: error.message || 'Invalid meeting data'
        });
    }
};

// @desc    Add pain point to meeting
// @route   POST /api/meetings/:id/painpoints
// @access  Private (Admin only)
exports.addPainPoint = asyncHandler(async (req, res) => {
    const { description } = req.body;
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
        res.status(404);
        throw new Error('Meeting not found');
    }

    meeting.painPoints.push({
        description,
        addedBy: req.user.id,
        addedAt: Date.now(),
        status: 'open'
    });

    await meeting.save();

    res.status(200).json({
        success: true,
        data: meeting
    });
});

// @desc    Update pain point status
// @route   PUT /api/meetings/:id/painpoints/:pointId
// @access  Private (Admin only)
exports.updatePainPoint = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
        res.status(404);
        throw new Error('Meeting not found');
    }

    const painPoint = meeting.painPoints.id(req.params.pointId);
    if (!painPoint) {
        res.status(404);
        throw new Error('Pain point not found');
    }

    painPoint.status = status;
    await meeting.save();

    res.status(200).json({
        success: true,
        data: meeting
    });
});

// @desc    Add participant to meeting
// @route   POST /api/meetings/:id/participants
// @access  Private (Admin only)
exports.addParticipant = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
        res.status(404);
        throw new Error('Meeting not found');
    }

    const user = await User.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (meeting.participants.includes(user._id)) {
        res.status(400);
        throw new Error('User already added to meeting');
    }

    meeting.participants.push(user._id);
    await meeting.save();

    res.status(200).json({
        success: true,
        data: meeting
    });
});

// @desc    Remove participant from meeting
// @route   DELETE /api/meetings/:id/participants/:userId
// @access  Private (Admin only)
exports.removeParticipant = asyncHandler(async (req, res) => {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
        res.status(404);
        throw new Error('Meeting not found');
    }

    meeting.participants = meeting.participants.filter(
        p => p.toString() !== req.params.userId
    );

    await meeting.save();

    res.status(200).json({
        success: true,
        data: meeting
    });
});

// @desc    Get all meetings
// @route   GET /api/meetings
// @access  Private
exports.getMeetings = async (req, res) => {
    try {
        // Get user info
        const user = await User.findById(req.user._id);
        
        // Find meetings created by the user
        const createdMeetings = await Meeting.find({ createdBy: req.user._id })
            .sort('-date')
            .populate('participants', 'name email');
            
        // Find meetings where the user is a participant
        const participatingMeetings = await Meeting.find({
            'participants.email': user.email,
            createdBy: { $ne: req.user._id } // Exclude meetings created by the user to avoid duplicates
        })
        .sort('-date')
        .populate('participants', 'name email');
        
        // Combine the results
        const meetings = [...createdMeetings, ...participatingMeetings];

        res.status(200).json({
            success: true,
            count: meetings.length,
            data: meetings
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get single meeting
// @route   GET /api/meetings/:id
// @access  Private
exports.getMeeting = async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.params.id);

        if (!meeting) {
            return res.status(404).json({
                success: false,
                error: 'Meeting not found'
            });
        }

        // Check if user is the creator or a participant
        const isCreator = meeting.createdBy.toString() === req.user._id.toString();
        const user = await User.findById(req.user._id);
        const isParticipant = meeting.participants.some(p => p.email === user.email);

        if (!isCreator && !isParticipant) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to view this meeting'
            });
        }

        res.status(200).json({
            success: true,
            data: meeting
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Update meeting
// @route   PUT /api/meetings/:id
// @access  Private
exports.updateMeeting = asyncHandler(async (req, res) => {
    let meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
        res.status(404);
        throw new Error('Meeting not found');
    }

    // Check if user is the creator or a participant
    const isCreator = meeting.createdBy.toString() === req.user.id;
    const user = await User.findById(req.user.id);
    const isParticipant = meeting.participants.some(p => p.email === user.email);

    if (!isCreator && !isParticipant) {
        res.status(401);
        throw new Error('Not authorized to update this meeting');
    }

    // If user is a participant but not the creator, they can only update certain fields
    if (isParticipant && !isCreator) {
        // Create a filtered body with only the fields participants can update
        const allowedFields = ['actionPoints'];
        const filteredBody = {};
        
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                filteredBody[field] = req.body[field];
            }
        }
        
        meeting = await Meeting.findByIdAndUpdate(req.params.id, filteredBody, {
            new: true,
            runValidators: true
        });
    } else {
        // Creator can update all fields
        meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
    }

    res.status(200).json({
        success: true,
        data: meeting
    });
});

// @desc    Delete meeting
// @route   DELETE /api/meetings/:id
// @access  Private
exports.deleteMeeting = asyncHandler(async (req, res) => {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
        res.status(404);
        throw new Error('Meeting not found');
    }

    // Check if user owns the meeting
    if (meeting.createdBy.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized to delete this meeting');
    }

    await meeting.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Get all pain points for a meeting
// @route   GET /api/meetings/:id/painpoints
// @access  Private
exports.getPainPoints = asyncHandler(async (req, res) => {
    const meeting = await Meeting.findById(req.params.id)
        .populate('painPoints.addedBy', 'email');

    if (!meeting) {
        res.status(404);
        throw new Error('Meeting not found');
    }

    res.status(200).json({
        success: true,
        count: meeting.painPoints.length,
        data: meeting.painPoints
    });
});

// @desc    Update action point status
// @route   PUT /api/meetings/:id/action-points/:actionId
// @access  Private
exports.updateActionPoint = asyncHandler(async (req, res) => {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
        res.status(404);
        throw new Error('Meeting not found');
    }

    const actionPoint = meeting.actionPoints.id(req.params.actionId);
    if (!actionPoint) {
        res.status(404);
        throw new Error('Action point not found');
    }

    // Check if user is the creator or a participant
    const isCreator = meeting.createdBy.toString() === req.user.id;
    const user = await User.findById(req.user.id);
    const isParticipant = meeting.participants.some(p => p.email === user.email);

    if (!isCreator && !isParticipant) {
        res.status(401);
        throw new Error('Not authorized to update this action point');
    }

    // Update the action point
    actionPoint.status = req.body.status;
    await meeting.save();

    res.status(200).json({
        success: true,
        data: actionPoint
    });
});

// Add action point to meeting
exports.addActionPoint = async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.params.id);
        
        if (!meeting) {
            return res.status(404).json({
                success: false,
                error: 'Meeting not found'
            });
        }

        // Check if user is the creator or a participant
        const isCreator = meeting.createdBy.toString() === req.user._id.toString();
        const user = await User.findById(req.user._id);
        const isParticipant = meeting.participants.some(p => p.email === user.email);

        if (!isCreator && !isParticipant) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to add action points to this meeting'
            });
        }

        // If participant is adding an action point, mark it as assigned to them by default
        if (isParticipant && !isCreator) {
            if (!req.body.assignedTo) {
                req.body.assignedTo = user.email;
            }
        }

        meeting.actionPoints.push(req.body);
        await meeting.save();

        res.status(201).json({
            success: true,
            data: meeting
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Update action point
exports.updateActionPoint = async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.params.id);
        
        if (!meeting) {
            return res.status(404).json({
                success: false,
                error: 'Meeting not found'
            });
        }

        // Check if user owns the meeting
        if (meeting.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized'
            });
        }

        const actionPoint = meeting.actionPoints.id(req.params.actionId);
        if (!actionPoint) {
            return res.status(404).json({
                success: false,
                error: 'Action point not found'
            });
        }

        Object.assign(actionPoint, req.body);
        await meeting.save();

        res.json({
            success: true,
            data: meeting
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
}; 