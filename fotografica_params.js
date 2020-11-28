const path = require('path')

export let photoLibraryPath = path.join(__dirname, '/photos_dir')
export let photoDiscoveryPath = path.join(__dirname, '/photos_dir_discovery')
export let photosDBName = "fotografica_photos"
// Formats that need conversion before usage
let toConvertFormats = new Set(['heic', 'heif'])
// Formats that are natively supported
let supportedFormats = new Set(['png', 'jpg', 'jpeg'])
// Candidates paths for the live photos
export let candidatePaths = [	"_HEVC.MOV", ".mov" ]
// Variable that explains if it is a new db setup (from scratch)
export let isNewSetup = false
// Helper functions to check if format is supported or needs conversion
export function isSupported(format) {
  return supportedFormats.has(format.toLowerCase())
}

export function needsConversion(format) {
  return toConvertFormats.has(format.toLowerCase())
}