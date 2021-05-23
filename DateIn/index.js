//requires express for server 
const express = require('express');

//naming express server appServer
appServer = express();
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://jeradXander:westpoint@amazonsweapprentices.iyoil.mongodb.net/DateIn?retryWrites=true&w=majority";

//in many environments (e.g. Heroku), and as a convention, you can set the environment variable PORT to tell your web server what port to listen on.
//So process.env.PORT || 3000 means: whatever is in the environment variable PORT, or 3000 if there's nothing there.
appServer.listen(process.env.PORT || 3000, (error) => {
    //if error is passed then error will be console logged
    if(error){
        console.log(error);
    }else{
        //output to us to let us now we are listening 
        console.log('Server started at port 3000');
    }
});


MongoClient.connect(uri, {  useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
     const db = client.db('star-wars-quotes')


     //route for User Profile
appServer.get('/userprofile',(req,res) => {
    //sendgin html file
        res.sendfile( __dirname + '/pages/userprofile.html');
    })
    
    //route for home page
    appServer.get('/home',(req,res) => {
    
        res.sendfile(__dirname + '/pages/home.html');
    })
    
    //routre for login 
    appServer.get('/login',(req,res) => {
    
        res.sendfile(__dirname+ '/pages/login.html');
    })
    //route for signup
    appServer.get('/signup',(req,res) => {
    
        res.sendfile(__dirname+ '/pages/signup.html');
    })

    
    
  })

// mongoClient.connect(err => {
//   const collection = mongoClient.db("DateIn");



//   console.log('WE hitting in the big leagues connected to Mongo')
//    mongoClient.close();
// });

/* 
    ROUTES
*/
