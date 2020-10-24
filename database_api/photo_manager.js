const fs = require('fs')
const sharp = require('sharp')
sharp.cache(false);
const path = require('path')
const params = require('../fotografica_params.js')
const absolute_path = params.photoLibraryPath
const db = require('./database.js')
const img_converter = require('../storage_api/image_converter')
const exif_manager = require('../storage_api/exif_manager')

function exifNumStrToFloat(strNum) {
  let fraction = strNum.split("/")
  return parseInt(fraction[0]) / parseInt(fraction[1])
}

function parseCoordinate(coordinateString, direction) {
  let parts = coordinateString.split(", ")
  let values = []
  parts.forEach((part) => {
    values.push(exifNumStrToFloat(part))
  })
  return ConvertDMSToDD(values[0], values[1], values[2], direction)
}

function ConvertDMSToDD(degrees, minutes, seconds, direction) {
    var dd = degrees + minutes/60 + seconds/(60*60);
    if (direction === "S" || direction === "W") {
        dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
}

// Function to check if there is a live photo for a specific image based on defines standard filepaths
function hasLivePhoto(photoPath, filename) {
	// Get the enclosing folder path of the photo
	let enclosingFolder = path.dirname(photoPath)
	// Get filename without extension
	let filenameNoExtension = path.basename(filename, path.extname(filename))
	try {
		// Check if any of the candidate filepaths are valid
		for (var i = params.candidatePaths.length - 1; i >= 0; i--) {
			let current = enclosingFolder + "/" + filenameNoExtension + params.candidatePaths[i]
			if (fs.existsSync(current)) {
				return current.replace(absolute_path, '')
			}
		}
		return undefined
	} catch (err) {
		console.log("Error finding live photo" + err)
		return undefined
	}
}

// Add a photo to the system
exports.addPhoto = async (photo) => {
	try {
		// console.log("Computing " + photo.originalPath)
		// Check if db has image
	    let hasImage = await db.hasImage(photo.originalPath)
	    if (hasImage){
	    	return
	    }
		// Extract the filename
		photo.filename = path.basename(photo.originalPath)
		// Extract file format
		photo.format = path.extname(photo.originalPath).replace('.' ,'')
		// Check if image is supported
		if (params.isSupported(photo.format)) {
			photo.path = photo.originalPath
		} else if (params.needsConversion(photo.format)) {
			photo.path = "/converted" + path.dirname(photo.originalPath) + "/" + path.basename(photo.originalPath, path.extname(photo.originalPath)) + ".jpg"
			fs.mkdirSync(path.dirname(absolute_path + photo.path), { recursive: true })
			await img_converter.convert(absolute_path + photo.originalPath, absolute_path + photo.path)
		} else {
			return
		}
		// Check if there is a Live Photo version
		photo.livePhotoPath = hasLivePhoto(absolute_path + photo.originalPath, photo.filename)
		// Get exif info of the photo
		photo.metadata = await exif_manager.getEXIF(absolute_path + photo.originalPath)
		// Convert GPS Coordinates to formatted string
		if (photo.metadata !== undefined && photo.metadata.gpsLatitude !== undefined) {
	  	    let lat = parseCoordinate(photo.metadata.gpsLatitude, photo.metadata.gpsLatitudeRef)
	      	let lng = parseCoordinate(photo.metadata.gpsLongitude, photo.metadata.gpsLongitudeRef)
			photo.coordinates = { lat: lat, lng: lng }
		}
		// Make a thumbnail for the image
		photo.thumbPath = "/thumbnails" + photo.path
		makeThumbnail(absolute_path + photo.path, absolute_path + photo.thumbPath)
		// Get time when photo was created
		photo.fileTimestamp = createdDate(absolute_path + photo.originalPath)
		// Save the photo to the server
		await db.addPhoto(photo)
		return await Promise.resolve(true);
	} catch (err) {
		console.log(err)
		return await Promise.resolve(false);
	}
}

function createdDate (file) {  
  const { birthtime } = fs.statSync(file)

  return birthtime
}


function makeThumbnail(imgPath, toPath) {
	fs.mkdirSync(path.dirname(toPath), { recursive: true })
	sharp(imgPath)
	.jpeg({ quality: 70 })
	.resize(200, 200)
	.toFile(toPath, (err, resizeImage) => {
         if (err) {
              console.log(imgPath + " Error making thumbnail! " + toPath + " " + err);
         }
	});
}

exports.rotateClockwise = (id, callback) => {
	db.getPhoto(id, (doc) => {
		sharp(absolute_path + doc.path)
		.rotate(90)
		.withMetadata()
	    .toBuffer(function(err, buffer) {
			if(err) throw err
			fs.writeFile(absolute_path + doc.path, buffer, function() {
				sharp(absolute_path + doc.thumbPath)
				.rotate(90)
				.withMetadata()
			    .toBuffer(function(err, buffer) {
					if(err) throw err
					fs.writeFile(absolute_path + doc.thumbPath, buffer, function() {
						callback()
					});
				})
			});
		})
	})
}