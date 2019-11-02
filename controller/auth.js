const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc     Register user
// @route    POST /api/v1/auth/register
// @access   PUBLIC
exports.register = asyncHandler(async (req, res, next) => {
    const {name, email, password, role} = req.body;
    //create user
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    //Create token
    const token = user.getSignedJwtToken();

    res.status(200).json({
        status: 'success',
        token,
        data: user
    })
})