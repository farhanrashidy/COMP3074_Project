const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');
const { authenticateToken } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    console.log(`Login attempt for email: ${email}`);

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ 
        email: email,
        password: password,
    });

    if (authError) {
        console.error('Supabase login error:', authError.message);
        return res.status(401).json({ message: authError.message });
    }
    
    if (!authData.user) {
        return res.status(500).json({ message: 'Login successful, but no user data returned from auth.' });
    }

    const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

    if (profileError || !profileData) {
        console.error('Error fetching profile for user:', authData.user.id, profileError?.message);
        return res.status(500).json({ message: 'User authenticated, but failed to fetch user profile.' });
    }

    console.log(`Successfully authenticated user ${authData.user.email}`);

    res.json({
        message: 'Login successful',
        token: authData.session.access_token,
        user: {...profileData, email: authData.user.email },
    });
});

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ error: 'Name, email and password are required' });
    }

    console.log(`Signup attempt for email: ${email}`);

    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                display_name: name,
            }
        }
    });

    if (authError) {
        console.error('Supabase signup error:', authError.message);
        return res.status(400).json({ message: authError.message });
    }
    
    if (!authData.user) {
        return res.status(500).json({ message: 'Signup successful, but no user data returned.' });
    }

    const { error: profileError } = await supabase
        .from('profiles')
        .insert([
            { id: authData.user.id, display_name: name, username: name },
        ]);

    if (profileError) {
        console.error('Error creating user profile:', profileError.message);
    }

    res.status(201).json({
        message: 'Signup successful.',
        user: authData.user,
    });
});

// POST /api/auth/logout
router.post('/logout', authenticateToken, async (req, res) => {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error('Supabase logout error:', error.message);
        return res.status(500).json({ message: error.message });
    }

    res.status(200).json({ message: 'Logout successful' });
});


module.exports = router;
