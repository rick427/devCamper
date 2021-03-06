const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
require('dotenv').config({path: './config/config.env'});
require('colors');

const connectDb = require('./config/database');
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const errorHandler = require('./middleware/error');

// connect to database
connectDb();

//Initialize express into app
const app = express();

//@: MIDDLEWARES

// body-parser
app.use(express.json());

// cookie-parser
app.use(cookieParser());

// logger
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}
// file-uploads
app.use(fileUpload());

// set static folder
app.use(express.static(path.join(__dirname, 'public')))

//Mount Routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use(errorHandler);

const port = process.env.PORT || 5000;
const server = app.listen(port, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${port}`.yellow.bold))

//UNHANDLED PROMISE REJECTION Handler
process.on('unhandledRejection', (err, promise) => {
    console.log(`ERROR: ${err.message}`.red);
    server.close(() => process.exit(1));
});