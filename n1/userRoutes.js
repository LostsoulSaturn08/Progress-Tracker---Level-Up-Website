// backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/userController'); // Import the login controller

// POST route to handle user login
router.post('/login', loginUser);

module.exports = router;
