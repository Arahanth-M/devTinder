const express = require("express");
const profileRouter = express.Router();
const {
    userAuth
} = require("../middlewares/auth");
const {
    validateEditProfileData
} = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {

        const user = req.user;
        console.log("the user logged in is: " + user.firstName);
        res.send(user);
    } catch (err) {
        console.log("ERROR: " + err.message);
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid edit request");

        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
        loggedInUser.save();
        res.json({
            message: `${loggedInUser.firstName} , your profile has been updated`,
            data: loggedInUser
        });
        await loggedInUser.save();
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }

})

module.exports = profileRouter;