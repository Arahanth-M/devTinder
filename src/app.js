const express = require("express");
const {
    connectDB
} = require("./config/database");



const User = require("./model/user");

app = express();

app.post("/signup", async (req, res) => {
    try {
        const user = new User({
            firstName: "Arahanth",
            lastName: "M",
            email: "ari@gmail.com",
            password: "1234",
        });
        await user.save();
        res.status(201).send("User signed up successfully");
    } catch (err) {
        res.status(500).send("An error occurred while signing up");
    }
});

connectDB().then(() => {
    console.log("connected to the database");
    app.listen(3000, () => {
        console.log("server successfully listening on port 3000");
    });
}).catch((err) => {
    console.log("could not connect with the database");
})