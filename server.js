const express = require('express');
require('dotenv').config({path: './config/config.env'});

//Route files
const bootcamps = require('./routes/bootcamps');

const app = express();

app.use(express.json());

//Mount Routers
app.use('/api/v1/bootcamps', bootcamps);

const port = process.env.PORT || 5000;
app.listen(port, console.log(`Server is running in ${process.env.NODE_ENV} on port ${port}`))