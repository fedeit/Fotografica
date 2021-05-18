require('dotenv').config()
const express = require("express");
const finder = require("./service.js");

const app = express()
const port = 3003

app.get('/', (req, res) => {
  res.send('Fotografica discovery service running!')
})

app.listen(port, () => {
  console.log(`Fotogragica discovery service listening at http://localhost:${port}`);
  finder.fullScan();
})