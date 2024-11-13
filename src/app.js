const express = require("express"); //including the core node module onto our app.js code
const {
    connectDB
} = require("./config/database"); //including our database module... from the config folder

app = express();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json()); //middle ware used to convert the JSON format to JS object , so that it is in user readable form and fetch only the required data to the server
app.use(cookieParser());


const authRouter = require("./routes/auth");
const requestRouter = require("./routes/profile");
const profileRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/", requestRouter);
app.use("/", profileRouter);




connectDB().then(() => {
    console.log("connected to the database");
    app.listen(3000, () => {
        console.log("server successfully listening on port 3000");
    });
}).catch((err) => {
    console.log("could not connect with the database");
})