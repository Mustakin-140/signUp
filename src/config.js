const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/login");


//checking connection

connect.then(() => {
    console.log("Database Connected Successfully");
})
    .catch(() => {
        console.log("Database connection failed");
    });

//create schema
    
const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true


    }
})

//collection part

const collection = new mongoose.model("users", LoginSchema);

module.exports = collection;