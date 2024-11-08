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

module.exports = {
    validateUserData
};