const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const db = require('../db');

const app = express();
const port = 3000;

// MySQL connection

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const toUpload = (req, res) => {
    console.log("l");
    upload.single('file')(req, res, (err) => {
      if (err) {
        console.error('Error uploading file:', err);
        return res.status(500).send('Error uploading file');
      }
  
      const { originalname, mimetype, buffer } = req.file;
      console.log("l");
      const query = 'INSERT INTO images (name, data, mimetype) VALUES (?, ?, ?)';
  
      db.query(query, [originalname, buffer, mimetype], (err, result) => {
        if (err) {
          console.error('Error inserting file into database:', err);
          return res.status(500).send('Error uploading file');
        }
  
        res.status(200).send({ fileId: result.insertId, message: 'File uploaded successfully' });
      });
    });
  };
  

const toShow = (req, res) => {
    const { id } = req.params; // Extract id from request parameters
  
    const query = 'SELECT data, mimetype FROM images WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error fetching image:', err);
        return res.status(500).send('Error fetching image');
      }
      if (results.length === 0) {
        return res.status(404).send('Image not found');
      }
      const image = results[0];
      res.contentType(image.mimetype);
      res.send(image.data);
    });
  };




module.exports = { toUpload, toShow };
