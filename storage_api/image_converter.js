import {convert} from "easyimage";

// Function to convert files from HEIC/HEIF to JPG
exports.convert = async (oldPath, newPath) => {
	try {
	    await convert({
	        src: oldPath,
	        dst: newPath,
	    });
	} catch (e) {
	    console.error("Error: ", e);
	}
};