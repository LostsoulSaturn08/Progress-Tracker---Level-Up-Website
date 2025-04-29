const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadProfileImage } = require('../controllers/profileController');

// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.post('/upload-profile-image', upload.single('profileImage'), uploadProfileImage);

module.exports = router;
