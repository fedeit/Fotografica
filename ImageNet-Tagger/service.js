const fs = require('fs');
const redis = require("redis");
const db = require('./redisdb.js');
const tagger = require('./image_analysis/mobilenet_image_tagging');
const subscriber = redis.createClient();
const DISCOVERY_CHANNEL = "images_discovery_channel"

let scanNext = () => {
  db.hasNext((exists) => {
    if (!exists) {
      db.commitImages();
      return 
    };
    console.log("...getting next image");
    db.getNext(async (path) => {
      if (path == null) { return }
      let tags = await tagger.autoDBTagging(path);
      db.pushTags(path, tags);
      console.log("...image done " + path + ":\n"+ JSON.stringify(tags));
      scanNext();  
    });
  })
}

let scanQueuedImages = () => {
  console.log("Scanning images");
  db.queueLength((l) => {
    console.log("...total " + l);
  })
  scanNext();
}

exports.listen = () => {
  subscriber.on("error", (error) => {
    console.error(error);
  });
  
  subscriber.on("message", (channel, message) => {
    console.log(message);
    scanQueuedImages();
  });
  
  subscriber.subscribe(DISCOVERY_CHANNEL);    
  scanQueuedImages();
}