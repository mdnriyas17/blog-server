const multer = require("multer");
const DIR = "public/videos/";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    var d = new Date();
    var randomName = d.getTime();
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, randomName + fileName);
  },
});
var videoupload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "video/mp4"
     
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("only mp4 video uplaod!"));
    }
  },
});
module.exports = videoupload;