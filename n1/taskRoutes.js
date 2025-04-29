const express = require('express');
const router = express.Router();
const { getTasks, addTask } = require('../controllers/taskController');

router.get('/', getTasks);
router.post('/', addTask);

module.exports = router;
