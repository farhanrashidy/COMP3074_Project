const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');
const { authenticateToken } = require('../middleware/auth');

// GET /api/user/profile
router.get('/profile', authenticateToken, async (req, res) => {
    // The user object from the token is in req.user
    const userId = req.user.id;
    console.log(`Profile requested for user ID: ${userId}`);

    // Fetch the complete user profile from your 'profiles' table
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching profile:', error.message);
        return res.status(500).json({ error: 'Failed to fetch user profile.' });
    }
    
    if (!data) {
        return res.status(404).json({ error: 'Profile not found.' });
    }

    res.status(200).json(data);
});

module.exports = router;
