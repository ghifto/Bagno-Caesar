/*const express = require('express');
const app = express();
const DataStore = require('nedb');
const fs = require('fs');

const database = new DataStore('data/database.db');
database.loadDatabase();
const content = 'This is the string I want to append to the file.\n';

// Define the file path
const filePath = 'data/database.db';

function showMessage() {
    // Display a message when the button is pressed
    alert("Button has been pressed!");
    // Append the string to the file (this will add the string at the end of the file)
    fs.appendFile(filePath, content, (err) => {
        if (err) {
            console.error('Error appending to file:', err);
        } else {
            console.log('Content has been appended successfully!');
        }
    });
}
*/


const express = require('express');
const multer = require('multer');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Initialize Express app
const app = express();
const upload = multer();

// Load service account credentials
const credentials = require('./arisite-286099006c23.json'); // Your Google Service Account JSON file
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

// Create a JWT client
const auth = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  SCOPES
);

const drive = google.drive({ version: 'v3', auth });

// Endpoint to handle file upload
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const folderId = '1POuPa-yclq-4zCI6RUctQVjxGjiV1Kls'; // Replace with your folder ID
    const fileMetadata = {
      name: req.file.originalname,
      parents: [folderId], // Save file in the shared folder
    };
    const media = {
      mimeType: req.file.mimetype,
      body: Buffer.from(req.file.buffer),
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });

    res.status(200).send(`File uploaded to Drive with ID: ${response.data.id}`);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file.');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
