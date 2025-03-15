const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add participant name']
    },
    email: {
        type: String,
        required: [true, 'Please add participant email']
    },
    status: {
        type: String,
        enum: ['invited', 'accepted', 'declined'],
        default: 'invited'
    },
    role: {
        type: String,
        enum: ['viewer', 'contributor', 'organizer'],
        default: 'viewer'
    }
});

const actionPointSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    assignedTo: {
        type: String,
        required: [true, 'Please specify who this is assigned to']
    },
    dueDate: {
        type: Date,
        required: [true, 'Please add a due date']
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
    }
}, { timestamps: true });

const meetingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [50, 'Title cannot be more than 50 characters']
    },
    date: {
        type: Date,
        required: [true, 'Please add a date']
    },
    venue: {
        type: String,
        required: [true, 'Please add a venue']
    },
    summary: {
        type: String,
        required: [true, 'Please add a summary']
    },
    participants: [participantSchema],
    actionPoints: [actionPointSchema],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Meeting', meetingSchema); 