const multer = require("multer");// with multer we can store media files inside the cloud or inside local directory so we must defined the storage
const storage = multer.diskStorage({});//inside the storage we can add the destination


const imageFileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith("image")) {//in this statement we use the method of mimetype because we accept only the images..if some file don t start with image we dont accept it
        cb("Supported only image files!", false)
    }
    cb(null, true)
};

const videoFileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith("video")) {
        cb("Supported only image files!", false);
    }
    cb(null, true);
};

exports.uploadImage = multer({ storage, fileFilter: imageFileFilter });
exports.uploadVideo = multer({ storage, fileFilter: videoFileFilter });