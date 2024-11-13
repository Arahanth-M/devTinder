const express = require("express");
const {
    validateUserData
} = require("../utils/validation");
const User = require("../models/user"); // we have created a schema , then a model of user dataabase , we are trying to import it here
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    //using direct req.body is a bad thing , so first we should validate the user credentials
    //validating the user data
    try {
        //validation of data
        validateUserData(req);

        const {
            firstName,
            lastName,
            email,
            password
        } = req.body; //destructing all the data recieved... good industry practices

        //encrypting the password
        const encryptedPssword = await bcrypt.hash(password, 10); //here 10 represents th number of salt rounds required to encrypt and store the entered password

        const user = new User({
            firstName,
            lastName,
            email,
            password: encryptedPssword,

        });


        await user.save();
        res.send("user data added successfully");
    } catch (err) {
        console.log("error occured");
        res.status(400).send(err.message);
    }


});

authRouter.post("/login", async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;
        const user = await User.findOne({
            email: email
        });




        if (!user) {
            throw new Error("Email Id is not valid in DB");
        }
        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {
            //the first parameter is the data that is needed to be hidded...
            //the second parameter is the secret key that only the server knows...
            //the user id is hidden inside the JWT tokena dn the server gets to know who has logged inside and send the encrypted form of the suer id in the JWT toke..
            //thats why if the cookie gets leaked , the hacker gets access to all API of the user and the private information can be accessed by the hacker...

            const token = await user.getJWT();
            res.cookie("token", token);
            res.send("login successful");
        } else {
            throw new Error("password is not correct");
        }

    } catch (err) {
        res.status(404).send("ERROR : " + err.message);
    }




});

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    })
    res.send("Logged out successfully");

});




module.exports = authRouter;