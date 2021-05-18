const redis = require("redis");
const client = redis.createClient();

const IMAGENET_QUEUE = "global_imagenet_path_queue";
const TAGS_TO_PATHS_MAP = "global_tags_to_paths_map";
const PATH_TO_TAGS_MAP = "global_path_to_tags_map";

const multi = client.multi();

client.on("error", (error) => {
    console.error(error);
});

exports.hasNext = (callback) => {
    client.llen(IMAGENET_QUEUE, (err, resp) => {
        callback(resp != 0);
    });
}

exports.queueLength = (callback) => {
    client.llen(IMAGENET_QUEUE, (err, resp) => {
        callback(resp);
    });
}

exports.getNext = (callback) => {
    return client.rpop(IMAGENET_QUEUE, (err, resp) => {
        callback(resp);
    });
}

exports.pushTags = (path, tags) => {
    multi.hset(PATH_TO_TAGS_MAP, path, JSON.stringify(tags));
}

exports.commitImages = () => {
    multi.exec(function(err, replies) {
        if (err) {
            console.error(err);
            return;
        }
        broadcastDone();
    });      
}