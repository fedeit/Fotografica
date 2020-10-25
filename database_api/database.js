require('dotenv').config()
const params = require('../fotografica_params');
const nano = require('nano')( process.env.DB_PROTOCOL + '://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@' + process.env.DB_HOST);

// Specify db for photos
let photos;

exports.verify = (completion) => {
	nano.db.list().then((body) => {
		if (body.includes(params.photosDBName)) {
			console.log("Database " + params.photosDBName + " exists")
			photos = nano.use(params.photosDBName);
			completion(true)
		} else {
			nano.db.create(params.photosDBName).then((body) => {
				console.log("Database " + params.photosDBName + " created! ");
				params.isNewSetup = true
				photos = nano.use(params.photosDBName);
				completion(true)
			}).catch((err) => {
				console.log(err)
				completion(false)
			})
		}
	}).catch((err) => {
		console.log(err)
		completion(false)
	})
}

// Get last db photo refresh timestamp
let lastRefreshVar = new Date().toISOString()

// Function to get the id and paths of the photos
exports.getPhotos = (quantity, batch, filter, callback) => {
	const query = {
		include_docs: true,
		fields: [ "thumbPath", "_id" ],
		limit: quantity,
		skip: quantity * batch
	}
	photos.list(query).then((body) => {
		let res = body.rows.map((doc) => {
			return {id: doc.doc._id, thumbPath: doc.doc.thumbPath, fileTimestamp: new Date(doc.doc.fileTimestamp)}
	  	});
	  	res.sort((a, b) => {
	  		if (a.fileTimestamp !== undefined && b.fileTimestamp !== undefined) {
		  		return a.fileTimestamp - b.fileTimestamp
	  		}
	  		return false
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

exports.getAllCoordinates = (callback) => {
	const query = {
		include_docs: true,
		fields: [ "coordinates", "_id", "thumbPath"]
	}
	photos.list(query).then((body) => {
		let res = body.rows
		.filter((doc) => {
			return doc.doc.coordinates !== undefined
	  	})
		.map((doc) => {
			return {id: doc.doc._id, coordinates: doc.doc.coordinates, thumbPath: doc.doc.thumbPath}
	  	});
		callback(res)
	});
}

exports.hasImage = async (path) => {
	if (params.isNewSetup) {
		return false
	}
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