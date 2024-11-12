const express = require("express"); //including the core node module onto our app.js code
const {
    connectDB
} = require("./config/database"); //including our database module... from the config folder

const {
    validateUserData
} = require("./utils/validation");
const validator = require("validator");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {
    userAuth
} = require("./middlewares/auth");


const User = require("./models/user"); // we have created a schema , then a model of user dataabase , we are trying to import it here


app = express();

app.use(express.json()); //middle ware used to convert the JSON format to JS object , so that it is in user readable form and fetch only the required data to the server
app.use(cookieParser());

app.post("/signup", async (req, res) => {
    //using direct req.body is a bad thing , so first we should validate the user credentials
    //validating the user data
    try {

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

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
    try {

        const user = req.user;
        console.log("the user logged in is: " + user.firstName);
        res.send(user);
    } catch (err) {
        console.log("ERROR: " + err.message);
    }
})

app.post("/connectionRequest", userAuth, async (req, res) => {
    console.log("sending connection request");

    res.send("the connection request is sent by : " + req.user.firstName);
})




connectDB().then(() => {
    console.log("connected to the database");
    app.listen(3000, () => {
        console.log("server successfully listening on port 3000");
    });
}).catch((err) => {
    console.log("could not connect with the database");
})