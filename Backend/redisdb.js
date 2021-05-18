const redis = require("redis");
const client = redis.createClient();
const PATH_TO_METADATA_MAP = "global_path_to_meta_map"
const multi = client.multi();

client.on("error", (error) => {
    console.error(error);
});

exports.hasNext = (callback) => {
    client.llen(IMAGES_QUEUE, (err, resp) => {
        callback(resp != 0);
    });
}

exports.queueLength = (callback) => {
    client.llen(IMAGES_QUEUE, (err, resp) => {
        callback(resp);
    });
}

exports.getPhotos = (qnt, batch, filter, callback) => {
    client.hgetall(PATH_TO_METADATA_MAP, (error, resp) => {
        let processedPhotos = {}
        for (const [img, value] of Object.entries(resp)) {
			processedPhotos[img] = JSON.parse(value);
            processedPhotos[img].fileTimestamp = new Date(processedPhotos[img].fileTimestamp);
		}
        callback(processedPhotos)
    })
}

exports.getPhoto = (photo, callback) => {
    client.hget(PATH_TO_METADATA_MAP, photo, (err, resp) => {
        callback(JSON.parse(resp))
    })
}

exports.getLastRefresh = (callback) => {
    callback("Today")
}

exports.getAllCoordinates = (callback) => {
    callback([])
}