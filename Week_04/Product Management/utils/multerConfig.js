const multer = require("multer");

//configuring multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `file_${Date.now()}_${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] !== "image") {
    cb(new Error("Only images are allowed"));
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter,
});
const uploadImage = upload.single("imagePath");
module.exports = uploadImage;
