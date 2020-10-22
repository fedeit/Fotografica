const express = require('express')
const path = require('path');
const app = express()
const port = 80

app.use(express.static(path.join(__dirname, 'photos_dir')));

const database = require('./database_api/database')
const exif_manager = require('./storage_api/exif_manager')
const photo_manager = require('./database_api/photo_manager')
const image_tracker = require('./storage_api/image_tracker')

app.get('/photos', (req, res) => {
	let reqFilters = req.query
	let filter = {
		year: reqFilters.year,
	}

	let qnt = 100
	let batch = 0
	if (reqFilters.quantity !== undefined) {
		qnt = reqFilters.quantity
	}

	if (reqFilters.batchNumber !== undefined) {
		batch = reqFilters.batchNumber
	}

	database.getPhotos(qnt, batch, filter, (photos) => {
		res.status(200).send( {success: true, result: photos})
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
		res.status(200).send({success: true, result: photo})
	})
})

app.get('/lastRefresh', (req, res) => {
	database.getLastRefresh((timestamp) => {
		res.status(200).send({success: true, result: timestamp})
	})
})

app.get('/rotateClockwise', (req, res) => {
	let photoId = req.query.id
	if (photoId === undefined) { return res.send(400, {success: false}) }
	photo_manager.rotateClockwise(photoId, () => {
		res.status(200).send({success: true})
	})
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})