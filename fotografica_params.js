const path = require('path')

export let photoLibraryPath = path.join(__dirname, '/photos_dir')
export let photosDBName = "fotografica_photos"
// Formats that need conversion before usage
let toConvertFormats = new Set(['heic', 'heif'])
// Formats that are natively supported
let supportedFormats = new Set(['png', 'jpg', 'jpeg'])

// Helper functions to check if format is supported or needs conversion
export function isSupported(format) {
  return supportedFormats.has(format.toLowerCase())
}

export function needsConversion(format) {
  return toConvertFormats.has(format.toLowerCase())
}