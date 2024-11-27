const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", //reference is created to the User collection --> it is like building a relation building the schemas
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`,
        },

    },
}, {
    timestamps: true
});

//adding a compound index to the toUserId and fromUserId to make sure tht the query on the DB becomes fast and less expensive
//there are arious ways to assign the indexes in a DB , jsut go through the official documetnation
//Compound indexes are used when we want to search in the DB using multiple parameters such as the below case..

connectionRequestSchema.index({
    toUserId: 1,
    fromUserId: 1
});


//This is an example of Schema validation wherein before (pre) saving the data into the database , the DB checks for the condition , if the condiiton is not satisfied  then the DB will throw th error

connectionRequestSchema.pre("save", function(next) {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself")

    }
    next();

})

//model name should always begin with a capital letter
const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequestModel;