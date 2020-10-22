# Fotografica
A photomanager platform based on React, NodeJS and CouchDB. The platform runs a minimalistic frontend UI built in Bootstrap, runs fully locally (excluding CDNs), and uses a backend API server in NodeJS.
The NodeJS server runs:
- Directory discovery, reads a target directory defined in the "fotografica_params.js" file. Looks for png, jpg, jpeg files, and converts HEIC and HEIF files while maintaining the original files
- Creates small and lower quality .jpg thumbnails in the /thumbnails directory
- Places all converted images in the /converted directory
- Computes the EXIF data of the picture
- Looks for the corresponding photoname.MOV or photoname_HEVC.MOV Apple Live Photo of a discovered photo
- Adds to the database the path of the original image file, thumbnail, and converted image (if applicable), the EXIF metadata of the photo, the path to the Live Photo (if applicable) and the file creation timestamp
- Gets the EXIF coordinates to show on the frontend a Google Map of the place where the photo was shot

## Key Features
- Supports the iPhone's HEIC/HEIF photo format
- Supports Apple Live Photos. The user can play a Live Photo by simply pressing the spacebar once opened an image in the frontend
- Simple setup
- Supports large databases

## Coming soon
- Autoscan of a directory to be used for example with icloudpd or as a drag and drop directory to upload new photos
- Tensorflow object recognition for easy searching
- Tensorflow face recognition

## Folders description
The fotografica directory contains the React frontend
The database_api folder contains the integration with CouchDB and the code that manipulates images (add to db, rotate...)
The storage_api folder contains all the files that use the file IO (image tracker/discovery, EXIF reader, image converter...)

## Installation
This platform requires installing React (to build the UI), NodeJS to run the server, and CouchDB to store the photo data.
1. Create a photos_dir directory in the root of the repo (default solution) or change the path in the fotografica_params.js file
2. Setup a .env file with the credentials to the database. Make sure the user has read/write permissions
3. You must install imagemagick to convert images from HEIC/HEIF to JPG and to get the EXIF data
4. You have to create an API key for Google's Maps JavaScript API and add that to the ImageMap file in React
5. Start the server with npm start and build the UI with npm build
The server will start discovering images in the directory, create thumbnails and convert them (if necessary), and add them to the db. You can then access them in the "Photos" tab of the UI

### .env file
The .env file should be placed in the root directory and should contain the following:
```
DB_HOST=localhost:5984
DB_USER=admin
DB_PASS=password
DB_PROTOCOL=http
```
