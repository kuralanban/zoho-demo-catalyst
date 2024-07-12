import express from 'express';
import multer from 'multer';
import { connectDB } from './config/db.config.js';
import loadPropertyRoutes from './routes/property.route.js';
import { sendNewPropertyMail } from './service/notifications/mail.service.js';
import catalyst from 'zcatalyst-sdk-node';

const app = express();
const port = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 9000;
const upload = multer({ dest: 'uploads/' });

app.use(express.static('raisewsp'));
app.use("/property", express.static("./uploads/properties"));

app.get("/check", (req, res) => {
  res.send("Working!");
});

app.post("/mail", (req, res) => { sendNewPropertyMail(req, res) });

app.post("/upload", upload.single('file'), (req, res) => {
  const catalystApp = catalyst.initialize(req);
  const filestore = catalystApp.filestore();
  const folder = filestore.folder(23600000000007282); // Provide the Folder ID

  const fileObject = {
    code: req.file.filename, // A unique identifier for the file
    name: req.file.originalname, // Original file name
    file: req.file.path // File path in the server
  };
  console.log(fileObject)
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

loadPropertyRoutes(app);

connectDB();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  console.log(`http://localhost:${port}/`);
});
