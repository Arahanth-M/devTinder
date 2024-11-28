const express = require("express");
const userRouter = express.Router();

const {
    userAuth
} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequests");
const User = require("../models/user")

const USER_SAFE_DATA = "firstName lastName photoUrl age skills"

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        //find() will return an array whereas the findOne() function will return the object , very important  
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
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA); //chaining is avaialble in populate function of nodeJS

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


userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        //the req.params default will be string  , os we need to explicitly convert it into integer

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = (limit > 50) ? 50 : limit;
        const skipNo = (page - 1) * limit;

        const connectionRequests = await ConnectionRequest.find({
            $or: [{
                    fromUserId: loggedInUser._id
                },
                {
                    toUserId: loggedInUser._id
                }

            ]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set(); //set ds same like c++  , all the features are same
        connectionRequests.forEach((x) => {
            hideUsersFromFeed.add(x.fromUserId.toString());
            hideUsersFromFeed.add(x.toUserId.toString());

        })
        const users = await User.find({
            $and: [{
                    _id: {
                        $nin: Array.from(hideUsersFromFeed)
                    }
                },
                {
                    _id: {
                        $ne: loggedInUser._id
                    }
                },
            ],
        }).select(USER_SAFE_DATA).skip(skipNo).limit(limit);

        res.send(users);

    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
})

module.exports =
    userRouter