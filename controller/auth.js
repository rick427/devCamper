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
        token
    })
})

// @desc     Login user
// @route    POST /api/v1/auth/login
// @access   PUBLIC
exports.login = asyncHandler(async (req, res, next) => {
    const {email, password} = req.body;

    //validate email and password
    if(!email || !password){
        return next(new ErrorResponse(`Please proveide an email and password`, 400))
    }

    //check for a user
    const user = await User.findOne({email}).select('+password');

    if(!user) return next(new ErrorResponse(`Invalid Credentials`, 401));

    // Compare passwords
    const isMatch = await user.matchPassword(password);

    if(!isMatch) return next(new ErrorResponse(`Invalid Credentials`, 401))

    //Create token
    const token = user.getSignedJwtToken();

    res.status(200).json({
        status: 'success',
        token
    })
})