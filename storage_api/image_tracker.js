const fs = require('fs')
const path = require('path')
const photo_manager = require('../database_api/photo_manager')
const params = require('../fotografica_params')
const photo_library_path = params.photoLibraryPath
const discovery_folder_path = params.photoLibraryPath
const db = require('../database_api/database.js')
const cliProgress = require('cli-progress');


let discovered = []
// Recursive function to find all valid image files
var discoverAllImages = function(dir, absolute_path, done) {
  // Start from root dir
  fs.readdir(dir, (err, list) => {
    // Exclude hidden files and ignore some folders
    list = list.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));
    list = list.filter(item => !(item.includes('converted') || item.includes('thumbnails')));

    if (err) return done(err)

    var pending = list.length;
    if (!pending) return done()

    list.forEach((file) => {
      file = path.resolve(dir, file);
      fs.stat(file, async function(err, stat) {
        // If is a directory, recurse
        if (stat && stat.isDirectory()) {
          discoverAllImages(file, absolute_path, function(err, res) {
            if (!--pending) done()
          });
        } else {
          let imgPath = file.replace(absolute_path, '')
          // Extract the file format
          let format = path.extname(imgPath).replace('.' ,'')
          // Check if format is valid
          if (params.isSupported(format) || params.needsConversion(format)) {
            // Add to array of photo paths to anlyze
            discovered.push(imgPath)
          }
          if (!--pending) done()
        }
      });
    });
  });
};


exports.autoDiscover = () => {
  // Auto discover lib
  console.log("Parsing originals");
  discoverAllImages(discovery_folder_path, discovery_folder_path, async (err) => {
    console.log("Done parsing! ");
    // Create a progress bar in the terminal UI
    const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    progress.start(discovered.length, 0);
    // For each photo discovered, add it to the library
    for (var i = 0; i < discovered.length; i++) {
      progress.update(i);
      // Move picture to the originals lib directory
      let new_path = photo_manager.movePhoto(discovered[i], photo_library_path)
      // For each path, add photo to photomanager 
      //let success = await photo_manager.addPhoto({originalPath: new_path, container: 'main'})
    }
    progress.stop()
    console.log("Done with library assembly!")
    params.isNewSetup = false
  });
}
