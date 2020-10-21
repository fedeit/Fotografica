const exiftool = require('node-exiftool')
const exiftoolBin = require('dist-exiftool')

const ep = new exiftool.ExiftoolProcess(exiftoolBin)

exports.getEXIF = (path, callback) => {
	// ep.open()
	// .then(() => ep.readMetadata(path, ['-File:all']))
	// .then(callback)
	// .then(() => ep.close())
	// .catch(console.error)
}
