const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config({path: './config/config.env'});
require('colors');

// Load models
const Bootcamp = require('./models/Bootcamp');

//Connect to the database
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(console.log(`Database connected on port ${process.env.PORT}. Seeding Initiated...`.blue));

//Read JSON files
const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
)

//Import files into db
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);
        console.log('Data successfully imported to the database...'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(error);
    }
}

// Delete Data
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        console.log('Data successfully destroyed from the database...'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(error);
    }
}

if(process.argv[2] === '-i'){
    importData();
}
else if(process.argv[2] === '-d'){
    deleteData();
}
else{
    console.log('Please add valid options for the seeder -i or -d'.yellow);
    process.exit();
}