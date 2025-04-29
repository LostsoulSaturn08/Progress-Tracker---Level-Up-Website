const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadProfileImage } = require('../controllers/profileController');
const authenticateUser = require('../controllers/authMiddleware'); // ✅ correct folder path

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage }); // ✅ define BEFORE using

// Route to handle profile image upload
router.post(
  '/upload-profile-image',
  (req, res, next) => {
    // Inject authenticateUser manually here to log after decoding
    const jwt = require('jsonwebtoken');
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized - No token" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
      req.user = decoded;

      // ✅ Your requested logs
      console.log("Authorization header:", authHeader);
      console.log("Decoded user:", decoded);

      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
  },
  upload.single('profileImage'),
  uploadProfileImage
);

module.exports = router;
