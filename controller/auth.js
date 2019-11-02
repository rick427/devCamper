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
    sendTokenRes(user, 200, res);
});


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

    //create token
    sendTokenRes(user, 200, res);
});

//@: UTILS
const sendTokenRes = (user, statusCode, res) => {
    //Get token from model, create cookie and send response
    // create token
    const token = user.getSignedJwtToken();

    //create options for cookie
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if(process.env.NODE_ENV === 'production'){
        options.secure = true;
    }

    res.status(statusCode)
       .cookie('token', token, options)
       .json({
            status: 'success',
            token
    })
}


// @desc     Get current logged in user
// @route    POST /api/v1/auth/me
// @access   PRIVATE
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
      status: 'success',
      data: user
  })
});