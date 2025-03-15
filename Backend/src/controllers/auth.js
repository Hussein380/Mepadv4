const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Register user
exports.register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Create user
    const user = await User.create({
        name,
        email,
        password
    });

    sendTokenResponse(user, 200, res);
});

// @desc    Login user
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            error: 'Please provide an email and password'
        });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return res.status(401).json({
            success: false,
            error: 'Invalid credentials'
        });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return res.status(401).json({
            success: false,
            error: 'Invalid credentials'
        });
    }

    sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
exports.getMe = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        data: req.user
    });
});

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    res.status(statusCode).json({
        success: true,
        token
    });
}; 