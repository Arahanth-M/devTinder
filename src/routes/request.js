const express = require("express");
const requestRouter = express.Router();
const {
    userAuth
} = require("../middlewares/auth");

requestRouter.post("/connectionRequest", userAuth, async (req, res) => {
    console.log("sending connection request");

    res.send("the connection request is sent by : " + req.user.firstName);
})
module.exports = requestRouter;