const path = require('path');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc     Get all bootcamps
// @route    GET /api/v1/bootcamps
// @access   PUBLIC
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults)  
})


// @desc     Get single bootcamp
// @route    GET /api/v1/bootcamps/:id
// @access   PUBLIC
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({
        status: 'success',
        data: bootcamp
    })
});


// @desc     Create new bootcamp
// @route    POST /api/v1/bootcamps
// @access   PRIVATE
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
        status: 'success',
        data: bootcamp
    })
})

// @desc     Update bootcamp
// @route    PUT /api/v1/bootcamps/:id
// @access   PRIVATE
exports.updateBootcamp = asyncHandler(async (req, res, next) => {  
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({status: 'success', data: bootcamp});
})


// @desc     Delete bootcamp
// @route    DELETE /api/v1/bootcamps/:id
// @access   PRIVATE
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }

    bootcamp.remove();
    res.status(200).json({status: 'success', data: {}});
})

// @desc     Get bootcamps within a radius
// @route    GET /api/v1/bootcamps/:zipcode/:distance
// @access   PRIVATE
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const {zipcode, distance} = req.params;

    //Get lat/lng from the geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    //calculate the radius using radians
    //Divide distance by radius of the earth i.e 3,963 mi / 6,378 km
    const radius = distance / 3963;
    const bootcamps = await Bootcamp.find({
        location: {$geoWithin: {$centerSphere: [[lng, lat], radius]}}
    });

    res.status(200).json({
        status: 'success',
        count: bootcamps.length,
        data: bootcamps
    })
});

// @desc     Upload photo for bootcamp
// @route    PUT /api/v1/bootcamps/:id/photo
// @access   PRIVATE
exports.bootcampUploadPhoto = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }

    if(!req.files){
        return next(new ErrorResponse(`Please upload a file`, 400))
    }

    const file = req.files.file;

    //Make sure that the image is a photo
    if(!file.mimetype.startsWith('image')){
        return next(new ErrorResponse(`Please upload an image file`, 400))
    }

    //check filesize
    if(file.size > process.env.MAX_FILE_UPLOAD){
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400))
    }

    //create custom file name
    file.name = `photo_${req.params.id}${path.parse(file.name).ext}`
    //console.log(file.name);
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err) {
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload`, 500))
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, {photo: file.name});
        res.status(200).json({
            status: 'success',
            data: file.name
        });
    })
});

