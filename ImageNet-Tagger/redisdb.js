const redis = require("redis");
const client = redis.createClient();

const IMAGENET_QUEUE = "global_imagenet_path_queue";

const multi = client.multi();

client.on("error", (error) => {
    console.error(error);
});

exports.hasNext = () => {
    return ! (client.llen(IMAGENET_QUEUE) == 0);
}

exports.getNext = () => {
    return client.rpop(IMAGENET_QUEUE);
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