const fs = require('fs')
const path = require('path')
const params = require('../fotografica_params.js')
const absolute_path = params.photoLibraryPath
const db = require('./database.js')
const img_converter = require('../storage_api/image_converter')
const exif_manager = require('../storage_api/exif_manager')

// Formats that need conversion before usage
let toConvertFormats = new Set(['heic', 'heif'])
// Formats that are natively supported
let supportedFormats = new Set(['png', 'jpg', 'jpeg'])
// Candidates paths for the live photos
let candidatePaths = [	"_HEVC.MOV", ".mov" ]

// Helper functions to check if format is supported or needs conversion
function isSupported(format) {
	return supportedFormats.has(format.toLowerCase())
}

function needsConversion(format) {
	return toConvertFormats.has(format.toLowerCase())
}

// Function to check if there is a live photo for a specific image based on defines standard filepaths
function hasLivePhoto(photoPath, filename) {
	// Get the enclosing folder path of the photo
	let enclosingFolder = path.dirname(photoPath)
	// Get filename without extension
	let filenameNoExtension = path.basename(filename, path.extname(filename))
	try {
		// Check if any of the candidate filepaths are valid
		for (var i = candidatePaths.length - 1; i >= 0; i--) {
			let current = enclosingFolder + "/" + filenameNoExtension + candidatePaths[i]
			if (fs.existsSync(current)) {
				return current.replace(absolute_path, '')
			}
		}
		return undefined
	} catch {
		console.log("Error finding live photo")
		return undefined
	}
}

// Add a photo to the system
exports.addPhoto = async (photo) => {
	// Extract the file format
	photo.format = path.extname(photo.originalPath).replace('.' ,'')
	// Extract the filename
	photo.filename = path.basename(photo.originalPath)
	// Check if image is supported
	if (isSupported(photo.format)) {
		photo.path = photo.originalPath
	} else if (needsConversion(photo.format)) {
		img_converter.convertImage(absolute_path + photo.originalPath, absolute_path + "/converted" + photo.originalFilePath)
		photo.path = "/converted" + photo.originalPath
	} else {
		return
	}
	// Check if there is a Live Photo version
	photo.livePhotoPath = hasLivePhoto(absolute_path + photo.originalPath, photo.filename)
	// Get exif info of the photo
	exif_manager.getEXIF(absolute_path + photo.originalPath, (meta) => {
		db.setMetadataFor(meta, photo.id)
	})
	// Add code to check for faces

	db.addPhoto(photo)
}