const redis = require("redis");
const client = redis.createClient();

const IMAGENET_QUEUE = "global_imagenet_path_queue";

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

exports.commitImages = () => {
    multi.exec(function(err, replies) {
        if (err) {
            console.error(err);
            return;
        }
        broadcastDone();
    });      
}