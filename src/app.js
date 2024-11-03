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



// app.use("/user", [(req, res, next) => {
//         console.log("Routing handeled by route handler 1");
//         //res.send("response from route handler 1");
//         next();

//     },
//     (req, res, next) => {
//         console.log("Routing handeled by route handler 2");
//         //res.send("response from route handler 2");
//         next();
//     },
//     (req, res, next) => {
//         console.log("Routing handeled by route handler 3");
//         //res.send("response from route handler 3");
//         next();
//     },
//     (req, res, next) => {
//         console.log("Routing handeled by route handler 4");
//         res.send("response from route handler 4");
//         next();
//     },
//     (req, res, next) => {
//         console.log("Routing handeled by route handler 5");
//         // res.send("response from route handler 5");

//     }


// ]);

//this is also  avalid syntax , all the middle fucntions tah tdo not actually respond and lead to other function are known as middle wares
//the function that actually reply with the rsponse are called as request handlers

app.use("/", (req, res, next) => {
    console.log("handeled by / router");
    next();
});

app.use("/user", (req, res, next) => {
        console.log("handeled by the /user router 1");
        //res.send("response from router 2");
        next();
    },
    (req, res, next) => {
        console.log("handeled by the /user router 2");
        res.send("response from the router 3");
        next();
    })


// the array that we ave used can be used or not used or used between any function s , anything u can do is fine 










app.listen(3000, () => {
    console.log("server successfully listening on port 3000");
});