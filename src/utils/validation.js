const validator = require("validator");

function validateUserData(req) {
    const {
        firstName,
        lastName,
        email,
        password
    } = req.body;
    if (!firstName || !lastName) {
        throw new Error("Please enter the first name and the last name");
    } else if (!validator.isEmail(email)) {
        throw new Error("enter valid email ID");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("please enter a strong password");
    }


}

function validateEditProfileData(req) {
    const allowedEditFields = ["firstName", "lastName", "age", "photoUrl", "gender", "about", "skills"];
    //what this line of code is doing here is that it is checking each key value which is present in the req.body
    //.every(field...)here field will contain all the key value sin the req.body nad chcks whether the filed value are part of the allowedEditFields
    //Object.keys(req.body) will return an array of key values in th req.body
    const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));
    return isEditAllowed;
}

module.exports = {
    validateUserData,
    validateEditProfileData
};