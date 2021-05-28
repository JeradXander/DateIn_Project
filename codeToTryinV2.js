

/* 

All this code is stuff we tried and got closde with but chose to work aound for the alpha. 

*/





// const BUCKET_NAME = 'dateinphotos';
// const s3 = new aws.S3({
//   accessKeyId: 'AKIARGC46ZTH7GQDZJVM',
//   secretAccessKey: 'fqqpVSg1ag8K2B/3q2Ma7iJzbeHHm6LiqWX/u4sf'
  
// });

// const params = {
//   Bucket: BUCKET_NAME,
//   CreateBucketConfiguration: {
//       // Set your region here
//       LocationConstraint: "us-west-2"
//   }
// };



// var upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: "dateinphotos",
//     metadata: function (req, file, cb) {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: function (req, file, cb) {
//       cb(null, Date.now().toString());
//     },
//   }),
// });


// const filter = {
    // }

    // for (const key in req.query){

    // }
    // //this is example for showing sollection
    // const results = await usersCollection.find({...req.query}).toArray();

    // console.log(results);

     // appServer.post("/userprofile", (req, res) => {
  //   console.log(req.body.userID);
  // });


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

//   function randstr(prefix) {
//     return Math.random()
//       .toString(36)
//       .replace("0.", prefix || "");
//   }
  

// appServer.post("/userImage", upload.single("userImage"), async (req, res) => {

//     const tempPath = req.file.path;
//     const targetPath = path.join(__dirname, "./uploads/picUploaded.png");

//     if (path.extname(req.file.originalname).toLowerCase() === ".jpg" || path.extname(req.file.originalname).toLowerCase() === ".png" || path.extname(req.file.originalname).toLowerCase() === ".jpeg") {

//       fs.rename(tempPath, targetPath, err => {
//         if (err) return handleError(err, res);


//         console.log("pic uploaded to " + targetPath);

//         uploadFile(targetPath);

//       });
//     } else {
//       fs.unlink(tempPath, err => {
//         if (err) return handleError(err, res);

//         res
//           .status(403)
//           .contentType("text/plain")
//           .end("Only .png files are allowed!");
//       });
//     }

//     //res.redirect("/login");
//   });


// const uploadFile = (fileName) => {
//     // Read content from the file
//     const fileContent = fs.readFileSync(fileName);

//     // Setting up S3 upload parameters
//     const params = {
//       Bucket: BUCKET_NAME,
//       Key: imageKey + '.png', // File name you want to save as in S3
//       Body: fileContent
//     };

//     // Uploading files to the bucket
//     s3.upload(params, function (err, data) {
//       if (err) {
//         throw err;
//       }
//       console.log(`File uploaded successfully. ${data.Location}`);
//     });
//   };


// const handleError = (err, res) => {
//     res
//       .status(500)
//       .contentType("text/plain")
//       .end("Oops! Something went wrong!");
//   };