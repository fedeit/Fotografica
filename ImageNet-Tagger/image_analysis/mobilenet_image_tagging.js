const tfnode = require('@tensorflow/tfjs-node');
const mobilenet = require('@tensorflow-models/mobilenet');
const fs = require('fs')

exports.autoDBTagging = async (path) => {
	// Run mobilenetImage
	let tags = await mobilenetImage(process.env.LIBRARY_PATH + path)
	// Map only classifications with 30% plus
	let significantTags = tags.filter((tag) => { return tag.probability > 0.3 })
	// Create array version of the data
	let tagsArray = significantTags.map((tag) => { return tag.className })
	// Make object for photo in db
	let data = {
		tags: tagsArray,
		tagsDetail: significantTags,
		tagged: true
	}
	return data;
}

async function mobilenetImage(path) {
	try {
		// Load the model
		const model = await mobilenet.load();
		// Get the image file
		const image = fs.readFileSync(path);
		const decodedImage = await tfnode.node.decodeImage(image, 3);
		// Classify the image.
		const predictions = await model.classify(decodedImage);
		// Return predictions
		return predictions
	} catch (error) {
		console.error("Error: " + error)
	}
}