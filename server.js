const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const fs = require('fs');
const mongoose = require('mongoose')
const app = express();
const path = require('path')

app.use(cors());
app.use(fileUpload());

const mongoURI = 'mongodb+srv://elvishbaba282:billa.raj@cluster0.vofcimr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
// Checking Endpoint

const conn = mongoose.createConnection(mongoURI)

const uploadsFolder = path.join(__dirname, './client/public/uploads');

app.get("/api/uploads", (req, res) => {
  fs.readdir(uploadsFolder, (err, files) => {
    if (err) {
      console.error("Error reading uploads folder:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|gif)$/i.test(file)
    );
    const images = imageFiles.map((file) => ({
      fileName: file,
    }));
    res.json(images);
  });
});
app.use("/uploads", express.static("uploads"));


app.get('/checkFileExists/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = `${__dirname}/client/public/uploads/${fileName}`;

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File does not exist
      res.json({ exists: false });
    } else {
      // File exists
      res.json({ exists: true });
    }
  });
});


// Upload Endpoint
app.post('/upload', (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  const file = req.files.file;

  file.mv(`${__dirname}/client/public/uploads/${file.name}`, err => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
