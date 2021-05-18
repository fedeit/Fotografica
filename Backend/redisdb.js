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
    client.hkeys(PATH_TO_METADATA_MAP, callback)
}

exports.getPhoto = (photo, callback) => {
    client.hget(PATH_TO_METADATA_MAP, photo, callback)
}

exports.getLastRefresh = (callback) => {
    callback("Today")
}

exports.getAllCoordinates = (callback) => {
    callback([])
}