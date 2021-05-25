//require("dotenv").config(".env");
//requires express for server
const express = require("express");

//naming express server appServer
appServer = express();

// Parse URL-encoded bodies (as sent by HTML forms)
appServer.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
appServer.use(express.json());

//uses static public folder to access statci files
appServer.use(express.static("public"));

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
    console.log("Server started at port 3000");
  }
});

//connecting to mongo client
MongoClient.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((client) => {
  console.log("Connected to Database");
  const db = client.db("Datein");
  const usersCollection = db.collection("users");

  //route for User Profile
  appServer.get("/userprofile", (req, res) => {
    //sendgin html file
    console.log("get profile");
    res.sendFile(__dirname + "/public/pages/userprofile.html");
  });

  //can except ?name=
  //route for home page
  appServer.get("/home", async (req, res) => {
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

  //routre for login
  appServer.get("/login", (req, res) => {
    console.log(" get login");
    res.sendFile(__dirname + "/public/pages/login.html");
  });
  //route for signup
  appServer.get("/signup", (req, res) => {
    console.log(" get signup");
    res.sendFile(__dirname + "/public/pages/signup.html");
  });

  appServer.post("/signup", (req, res) => {
    console.log(req.body);

    const newUser = {
      name: req.body.username,
      password: req.body.password,
      phone: req.body.phone,
    };

    usersCollection
      .insertOne(newUser)
      .then((result) => {
        console.log(result);
        res.redirect("/home");
      })
      .catch((error) => console.error(error));
  });

  //edit
  appServer.put("/info", async (req, res) => {
    const { name, password } = req.body;
    const { _id } = req.params;

    const filter = {
      _id: ObjectId(id),
    };

    const updateDocument = {};

    //example
    if (name) {
      updateDocument[name] = name;
    }

    const results = await usersCollection.updateOne(filter, {
      $set: updateDocument,
    });

    console.log(results);
  });
});

function randstr(prefix) {
  return Math.random()
    .toString(36)
    .replace("0.", prefix || "");
}
