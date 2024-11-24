const mongoose = require("mongoose");
require("dotenv").config();

const connectwithdb = () => {
    console.log("Database URL:", process.env.DATABASE_URL); 
    mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        console.log("DB connected successfully");
    })
    .catch((error) => {
        console.log("DB facing connection issue");
        console.log(error);
        process.exit(1);
    });
};

module.exports = connectwithdb;