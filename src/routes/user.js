const express = require("express");
const userRouter = express.Router();

const {
    userAuth
} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequests");

const USER_SAFE_DATA = "firstName lastName photoUrl age skills"

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        //find() will returnan array whereas the findOne() function will return the object , very important differnece 
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "age", "skills"]);
        // if (connectionRequests.length === 0) {
        //     res.send("NO connection requests")
        // }
        res.json({
            message: "Here is the list of pending connection requests",
            connectionRequests
        });


    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
})

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            $or: [{
                    fromUserId: loggedInUser._id,
                    status: "accepted"
                },
                {
                    toUserId: loggedInUser._id,
                    status: "accepted"
                },
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);

        const data = connections.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({
            data

        });

    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
})

module.exports =
    userRouter