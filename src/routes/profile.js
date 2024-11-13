const express = require("express");
const profileRouter = express.Router();
const {
    userAuth
} = require("../middlewares/auth");
const {
    validateEditProfileData
} = require("../utils/validation");

const bcrypt = require("bcrypt");

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

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        const {

            currentPassword,
            newPassword
        } = req.body;

        // Ensure user exists
        const user = req.user; //passed by the userAuth middleware

        if (!user) {
            return res.status(404).send("User does not exist, please create a new account.");
        }

        // Compare the current password with the one stored in the database
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).send("The current password is incorrect.");
        }

        // Hash the new password and update it
        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        user.password = encryptedPassword;
        await user.save();

        // Respond to the client
        return res.json({
            message: `Password updated successfully.`,
            data: user
        });
    } catch (err) {
        return res.status(500).send("ERROR: " + err.message);
    }
});

module.exports = profileRouter;