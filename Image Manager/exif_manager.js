const im = require("imagemagick"); 
const util = require('util')

exports.getEXIF = async (imgPath) => {
	const readMetadataPromise = util.promisify(im.readMetadata)
	let meta = await readMetadataPromise(imgPath)
	return meta.exif
};