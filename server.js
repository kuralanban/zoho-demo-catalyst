import express from 'express';
import multer from 'multer';
import loadPropertyRoutes from './routes/property.route.js';
import catalyst from 'zcatalyst-sdk-node';

const app = express();
const port = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 9000;
const upload = multer({ dest: 'uploads/' });

app.use(express.static('raisewsp'));
app.use("/property", express.static("./uploads/properties"));

app.get("/check", (req, res) => {
  res.send("Working!");
});
// These routes are working in server.js but not in /routes

app.post("/upload", upload.single('file'), (req, res) => {
  const catalystApp = catalyst.initialize(req);
  const filestore = catalystApp.filestore();
  const folder = filestore.folder(23600000000007282); // Provide the Folder ID

  const fileObject = {
    code: req.file.filename, 
    name: req.file.originalname, 
    file: req.file.path 
  };
  console.log(fileObject)
/*
 LOG data 
{
    code: '2c6fffabb5246ed4f7004feb0693f0a5',
    name: 'check.png',
    file: 'uploads/2c6fffabb5246ed4f7004feb0693f0a5' in catalyst console i created a folder uploads 
  }
  Error : Request failed with status 400 and code : INVALID_INPUT , message : either the request body or parameters is in wrong format
  Please do check on this too
  */
  folder.uploadFile(fileObject)
    .then((fileObject) => {
      console.log(fileObject);
      res.status(200).json(fileObject);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('File upload failed');
    });
});
// Routes 
loadPropertyRoutes(app);

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
