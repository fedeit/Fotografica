import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'

var db = new JsonDB(new Config("FotograficaDB", true, true, '/'));
// Check if there is a starting ID in the db, otherwise initialize it
try { 
	console.log("Start ID DB is " + db.getData("/settings/lastID"))
} catch {
	db.push("/settings/lastID", -1)
}
// Get last db photo refresh
try { 
	console.log("Last refresh was " + db.getData("/lastRefresh"))
} catch {
	let now = new Date().toISOString()
	db.push('/lastRefresh', now)
}

exports.getPhotos = (quantity, batch, filter, callback) => {
	let data = db.getData("/photos")
	let photos = data.filter( (image) => {
		if (filter.year !== undefined) {
			return image.date.includes(filter.year)
		}
		return image
	});
	callback(photos.slice(0, 20))
}

exports.getPhoto = (id, callback) => {
	let photo = db.getData("/photos/" + id)
	callback(photo)
}

exports.hasImage = (path) => {
	return true
	try {
		let img = db.getIndex("/photos[]/id", path, "originalPath")
		if (img == -1) {
			return false
		}
		return true
	} catch (err) {
		return false
	}
}

exports.addPhoto = (photo) => {
	let id = db.getData("/settings/lastID")
	photo.id = ++id
	db.push("/photos[]/", photo, true)
	db.push("/settings/lastID", photo.id)
	db.push("/lastRefresh", Date.now())
}

exports.setMetadataFor = (meta, id) => {
	db.push("/photos/" + id + "/exif", meta, true)
}

exports.getLastRefresh = (callback) => {
	callback(db.getData("/lastRefresh"))
}