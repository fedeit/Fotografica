const params = require('../fotografica_params');
const nano = require('nano')('http://admin:admin@localhost:5984');

let photos = nano.use(params.photosDBName);

// Get last db photo refresh timestamp
let lastRefreshVar = new Date().toISOString()

// Function to get the id and paths of the photos
exports.getPhotos = (quantity, batch, filter, callback) => {
	const query = {
		include_docs: true,
		fields: [ "path", "_id" ],
		limit: quantity
	}
	photos.list(query).then((body) => {
		let res = body.rows.map((doc) => {
			return {id: doc.doc._id, thumbPath: doc.doc.thumbPath}
	  	});
	  	res.sort((a, b) => {
	  		return new Date.parse(a.metadata.dateTime) - new Date.parse(b.metadata.dateTime)
	  	})
		callback(res)
	});
}

exports.getPhoto = (id, callback) => {
	photos.get(id)
	.then((body) => {
		callback(body)
	})
	.catch((err) => {
		console.log(err)
	})
}

exports.hasImage = async (path) => {
	const query = {
		selector: {
			originalPath: {'$eq' : path} 
		}
	}
	let doc = await photos.find(query)
	return doc.docs.length != 0
}

exports.addPhoto = async (photo) => {
	let response = await photos.insert(photo)
	lastRefreshVar = new Date().toISOString()
}

exports.setMetadataFor = (meta, id) => {
	db.push("/photos/" + id + "/exif", meta, true)
}

exports.getLastRefresh = (callback) => {
	callback(lastRefreshVar)
}