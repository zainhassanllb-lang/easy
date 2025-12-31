const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

function createUploader(folderName) {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folderName || 'easy-app', // use specific folder or default
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
      // transformation: [{ width: 500, height: 500, crop: 'limit' }], // optional
    },
  });

  return multer({ storage: storage });
}

module.exports = { createUploader };
