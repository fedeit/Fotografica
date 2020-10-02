const express = require('express')
const path = require('path');
const app = express()
const port = 80

app.use(express.static(path.join(__dirname, 'photos_dir')));

const database = require('./database_api/database')
const exif_manager = require('./storage_api/exif_manager')

app.get('/photos', (req, res) => {
	let reqFilters = req.query
	let filter = {
		year: reqFilters.year
	}
	database.getPhotos(filter, (photos) => {
		res.send(200, {success: true, result: photos})
	})
})

app.get('/photoMetadata', (req, res) => {
	let photoId = req.query.id
	if (photoId === undefined) { return res.send(400, {success: false}) }
	database.getPhoto(photoId, (photo) => {
		exif_manager.getEXIF(photo.path, (meta) => {
			res.status(200).send({success: true, metadata: meta.data[0]})
		});
	})
})

app.get('/photo', (req, res) => {
	let photoId = req.query.id
	if (photoId === undefined) { return res.send(400, {success: false}) }
	database.getPhoto(photoId, (photo) => {
		res.status(200).send({success: true, metadata: photo})
	})
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})