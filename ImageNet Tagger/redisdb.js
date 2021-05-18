const redis = require("redis");
const client = redis.createClient();

const IMAGES_SET = "global_images_path_set";
const IMAGES_QUEUE = "global_images_path_queue";

const multi = client.multi();

client.on("error", (error) => {
    console.error(error);
});

exports.addImage = (path) => {
    multi.lpush(IMAGES_QUEUE, path);
    multi.sadd(IMAGES_SET, path);
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