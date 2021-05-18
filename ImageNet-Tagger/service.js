const fs = require('fs');
const path = require('path');
const redis = require("redis");
const db = require('./redisdb.js');
const tagger = require('./image_analysis/mobilenet_image_tagging');
const subscriber = redis.createClient();
const DISCOVERY_CHANNEL = "images_discovery_channel"

let scanQueuedImages = () => {
  while (db.hasNext()) {
    let path = db.getNext();
    let tags = tagger.autoDBTagging(path);
    db.pushTags(tags);
  }
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