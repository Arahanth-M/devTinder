const mongoose = require("mongoose");

//so basically this URL is refering to the cluster in our database not the database , be very careful 
//async and await functions always returns a promise and we can handle this promise by using .then() and .catch()
// after applying /devTinder , it refers to that particular database
const connectDB = async () => {
    await mongoose.connect("mongodb+srv://Arahanth:MftpTuEzF7ILWZcY@nodejs.dkfd9.mongodb.net/devTinder");
}

module.exports = {
    connectDB
};