const mongoose = require('mongoose');
const crypto = require('crypto');

const invitationSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
        default: () => crypto.randomBytes(32).toString('hex')
    },
    meetingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meeting',
        required: true
    },
    email: {
        type: String,
        required: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending'
    },
    expiresAt: {
        type: Date,
        default: () => {
            const date = new Date();
            date.setDate(date.getDate() + 30); // 30 days from now
            return date;
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create index for faster queries
invitationSchema.index({ token: 1 });
invitationSchema.index({ email: 1, meetingId: 1 }, { unique: true });

// Method to check if invitation is expired
invitationSchema.methods.isExpired = function() {
    return Date.now() > this.expiresAt;
};

module.exports = mongoose.model('Invitation', invitationSchema);
