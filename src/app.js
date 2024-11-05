const express = require("express");
const {
    connectDB
} = require("./config/database");



const User = require("./models/user");

app = express();

app.use(express.json()); //middle ware used to convert the JSON format to JS object , so that it is in user readable form 

app.post("/signup", async (req, res) => {
    console.log(req.body);
    const user = new User(req.body);
    try {

        await user.save();
        res.send("user data updated successfully");
    } catch (err) {
        console.log("error occured");
        res.status(404).send("could not recieve the data");
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

connectDB().then(() => {
    console.log("connected to the database");
    app.listen(3000, () => {
        console.log("server successfully listening on port 3000");
    });
}).catch((err) => {
    console.log("could not connect with the database");
})