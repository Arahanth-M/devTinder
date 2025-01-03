const express = require("express");
const requestRouter = express.Router();
const {
    userAuth
} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequests");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const userExists = await User.findById(toUserId);
        if (!userExists) {
            return res.status(400).json({
                message: "User not found"
            });
        }


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

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });
        const data = await connectionRequest.save();
        res.json({
            message: req.user.firstName + " is " + status + " in " + userExists.firstName,
            data
        });
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }



})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const {
            status,
            requestId
        } = req.params;
        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            throw new Error("Invalid status!!");
        }
        const connectionRequest = await ConnectionRequest.findOne({
            toUserId: loggedInUser._id,
            status: "interested",
            _id: requestId


        });
        if (!connectionRequest) {
            return res.status(400).json({
                message: "Connection request not found"
            });
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({
            message: "The connection was " + status,
            data
        });



    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }

})
module.exports = requestRouter;