const express = require("express");

const app = express(); //new webserver is created

// const rh1 = (req, res, next) => {
//     console.log("Routing handeled by route handler 1");
//     //res.send("response from route handler 1");
//     next();

// }

// const rh2 = (req, res, next) => {
//     console.log("outing hndeled by route handler 2");
//     //res.send("response from route handler 2");
//     next();

// }

// const rh3 = (req, res, next) => {
//     console.log("outing hndeled by route handler 3");
//     // res.send("response from route handler 3");
//     next();

// }

// const rh4 = (req, res, next) => {
//     console.log("outing hndeled by route handler 4");
//     //res.send("response from route handler 4");
//     next();

// }

// const rh5 = (req, res, next) => {
//     console.log("outing hndeled by route handler 5");
//     res.send("response from route handler 5");


// }

// app.use("/user", [rh1, rh2, rh3, rh4, rh5]);



app.use("/user", [(req, res, next) => {
        console.log("Routing handeled by route handler 1");
        //res.send("response from route handler 1");
        next();

    },
    (req, res, next) => {
        console.log("Routing handeled by route handler 2");
        //res.send("response from route handler 2");
        next();
    },
    (req, res, next) => {
        console.log("Routing handeled by route handler 3");
        //res.send("response from route handler 3");
        next();
    },
    (req, res, next) => {
        console.log("Routing handeled by route handler 4");
        res.send("response from route handler 4");
        // next();
    },
    (req, res, next) => {
        console.log("Routing handeled by route handler 5");
        res.send("response from route handler 5");

    }
]);


// the array that we ave used can be used or not used or used between any function s , anything u can do is fine 










app.listen(3000, () => {
    console.log("server successfully listening on port 3000");
});