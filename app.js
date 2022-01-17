require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const string = require('mongoose/lib/cast/string');
const app = express();
const encrypt = require('mongoose-encryption');

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost:27017/userDB");
const userSchema = new mongoose.Schema({
    user: String,
    password: String
});
console.log(process.env.SECRET);
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });
const User = mongoose.model("User", userSchema);


app.listen(3000, function () {
    console.log("Server working on port 3000");
});

app.get("/", function (req, res) {
    res.render("home.ejs")
});
app.get("/login", function (req, res) {
    res.render("login.ejs")
});
app.get("/register", function (req, res) {
    res.render("register.ejs")
});
app.post("/register", function (req,res) {
    const username = req.body.username;
    const userpassword = req.body.password;
    const newuser = new User({ user: username, password: userpassword });
    newuser.save(function (err) {
        if (!err) {
            res.render("secrets.ejs");
        }
        else {
            console.log(err);
        }
    });
});
app.post("/login", function (req, res) {
    const username = req.body.username;
    const userpassword = req.body.password;
    User.findOne({ user: username }, function (err,foundUser) {
        if (err) {
            console.log(err);
        }
        else {
            if (foundUser) {
            if (foundUser.password === userpassword) {
                res.render("secrets.ejs");
            }
            else {
                res.send("Password Incorrect");
            }
            }
        }
    });
});

/* 
 require('dotenv').config();
 process.env.SECRET
 This is used to hide secret variable and add it to a separate directory called .env file (add the variable inside .env so that it is hidden)
 to hide secret we use .gitignore to hide in github the data, this is the link: https://github.com/github/gitignore/blob/main/Node.gitignore
 * 
 * 
 require('dotenv').config();
 Enviroment Variable to keep Secrets Safe
 * 
 * 
 const encrypt = require('mongoose-encryption');
 userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });
this is used for encrypting database mongoose, encryptedFields is used to encrypt password field
 */