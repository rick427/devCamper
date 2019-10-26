const express = require('express');
require('dotenv').config({path: './config/config.env'});

const app = express();

app.use(express.json());

app.get('/api/v1/bootcamps', (req,res) => {
    res.status(200).json({success: true, msg: 'Show all bootcamps'})
})
app.get('/api/v1/bootcamps/:id', (req,res) => {
    res.status(200).json({success: true, msg: `Get bootcamp ${req.params.id}`})
})
app.post('/api/v1/bootcamps', (req,res) => {
    res.status(200).json({success: true, msg: 'Create new bootcamps'})
})
app.put('/api/v1/bootcamps/:id', (req,res) => {
    res.status(200).json({success: true, msg: `Update bootcamp ${req.params.id}`})
})
app.delete('/api/v1/bootcamps/:id', (req,res) => {
    res.status(200).json({success: true, msg: `Delete bootcamp ${req.params.id}`})
})

const port = process.env.PORT || 5000;
app.listen(port, console.log(`Server is running in ${process.env.NODE_ENV} on port ${port}`))