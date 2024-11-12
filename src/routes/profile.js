const express = require("express");
const profileRouter = express.Router();
const {
    userAuth
} = require("../middlewares/auth");

profileRouter.get("/profile", userAuth, async (req, res) => {
    try {

        const user = req.user;
        console.log("the user logged in is: " + user.firstName);
        res.send(user);
    } catch (err) {
        console.log("ERROR: " + err.message);
    }
})

module.exports = profileRouter;