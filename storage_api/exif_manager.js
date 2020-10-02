const fs = require('fs')
const path = require('path')
const exiftool = require('node-exiftool')
const exiftoolBin = require('dist-exiftool')
const absolute_path = path.join(__dirname, '../photos_dir')

const ep = new exiftool.ExiftoolProcess(exiftoolBin)

exports.getEXIF = (path, callback) => {
	ep.open()
	.then(() => ep.readMetadata(absolute_path + path, ['-File:all']))
	.then(callback)
	.then(() => ep.close())
	.catch(console.error)
}