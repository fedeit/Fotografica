const redis = require("redis");
const client = redis.createClient();
const publisher = redis.createClient();

const IMAGES_SET = "global_images_path_set";
const IMAGES_QUEUE = "global_images_path_queue";
const IMAGENET_QUEUE = "global_imagenet_path_queue";
const DISCOVERY_CHANNEL = "images_discovery_channel"
const STATUS_DONE = "true";

const multi = client.multi();

let broadcastDone = () => {
    publisher.publish(DISCOVERY_CHANNEL, STATUS_DONE);
    console.log("Publishing alert to channel");
}

client.on("error", (error) => {
    console.error(error);
});

exports.addImage = (path) => {
    multi.lpush(IMAGES_QUEUE, path);
    multi.lpush(IMAGENET_QUEUE, path);
    multi.sadd(IMAGES_SET, path);
}

exports.hasImage = (path, callback) => {
    return client.sismember(IMAGES_SET, path, (error, resp) => {
        callback(resp == 1);
    });
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