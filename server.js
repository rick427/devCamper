const express = require('express');
const morgan = require('morgan');
require('dotenv').config({path: './config/config.env'});
const colors = require('colors');

const connectDb = require('./config/database');
const bootcamps = require('./routes/bootcamps');

connectDb();

const app = express();

app.use(express.json());
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//Mount Routers
app.use('/api/v1/bootcamps', bootcamps);

const port = process.env.PORT || 5000;
const server = app.listen(port, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${port}`.yellow.bold))

//UNHANDLED PROMISE REJECTION Handler
process.on('unhandledRejection', (err, promise) => {
    console.log(`ERROR: ${err.message}`.red);
    server.close(() => process.exit(1));
});