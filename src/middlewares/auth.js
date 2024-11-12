const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    //Read the token from the req cookies
    try {
        const {
            token
        } = req.cookies;
        if (!token) {
            throw new Error("token not valid");
        }
        const decodeObj = await jwt.verify(token, "dev@Tinder70");

        const {
            _id
        } = decodeObj;
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("user not found");

        }
        req.user = user;
        next(); //it goes to the next request handler
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
};

module.exports = {
    userAuth
};