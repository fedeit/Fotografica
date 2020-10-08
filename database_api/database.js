const path = require('path');

let id = 0
let tree = []

function isSupported(format) {
	let formats = new Set()
	formats.add("png")
	formats.add("jpg")
	return formats.has(format)
}

exports.getPhotos = (filter, callback) => {
	let photos = tree.filter( (image) => {
		if (filter.year !== undefined) {
			return image.date.includes(filter.year)
		}
		return image
	});
	callback(photos)
}

exports.getPhoto = (id, callback) => {
	let photo = tree.filter( (image) => image.id === id )[0]
	callback(photo)
}

exports.addPhoto = (photo) => {
	photo.format = path.extname(photo.path).replace('.' ,'')
	if (isSupported(photo.format)){
		photo.id = id++
		tree.push(photo)
	}
}