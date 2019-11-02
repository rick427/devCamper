const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc     Register user
// @route    POST /api/v1/auth/register
// @access   PUBLIC
exports.register = asyncHandler(async (req, res, next) => {
    res.status(200).json({status: 'success'})
})