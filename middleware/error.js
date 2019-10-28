const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = {...err}
  error.message = err.message

  //Log into the console
  console.log(err);

  //Mongoose bad ObjectId
  if(err.name === 'CastError'){
    const message = `Bootcamp not found with the id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  //Mongoose duplicate keys
  if(err.code === 11000){
      const message = 'Duplicate field value entered';
      error = new ErrorResponse(message, 400);
  }

  //Mongoose validation errors
  if(err.name === 'ValidationError'){
      const message = Object.values(err.errors).map(val => val.message);
      error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    status: 'failed',
    error: error.message || 'Server Error'
  })
}

module.exports = errorHandler;