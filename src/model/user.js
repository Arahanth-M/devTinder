const mongoose = require("mongoose");

//creating  a schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    }




})

//creating a model
const User = mongoose.model("User", userSchema);
//like using an instacnce of the class / model
module.exports = User