const Bootcamp = require('../models/Bootcamp');

// @desc     Get all bootcamps
// @route    GET /api/v1/bootcamps
// @access   PUBLIC
exports.getBootcamps = (req, res, next) => {
    res.status(200).json({success: true, msg: 'Show all bootcamps'});
}

// @desc     Get single bootcamp
// @route    GET /api/v1/bootcamps/:id
// @access   PUBLIC
exports.getBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: `Get bootcamp ${req.params.id}`})
}

// @desc     Create new bootcamp
// @route    POST /api/v1/bootcamps
// @access   PRIVATE
exports.createBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({
            status: 'success',
            data: bootcamp
        })
    } catch (error) {
        res.status(400).json({
            status: failed
        })
    }
}

// @desc     Update bootcamp
// @route    PUT /api/v1/bootcamps/:id
// @access   PRIVATE
exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: `Update bootcamp ${req.params.id}`})
}

// @desc     Delete bootcamp
// @route    DELETE /api/v1/bootcamps/:id
// @access   PRIVATE
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: `Delete bootcamp ${req.params.id}`})
}

