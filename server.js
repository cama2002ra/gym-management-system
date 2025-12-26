require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Import routes
const userRoutes = require('./src/routes/userRoutes');
const trainerRoutes = require('./src/routes/trainerRoutes');
const workoutRoutes = require('./src/routes/workoutRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/workouts', workoutRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('Gym Management System API');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});