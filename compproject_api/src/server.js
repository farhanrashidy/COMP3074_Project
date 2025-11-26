require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import route handlers
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const app = express();
const LOCAL_IP_ADDRESS = process.env.LOCAL_IP_ADDRESS || '127.0.0.1';
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// API status endpoint
app.get('/api/status', (req, res) => {
    res.status(200).json({ status: 'API is running' });
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);


app.listen(PORT, LOCAL_IP_ADDRESS, () => {
    console.log(`API Server is listening at http://${LOCAL_IP_ADDRESS}:${PORT}`);
});