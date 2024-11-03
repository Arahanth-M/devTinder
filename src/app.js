const express = require("express");

const app = express(); //new webserver is created




//app.use will match all HHTP method call test
app.use("/test", (req, res) => {
    res.send("hello from the server using nodemon npx - test page");
})

app.get("/user", (req, res) => {
    res.send({
        firstname: "Arahanth",
        lastname: "M"
    })
})

app.post("/user", (req, res) => {
    console.log("save the data in the database");
    res.send("database successfully updated");

})

app.delete("/user", (req, res) => {
    //console.log("save the data in the database");
    res.send("user deleted successfully");

})


app.listen(3000, () => {
    console.log("server successfully listening on port 3000");
});