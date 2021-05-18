require('dotenv').config()
const express = require("express");
const imageTagger = require("./service.js");

const app = express()
const port = 3001

app.get('/', (req, res) => {
  res.send('Fotografica ImageNet service running!')
});

app.listen(port, () => {
  console.log(`Fotogragica ImageNet service listening at http://localhost:${port}`);
  imageTagger.listen();
});
