//list of requires
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const http = require("http")
const path = require("path");
const fs = require("fs");
const gm = require("gm");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const { buffer } = require('buffer');


//naming express server appServer
appServer = express();
appServer.set("view engine", "ejs");
// Parse URL-encoded bodies (as sent by HTML forms)
appServer.use(express.urlencoded({ extended: true }));
appServer.use(bodyParser.urlencoded({ extended: true }));

//flash use maybe too much?
appServer.use(cookieParser());
appServer.use(
  session({
    secret: "Westpoint",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);


// Parse JSON bodies (as sent by API clients)
appServer.use(express.json());

//uses static public folder to access statci files
appServer.use(express.static("public"));


const upload = multer({
  dest: "./uploads"
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://jeradXander:westpoint@amazonsweapprentices.iyoil.mongodb.net/DateIn?retryWrites=true&w=majority";
const { ObjectId } = require("mongodb");


//in many environments (e.g. Heroku), and as a convention, you can set the environment variable PORT to tell your web server what port to listen on.
//So process.env.PORT || 3000 means: whatever is in the environment variable PORT, or 3000 if there's nothing there.
appServer.listen(process.env.PORT || 3000, (error) => {
  //if error is passed then error will be console logged
  if (error) {
    console.log(error);
  } else {
    //output to us to let us now we are listening
    console.log("Server started at port 3000 ");
  }
});


//get welcome and start screen had to put up here because bug was making heroku fail
appServer.get("/", async (req, res) => {
  console.log(" get home");

  //sending statis html file
  res.sendFile(__dirname + "/public/pages/home.html");
});

//connecting to mongo client
MongoClient.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((client) => {

  //output to devs
  console.log("Connected to Database");

  //creating db and collection =
  const db = client.db("Datein");
  const usersCollection = db.collection("users");
  
  //global variables
  var currentUID = "";
  
  //route for home page
  appServer.get("/", async (req, res) => {
    console.log(" get home");
    res.sendFile(__dirname + "/public/pages/home.html");
  });

  //getting login fail html page
  appServer.get("/loginf", (req, res) => {
    console.log(" get loginfailed");
    res.sendFile(__dirname + "/public/pages/loginfailed.html");
  });
  //routre for login
  appServer.get("/login", (req, res) => {
    console.log(" get login");
    res.sendFile(__dirname + "/public/pages/login.html");
  });

  appServer.post("/login", async (req, res) => {

    //global varialbes
    let user = "";
    let email = req.body.exampleInputEmail1;
    let password = req.body.exampleInputPassword1;
    let mongoResult = {};
    let candidatesArray = [];

    //try catch for pulling data from page
    try {
      var users = usersCollection
        .find({})
        .toArray(async function (err, result) {
          if (err) throw err;
          //console.log(result);

          //looping through collection to pull top top
          for (let index = 0; index < 10; index++) {
            let randomNum = Math.floor(Math.random() * result.length);

            //checking if user is already picked in top 10
            if (!candidatesArray.includes(result[randomNum])) {
              candidatesArray.push(result[randomNum]);
            } else {
              index--;
            }
          }
          
        });

        //finding user in users by email
      usersCollection.findOne({ email }, async function (err, result) {
        if (err) throw err;
        console.log(result);

        //getting result from mong
        mongoResult = result;
        currentUID = ObjectId(mongoResult._id);
        console.log(mongoResult.password);

        //waiting for results then comparing data
        if (await bcrypt.compare(password, mongoResult.password)) {
          appServer.get(`/userprofile/${currentUID}`, async (req, res) => {
            //sendgin html file
            console.log("get profile");

            //rendering file and sending user info 
            res.render(__dirname + "/public/pages/userprofile.ejs", {
              name: "DateIn",
              userInfo: mongoResult,
            });
          });

          //getting info from fetch in client side
          appServer.get("/dbData", (req, res) => {
            res.send({
              email: mongoResult.email,
              password: mongoResult.password,
              firstName: mongoResult.firstName,
              lastName: mongoResult.lastName,
              identity: mongoResult.identity,
              lookingFor: mongoResult.lookingFor,
              contactNumber: mongoResult.contactNumber,
              linkedIn: mongoResult.linkedIn,
              age: mongoResult.age,
              occupation: mongoResult.occupation,
              aboutMe: mongoResult.aboutMe,
              appsRecieved: mongoResult.appsRecieved,
              candidatesAccepted: mongoResult.candidatesAccepted,
              imageURL: mongoResult.imageURL,
            });
          });

          //sending top 10 to client side
          appServer.get("/dbDataCandidates", (req, res) => {
            res.send({ candidateArray: candidatesArray });
          });
          //redirection to userprofile
          res.redirect(`/userprofile/${currentUID}`);

          //"dbDataCandidates"
        } else {
          //login failed
          res.redirect("/loginf");
        }
      });
    } catch (error) {
      console.log(error);
    }
  });

//loginf is the same lofic as ligin just sending the login failed html
  appServer.post("/loginf", async (req, res) => {
    let user = "";
    let email = req.body.exampleInputEmail1;
    let password = req.body.exampleInputPassword1;
    let mongoResult = {};
    let candidatesArray = [];
    try {
      var users = usersCollection
        .find({})
        .toArray(async function (err, result) {
          if (err) throw err;
          //console.log(result);

          for (let index = 0; index < 10; index++) {
            let randomNum = Math.floor(Math.random() * result.length);
            if (!candidatesArray.includes(result[randomNum])) {
              candidatesArray.push(result[randomNum]);
            } else {
              index--;
            }
          }
          console.log(candidatesArray.length);
          for (let index = 0; index < candidatesArray.length; index++) {
            console.log(candidatesArray[index]);
          }
          //console.log(...getNonDuplicatedValues);
        });

      usersCollection.findOne({ email }, async function (err, result) {
        if (err) throw err;
        console.log(result);
        mongoResult = result;
        currentUID = ObjectId(mongoResult._id);
        console.log(mongoResult.password);

        if (await bcrypt.compare(password, mongoResult.password)) {
          appServer.get(`/userprofile/${currentUID}`, async (req, res) => {
            //sendgin html file
            console.log("get profile");
            res.render(__dirname + "/public/pages/userprofile.ejs", {
              name: "DateIn",
              userInfo: mongoResult,
            });
          });
          appServer.get("/dbData", (req, res) => {
            res.send({
              email: mongoResult.email,
              password: mongoResult.password,
              firstName: mongoResult.firstName,
              lastName: mongoResult.lastName,
              identity: mongoResult.identity,
              lookingFor: mongoResult.lookingFor,
              contactNumber: mongoResult.contactNumber,
              linkedIn: mongoResult.linkedIn,
              age: mongoResult.age,
              occupation: mongoResult.occupation,
              aboutMe: mongoResult.aboutMe,
              appsRecieved: mongoResult.appsRecieved,
              candidatesAccepted: mongoResult.candidatesAccepted,
              imageURL: mongoResult.imageURL,
            });
          });

          appServer.get("/dbDataCandidates", (req, res) => {
            res.send({ candidateArray: candidatesArray });
          });

          res.redirect(`/userprofile/${currentUID}`);

          //"dbDataCandidates"
        } else {
          res.redirect("/loginf");
        }
      });
    } catch (error) {
      console.log(error);
    }
  });


  //get for userprofile 
  appServer.get(`/userprofile/${currentUID}`, async (req, res) => {
    //sendgin html file
    console.log("get profile");
    //res.sendFile(__dirname + "/public/pages/userprofile.html");
    res.render(__dirname + "/public/pages/userprofile.ejs");
  });

  //route for signup
  appServer.get("/signup", (req, res) => {
    console.log(" get signup");
    res.sendFile(__dirname + "/public/pages/signup.html");
  });

  appServer.post("/signup", async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.inputPassword, 10);
    //db find all emails
    //get req password
    //get bcrypto hash password

    //signing up new user 
    imageKey = req.body.inputEmail;
    const newUser = {
      email: req.body.inputEmail,
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      identity: req.body.inputIdentity,
      lookingFor: req.body.lookingForSelect,
      contactNumber: req.body.inputContactNumber,
      linkedIn: req.body.linkedin,
      age: req.body.age,
      occupation: req.body.occupation,
      aboutMe: req.body.aboutMe,
      appsRecieved: [],
      candidatesAccepted: [],
      imageURL:
        req.body.imageUrl,
    };


    //inserting new user into db
    usersCollection
      .insertOne(newUser)
      .then((result) => {
       
        //res.redirect("/login");
        res.redirect("/login");
      })
      .catch((error) => console.error(error));
  });

  //route for User Profile to use later once we figure out s3
  appServer.get("/userImagePage", (req, res) => {
    //sendgin html file
    console.log("get userImagePage");
    res.sendFile(__dirname + "/public/pages/userImage.html");
  });
});

