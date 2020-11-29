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
				setupViews()
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

function setupViews() {
	photos.insert(
	  	{ "views": 
	    	{ "untagged": 
	  			{"map":
	  				function(doc) {
  						if(!doc.tagged) {
	  						emit(doc._id, doc.path); 
  						}
  					}
	 			} 
    		}
	  	}, '_design/photos', function (error, response) {
		  	if (error) {
			    console.log(error);
			}
		}
	);
}

// Get last db photo refresh timestamp
let lastRefreshVar = new Date().toISOString()

// Function to get the id and paths of the photos
exports.getPhotos = (quantity, batch, filter, callback) => {
	const query = {
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

exports.getUntaggedPhotos = (callback) => {
	photos.view('photos', 'untagged', {
		fields: [ "path", "_id", "_rev" ]
	}, function (err, res) {
	  	if (!err) {
	  		callback(res)
 	  	}
	  	else {
	     	console.log(err);
	  	}
	});
}

exports.setTags = async (id, tags) => {
	let photo = await photos.get(id)
	let taggedPhoto = {
		...photo,
		...tags
	}
 	await photos.insert(taggedPhoto, id);
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
		fields: [ "coordinates", "_id", "thumbPath", "fileTimestamp"]
	}
	photos.list(query).then((body) => {
		let res = body.rows
		.filter((doc) => {
			return doc.doc.coordinates !== undefined
	  	})
		.map((doc) => {
			return {id: doc.doc._id, coordinates: doc.doc.coordinates, thumbPath: doc.doc.thumbPath, fileTimestamp: doc.doc.fileTimestamp}
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

exports.getLastRefresh = (callback) => {
	callback(lastRefreshVar)
}