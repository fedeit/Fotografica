const fs = require('fs');
const path = require('path');
const db = require('../database_api/database');

const absolute_path = path.join(__dirname, '../photos_dir');

var discoverAllImages = function(dir, done) {
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);

    var pending = list.length;
    if (!pending) return done();

    list.forEach((file) => {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          discoverAllImages(file, function(err, res) {
            if (!--pending) done();
          });
        } else {
          db.addPhoto({path: file.replace(absolute_path, ''), date: dir.replace(absolute_path + "/", ''), container: 'main'})
          if (!--pending) done();
        }
      });
    });
  });
};


console.log("Parsing originals");
discoverAllImages(absolute_path, () => {
  console.log("Done parsing!");
});