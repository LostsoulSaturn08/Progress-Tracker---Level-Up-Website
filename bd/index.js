require('dotenv').config(); // ✅ load .env config FIRST

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const taskRoutes = require('./routes/taskRoutes');
const profileRoutes = require('./routes/profileRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('Welcome to the Spade1 API server!');
});

app.use('/api/tasks', taskRoutes);
app.use('/api', profileRoutes);
app.use('/api', userRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
