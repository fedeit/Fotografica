const redis = require("redis");
const client = redis.createClient();
const IMAGES_QUEUE = "global_images_path_queue";
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

exports.getNext = (callback) => {
    return client.rpop(IMAGES_QUEUE, (err, resp) => {
        callback(resp);
    });
}

exports.pushMeta = (path, metadata) => {
    multi.hset(PATH_TO_METADATA_MAP, path, JSON.stringify(metadata));
}

exports.commitImages = () => {
    multi.exec(function(err, replies) {
        if (err) {
            console.error(err);
            return;
        }
    });      
}