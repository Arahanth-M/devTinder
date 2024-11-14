const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//creating  a schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,

    },
    lastName: {
        type: String,
        maxLength: 30,


    },
    /*
    firstName: {
     type: String
    }
    */

    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true, //if a parameter is made unique , then automatically index is added on that parameter
        index: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("invalid email id" + value)
            }
        },
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Please enter a strong password ", value);
            }
        },
    },
    age: {
        type: Number,
        min: 18,
        max: 100
    },
    gender: {
        type: String,
        //validate functions by defalut works only when a new document was created , will not work whenever a document is getting updated
        //inorder to run the validators , u should pass runValidators along with the options in the  patch API of the users
        //very important concept and very few developers will be knowing about this...
        //you can check the patch API for updating the user value in the app.js code for better clarity 
        validate(value) {
            if (!["male", "female", "others"].includes(value))
                throw new Error("Please enter a valid gender!!!");
        }
    },
    photoUrl: {
        type: String,
        default: "https://i.pinimg.com/564x/8a/01/cc/8a01cc0579be056ecc8dfa2f07bd42aa.jpg",
        //additional validation function added by me to check whether the entered URL is valid or not ... 
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("please enter valid URL ", value);
            }
        }


    },


    about: {
        type: String,
        default: "add description about yourself",
        maxLength: 1000,
    },
    skills: {
        type: [String],
    }





}, {
    timestamps: true,
})

userSchema.methods.getJWT = async function() {
    const user = this;
    const token = await jwt.sign({
        _id: user._id
    }, "dev@Tinder70", {
        expiresIn: "7d"
    });
    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;
}

//creating a model
const User = mongoose.model("User", userSchema);
//like using an instacnce of the class / model
module.exports = User