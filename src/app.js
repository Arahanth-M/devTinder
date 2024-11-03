const express = require("express");

const app = express(); //new webserver is created

// app.use((req, res) => {
//     res.send("hello from the server");
// }) // the function we have passed insdie is called as arequest handler

app.use("/hello", (req, res) => {
    res.send("hello from the server usinf dev - home page");
})

app.use("/test", (req, res) => {
    res.send("hello from the server using nodemon npx - test page");
})


app.listen(3000, () => {
    console.log("server successfully listening on port 3000");
});