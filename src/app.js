const express = require("express");

app = new express();


app.use("/user/data", (req, res, next) => {
    try {
        console.log("user data is there");
        throw new Error("error occured");
        res.send("data of user");
    } catch (err) {
        res.status(500).send("error occured , please contact the dev team");
    }
})

app.use("/", (err, req, res, next) => {
    if (err) {
        console.log("error occured please check");
        res.send("Found error");
    }
})


app.listen(3000, () => {
    console.log("server successfully listening on port 3000");
});