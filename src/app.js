const express = require("express"); //including the core node module onto our app.js code
const {
    connectDB
} = require("./config/database"); //including our database module... from the config folder



const User = require("./models/user"); // we have created a schema , then a model of user dataabase , we are trying to import it here


app = express();

app.use(express.json()); //middle ware used to convert the JSON format to JS object , so that it is in user readable form and fetch only the required data to the server


app.post("/signup", async (req, res) => {
    console.log(req.body);
    const user = new User(req.body);
    try {

        await user.save();
        res.send("user data updated successfully");
    } catch (err) {
        console.log("error occured");
        res.status(404).send(err.message);
    }


});

// app.post("/user", async (req, res) => {
//     const user = new User(req.body);
//     try {
//         await user.save();
//         res.send("user data updated successfully");
//     } catch (err) {
//         req.status(404).send("some unknown error occured");
//     }
// })

app.get("/user", async (req, res) => {
    const userEmail = req.body.email;
    try {
        const users = await User.find({
            email: userEmail
        }); //this returns an array of all the users
        if (users.length === 0)
            res.status(404).send("User not found");
        else {
            res.send(users);
        }


    } catch (err) {
        res.send("An unknown error occured");
    }



})

app.delete("/delete", async (req, res) => {
    const userEmail = req.body.email;
    try {
        await User.deleteOne({
            email: userEmail
        });
        res.send("user deleted successfully");


    } catch (err) {
        res.status(404).send("some error occured");
    }
})
//using findByIdAnddelete() method
app.delete("/user", async (req, res) => {
    const userid = req.body.userId;
    try {
        await User.findByIdAndDelete({
            userId: userid
        })
        res.send("user successfully deleted using id");
    } catch (err) {
        res.send("some unknown error occured");
    }
})

app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        if (users.length === 0)
            res.status(404).send("no users found");
        else {
            res.send(users);
        }

    } catch (err) {
        res.send("An unknown error occured");
    }




})

app.patch("/user", async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;
    try {
        const user = await User.findByIdAndUpdate({
                _id: userId
            },
            data, {
                returnDocument: "after",
                runValidators: true,
            }
        );
        console.log(user);
        res.send("User data updated successfully");
    } catch (err) {
        res.status(404).send("some unknown err occured" + err);
    }


})



connectDB().then(() => {
    console.log("connected to the database");
    app.listen(3000, () => {
        console.log("server successfully listening on port 3000");
    });
}).catch((err) => {
    console.log("could not connect with the database");
})