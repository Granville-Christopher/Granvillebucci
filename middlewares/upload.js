// middleware/upload.js
const multer = require("multer");
const path = require("path");

// Storage configuration
const { storage } = require("../config/cloudinary"); 


// File filter (optional, can restrict to only images)
const fileFilter = function (req, file, cb) {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max: 5MB
});

module.exports = upload;
