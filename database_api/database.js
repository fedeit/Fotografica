
let tree = [
	{id: "Img1", date: '01-01-2019', container: 'main', path: '/abc.jpg'},
	{id: "Img2", date: '01-01-2020', container: 'main', path: '/def.jpg'}
]

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