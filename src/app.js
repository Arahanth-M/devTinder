const express = require("express");
const {
    adminAuth,
    userAuth
} = require("./middleware");

const app = express(); //new webserver is created

app.use("/admin", adminAuth);

app.use("/user/login", (req, res) => {
    console.log("user login page");
    res.send("login page is open");
})
app.use("/user", userAuth);


app.use("/admin/getAllData", (req, res) => {
    console.log("all the data has been sahred with the admin");
    res.send("The admin is authorized and here is the data");
})

app.use("/admin/check", (req, res) => {
    console.log("the admin can check all the activities now");
    res.send("here is all the activities happening");

})




app.use("/user/profile", (req, res) => {
    console.log("this is the user profile");
    res.send("User login page");
})














app.listen(3000, () => {
    console.log("server successfully listening on port 3000");
});