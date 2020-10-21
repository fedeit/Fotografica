const fs = require('fs')
const path = require('path')
const photo_manager = require('../database_api/photo_manager')
const params = require('../fotografica_params')
const absolute_path = params.photoLibraryPath
const db = require('../database_api/database.js')

var discoverAllImages = function(dir, done) {
  fs.readdir(dir, (err, list) => {
    if (err) return done(err)

    var pending = list.length;
    if (!pending) return done()

    list.forEach((file) => {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          discoverAllImages(file, function(err, res) {
            if (!--pending) done()
          });
        } else {
          let imgPath = file.replace(absolute_path, '')
          if (!db.hasImage(imgPath)) {
            photo_manager.addPhoto({originalPath: imgPath, date: dir.replace(absolute_path + "/", ''), container: 'main'})
          }
          if (!--pending) done()
        }
      });
    });
  });
};


console.log("Parsing originals");
discoverAllImages(absolute_path, (err) => {
  console.log("Done parsing! " + err);
});