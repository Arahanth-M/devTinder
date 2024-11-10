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
        res.status(404).send(err.message);
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
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            res.send("login successful");
        } else {
            throw new Error("password is not correct");
        }

    } catch (err) {
        res.status(404).send("ERROR : " + err.message);
    }




});


app.get("/user", async (req, res) => {
    const userEmail = req.body.email;
    try {
        const users = await User.find({
            email: userEmail
        }); //this returns an array of all the users
        if (users.length === 0)
            res.status(404).send("User not found");
        else {
            res.send(users);
        }


    } catch (err) {
        res.send("An unknown error occured");
    }



})

app.delete("/delete", async (req, res) => {
    const userEmail = req.body.email;
    try {
        await User.deleteOne({
            email: userEmail
        });
        res.send("user deleted successfully");


    } catch (err) {
        res.status(404).send("some error occured");
    }
})
//using findByIdAnddelete() method
app.delete("/user", async (req, res) => {
    const userid = req.body.userId;
    try {
        await User.findByIdAndDelete({
            userId: userid
        })
        res.send("user successfully deleted using id");
    } catch (err) {
        res.send("some unknown error occured");
    }
})

app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        if (users.length === 0)
            res.status(404).send("no users found");
        else {
            res.send(users);
        }

    } catch (err) {
        res.send("An unknown error occured");
    }




})

//API level validation 
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params.userId
    const data = req.body;

    try {
        const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATES.includes(k)
        );
        if (!isUpdateAllowed) {
            throw new Error("update not allowed");
        }
        //it is always better to add a question mark before the dot oepration , but my VS is not supporting , just check this out when time persists....
        if (data.skills.length > 10) {
            throw new Error("No more than 10 skills can be added");
        }

        const user = await User.findByIdAndUpdate({
                _id: userId
            },
            data, {
                returnDocument: "after",
                runValidators: true,
            }
        );
        console.log(user);
        res.send("User data updated successfully");
    } catch (err) {
        res.status(404).send("some unknown err occured" + err);
    }


})



connectDB().then(() => {
    console.log("connected to the database");
    app.listen(3000, () => {
        console.log("server successfully listening on port 3000");
    });
}).catch((err) => {
    console.log("could not connect with the database");
})