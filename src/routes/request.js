const express = require("express");
const mongoose = require("mongoose");
const requestRouter = express.Router();
const {
    userAuth
} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequests");


requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
        return res.status(400).json({
            message: "invalid status type " + status
        });
    }
    const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [{
                fromUserId,
                toUserId
            },
            {
                fromUserId: toUserId,
                toUserId: fromUserId
            },
        ],

    });

    if (existingConnectionRequest) {
        return res.status(400).json({
            message: "Connection request already exists!!"
        });
    }

    const connectionRequest = new connectionRequest({
        fromUserId,
        toUserId,
        status
    });
    const data = await ConnectionRequest.save();
    res.json({
        message: "Connection sent successfully",
        data
    });



})
module.exports = requestRouter;