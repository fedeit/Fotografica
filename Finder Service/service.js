const fs = require('fs')
const path = require('path')
const db = require('./redisdb.js')



const supportedFormats = new Set([".jpg", ".JPG", ".png", ".PNG"])
const formatsToConvert = new Set([".HEIC", ".heic"])
let isSupported = (format) => {
  return supportedFormats.has(format);
}

let needsConversion = (format) => {
  return formatsToConvert.has(format);
}


// Recursive function to find all valid image files
let analyzeFolder = (dir, done) => {
  // Read the lookup directory
  fs.readdir(dir, (err, list) => {
    // Exclude hidden files
    list = list.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));

    // Error management
    if (err) return done(err)
    
    let pending = list.length;
    if (!pending) return done()

    // For each file in the directory
    list.forEach((file) => {
      file = path.resolve(dir, file);
      fs.stat(file, async function(err, stat) {
        // If is a directory, recurse
        if (stat && stat.isDirectory()) {
          analyzeFolder(file, function(err, res) {
            if (!--pending) done()
          });
        } else {
          // Extract the file format and path
          let imgPath = file.replace(process.env.LIBRARY_PATH, '')
          let format = path.extname(imgPath)
          // Check if format is valid
          if (isSupported(format) || needsConversion(format)) {
            // Check if image is not in db yet
            if (!db.hasImage(imgPath)) {
              db.addImage(imgPath);
            }
          }
          if (!--pending) done()
        }
      });
    });
  });
};


exports.fullScan = () => {
    // Make a complete scan of the library
    console.log("Parsing all images from " + process.env.LIBRARY_PATH);
    analyzeFolder(process.env.LIBRARY_PATH, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.info("Done parsing all images");
          db.commitImages();
        }
    });
}
