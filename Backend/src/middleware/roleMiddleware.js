const asyncHandler = require('../utils/asyncHandler');

exports.restrictTo = (...roles) => {
    return asyncHandler(async (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            res.status(403);
            throw new Error(`Role ${req.user.role} is not authorized to access this route`);
        }
        next();
    });
};

// Admin only middleware
exports.adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403);
        throw new Error('Not authorized to access this route');
    }
}; 