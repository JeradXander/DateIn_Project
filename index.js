//require("dotenv").config();
//requires express for server
const express = require("express");
var flash = require("express-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const imager = require("multer-imager");
const gm = require("gm");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const s3 = new aws.S3({});

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
appServer.use(flash());

// Parse JSON bodies (as sent by API clients)
appServer.use(express.json());

//uses static public folder to access statci files
appServer.use(express.static("public"));

const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://jeradXander:westpoint@amazonsweapprentices.iyoil.mongodb.net/DateIn?retryWrites=true&w=majority";
const { ObjectId } = require("mongodb");

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "dateinphotos",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

//in many environments (e.g. Heroku), and as a convention, you can set the environment variable PORT to tell your web server what port to listen on.
//So process.env.PORT || 3000 means: whatever is in the environment variable PORT, or 3000 if there's nothing there.
appServer.listen(process.env.PORT || 3000, (error) => {
  //if error is passed then error will be console logged
  if (error) {
    console.log(error);
  } else {
    //output to us to let us now we are listening
    console.log("Server started at port 3000 changed");
  }
});

appServer.get("/", async (req, res) => {
  console.log(" get home");
  res.sendFile(__dirname + "/public/pages/home.html");
});

//connecting to mongo client
MongoClient.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((client) => {
  console.log("Connected to Database");
  const db = client.db("Datein");
  const usersCollection = db.collection("users");
  console.log(typeof usersCollection);
  var currentUID = "";

  //route for User Profile

  //can except ?name=
  //route for home page
  appServer.get("/", async (req, res) => {
    console.log(" get home");
    res.sendFile(__dirname + "/public/pages/home.html");

    // const filter = {
    // }

    // for (const key in req.query){

    // }
    // //this is example for showing sollection
    // const results = await usersCollection.find({...req.query}).toArray();

    // console.log(results);
  });

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
    let user = "";
    let email = req.body.exampleInputEmail1;
    let password = req.body.exampleInputPassword1;
    let mongoResult = {};
    try {
      var users = usersCollection
        .find({})
        .toArray(async function (err, result) {
          if (err) throw err;
          console.log(result);
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
            res.send({ candidateArray: [] });
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

  appServer.post("/userprofile", (req, res) => {
    console.log(req.body.userID);
  });

  appServer.post("/loginf", async (req, res) => {
    let user = "";
    let userEmail = req.body.exampleInputEmail1;
    res.redirect("/loginf");
    // try {
    //   let userIndex = usersCollection.findIndex(
    //     (user) => user.email === userEmail
    //   );

    //   if (userIndex === -1) {
    //     console.log("User is not in collection");
    //     res.redirect("/loginf");
    //   }
    //   if (use) {
    //     user = usersCollection[userIndex];
    //   }

    //   if (await bcrypt.compare(req.body.exampleInputPassword1, user.password)) {
    //     return done(null, user);
    //   } else {
    //     return done(null, false, { message: "Password incorrect" });
    //   }
    // } catch (error) {
    //   return done(error);
    // }
  });

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
        "https://images.unsplash.com/photo-1604700403855-dc64a1320324?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1349&q=80",
    };

    req.flash("success", "Registration successfully");
    res.locals.message = req.flash();

    usersCollection
      .insertOne(newUser)
      .then((result) => {
        //console.log(result);
        res.redirect("/login");
      })
      .catch((error) => console.error(error));
  });

  //edit
  // appServer.put("/info", async (req, res) => {
  //   const { name, password } = req.body;
  //   const { _id } = req.params;

  //   const filter = {
  //     _id: ObjectId(id),
  //   };

  //   const updateDocument = {};

  //   //example
  //   if (name) {
  //     updateDocument[name] = name;
  //   }

  //   const results = await usersCollection.updateOne(filter, {
  //     $set: updateDocument,
  //   });

  //   console.log(results);
  // });
});

function randstr(prefix) {
  return Math.random()
    .toString(36)
    .replace("0.", prefix || "");
}
