const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = {...err}
  error.message = err.message

  //Log into the console
  console.log(err.stack.red);

  //Mongoose bad ObjectId
  console.log(err.name);

  if(err.name === 'CastError'){
    const message = `Bootcamp not found with the id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  res.status(error.statusCode || 500).json({
    status: 'failed',
    error: error.message || 'Server Error'
  })
}

module.exports = errorHandler;