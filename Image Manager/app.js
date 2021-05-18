require('dotenv').config()
const express = require("express");
const imageManager = require("./service.js");

const app = express()
const port = 3002

app.get('/', (req, res) => {
  res.send('Fotogragica Image Manager service running!')
});

app.listen(port, () => {
  console.log(`Fotogragica Image Manager service listening at http://localhost:${port}`);
  imageManager.listen();
});
