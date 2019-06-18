const mongoose = require('mongoose');
const config = require('config');
const db =  process.env.mongoURI || config.get('mongoURI');
const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true,
            'useFindAndModify': false
        });//#find why this obj
        console.log("Connected to database");
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

module.exports = connectDB;