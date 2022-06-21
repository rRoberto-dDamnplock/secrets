require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")
const port = 3000;

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb://localhost:27017/userDB', {
    useNewUrlParser: true
});

/////////////////////////////////////

console.log(process.env.API_KEY)


const userSchema = new mongoose.Schema({
    email: String,
    password: String

});
//  mongoose encryption ///////

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });



const User = mongoose.model("User", userSchema)



app.get("/", function (req, res) {
    res.render("home")
})

// app.get("/login", function (req, res) {
//     res.render("login")
// })

app.get("/register", function (req, res) {
    res.render("register")
})


app.post("/register", function(req, res){
    const newUser = new User({

    email: req.body.username,
    password: req.body.password

  });

  newUser.save(function(err){
      if(err){
          console.log(err)
      } else {
          res.render("secrets")
      }
  })

})
app.get("/login", (req, res) => {
    res.render("login", {errMsg: "", username: "", password: ""});
  });
  

  app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
   
    User.findOne({email: username}, (err, foundUser) => {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          if (foundUser.password === password) {
            res.render("secrets");
            console.log("New login (" + username + ")");
          } else {
            res.render("login", {errMsg: "Email or password incorrect", username: username, password: password});
          }
        } else {
          res.render("login", {errMsg: "Email or password incorrect", username: username, password: password});
        }
      }
    });
  });


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});