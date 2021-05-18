const fs = require('fs')
const sharp = require('sharp')
sharp.cache(false);
const im = require("imagemagick"); 
const path = require('path')

let getEXIF = (imgPath, callback) => {
	im.readMetadata(imgPath, (err, meta) => {
		if (err) {
			console.error("Error reading exif" + imgPath);
			return callback();
		}
		callback(meta.exif);
	})
};

let exifNumStrToFloat = (strNum) => {
  let fraction = strNum.split("/")
  return parseInt(fraction[0]) / parseInt(fraction[1])
}

let parseCoordinate = (coordinateString, direction) => {
  let parts = coordinateString.split(", ")
  let values = []
  parts.forEach((part) => {
    values.push(exifNumStrToFloat(part))
  })
  return ConvertDMSToDD(values[0], values[1], values[2], direction)
}

let ConvertDMSToDD = (degrees, minutes, seconds, direction) => {
    var dd = degrees + minutes/60 + seconds/(60*60);
    if (direction === "S" || direction === "W") {
        dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
}

// Function to check if there is a live photo for a specific image based on defines standard filepaths
let hasLivePhoto = (photoPath, callback) => {
	// Get the enclosing folder path of the photo
	let enclosingFolder = path.dirname(photoPath)
	// Get filename without extension
	let filenameNoExtension = path.basename(photoPath, path.extname(photoPath))
	let ext = [".MOV", ".mov"]
	// Check if any of the candidate filepaths are valid
	for (var i = ext.length - 1; i >= 0; i--) {
		let livePhoto = enclosingFolder + "/" + filenameNoExtension + ext[i]
		// Check if the file exists in the current directory.
		fs.access(livePhoto, fs.constants.F_OK, (err) => {
			if (err) {
				callback(undefined)
			} else {
				callback(livePhoto.replace(process.env.LIBRARY_PATH, ''))
			}
		});
	}
}

let createdDate = (file) => {  
	const { birthtime } = fs.statSync(file)
	return birthtime
}

const supportedFormats = new Set([".jpg", ".JPG", ".png", ".PNG"])
let isSupported = (format) => {
  return supportedFormats.has(format);
}

// Add a photo to the system
exports.addPhoto = (photoPath, callback) => {
	let photo = {};
	// Extract file format
	photo.format = path.extname(photoPath);
	// Check if image is supported
	if (isSupported(photo.format)) { photo.path = photoPath; }
	else { return callback(); }
	// Extract the filename
	photo.filename = path.basename(photo.path);
	// Check if there is a Live Photo version
	hasLivePhoto(process.env.LIBRARY_PATH + photo.path, (livePath) => {
		photo.livePhotoPath = livePath
		// Get exif info of the photo
		getEXIF(process.env.LIBRARY_PATH + photo.path, (metadata) => {
			photo.metadata = metadata;
			// Convert GPS Coordinates to formatted string
			if (photo.metadata !== undefined && photo.metadata.gpsLatitude !== undefined) {
				let lat = parseCoordinate(photo.metadata.gpsLatitude, photo.metadata.gpsLatitudeRef);
				let lng = parseCoordinate(photo.metadata.gpsLongitude, photo.metadata.gpsLongitudeRef);
				photo.coordinates = { lat: lat, lng: lng };
			}
			// Make a thumbnail for the image
			makeThumbnail(photo, (thumbPath) => {
				photo.thumbPath = thumbPath
				// Get time when photo was created
				photo.fileTimestamp = createdDate(process.env.LIBRARY_PATH + photo.path);
				callback(photo);	
			})
		});
	});
}


function makeThumbnail(photo, callback) {
	// Make folder recursively if not existing
	fs.mkdirSync(path.dirname(process.env.LIBRARY_THUMB_PATH + photo.path), { recursive: true })
	// Make thumbnail
	sharp(process.env.LIBRARY_PATH + photo.path)
	.jpeg({ quality: 70 })
	.rotate()
	.resize(200, 200)
	.toFile(process.env.LIBRARY_THUMB_PATH + photo.path, (err, resizeImage) => {
		if (err) {
			console.log(process.env.LIBRARY_PATH + photo.path + " Error making thumbnail! " + process.env.LIBRARY_THUMB_PATH + photo.path + " " + err);
			callback();
		} else {
			callback(process.env.LIBRARY_THUMB_PATH + photo.path);
		}
	});
}