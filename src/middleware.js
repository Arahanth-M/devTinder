const adminAuth = (req, res, next) => {
    const AuthToken = "xyz";
    const status = AuthToken === "xyz";
    if (status)
        next();
    else
        res.status(401).send("the admin is not valid , please check your credentials");


}

const userAuth = (req, res, next) => {
    const AuthToken = "abcd";
    const status = AuthToken === "abc";
    if (status)
        next();
    else
        res.status(401).send("the user is not valid , please check your credentials");


}


module.exports = {
    adminAuth,
    userAuth
}