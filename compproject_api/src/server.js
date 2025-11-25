require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const LOCAL_IP_ADDRESS = process.env.LOCAL_IP_ADDRESS || '127.0.0.1';
const PORT = process.env.PORT || 4000;

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const AUTH_URL = `${SUPABASE_URL}/auth/v1`;

function sbHeaders(token = '') {
    // return header containing the anon key and optional bearer token
    const headers = {
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
}

app.use(cors());
app.use(express.json());

app.get('/api/status', (req, res) => {
    res.status(200).json({ status: 'API is running' });
});

// Auth related routes

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    if (email === '' || password === '') {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const reply = await fetch(`${AUTH_URL}/token?grant_type=password`, {
        method: 'POST',
        headers: {...sbHeaders()},
        body: JSON.stringify({ email, password })
    });
});

app.get('/api/user/profile', (req, res) => {
    const id = req.query.id;
    if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    // Mock user data
    const userProfile = {
        id: id,
        name: 'John Doe',
        email: 'john.doe@example.com'
    };

    res.status(200).json(userProfile);
});

app.listen(PORT, LOCAL_IP_ADDRESS, () => {
    console.log(`API Server is listening at http://${LOCAL_IP_ADDRESS}:${PORT}`);
});