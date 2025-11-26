require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { authenticateToken } = require('./middleware/auth');
const { supabase } = require('./supabaseClient');

const app = express();
const LOCAL_IP_ADDRESS = process.env.LOCAL_IP_ADDRESS || '127.0.0.1';
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/status', (req, res) => {
    res.status(200).json({ status: 'API is running' });
});

// Auth related routes
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

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

    // Fetch the user's profile from the public.profiles table
    const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

    if (profileError || !profileData) {
        console.error('Error fetching profile for user:', authData.user.id, profileError?.message);
        // We can still let the user log in, but the frontend will have to handle a missing profile.
        // Or we could return an error. For now, let's return an error.
        return res.status(500).json({ message: 'User authenticated, but failed to fetch user profile.' });
    }

    res.json({
        message: 'Login successful',
        token: authData.session.access_token,
        user: {...profileData, email: authData.user.email}
    });
});

app.post('/api/auth/logout', authenticateToken, async (req, res) => {
    const { user } = req;
    console.log(`Logout requested for user ID: ${user.id}`);

    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error('Supabase logout error:', error.message);
        return res.status(500).json({ message: error.message });
    }

    res.status(200).json({ message: 'Logout successful' });
});

app.post('/api/auth/signup', async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ error: 'Name, email and password are required' });
    }

    console.log(`Signup attempt for email: ${email}`);

    // Create the user in the auth.users table
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                display_name: name, // This stores the name in the user's metadata
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

    // Insert the display name and username into the public.profiles table
    const { error: profileError } = await supabase
        .from('profiles')
        .insert([
            { id: authData.user.id, display_name: name, username: name },
        ]);

    if (profileError) {
        // This is a tricky situation. The user is created in auth, but the profile failed.
        // For now, we'll log the error and still return success to the user,
        // as they can probably set their name later.
        console.error('Error creating user profile:', profileError.message);
    }

    res.status(201).json({
        message: 'Signup successful.',
        user: authData.user,
    });
});

app.get('/api/user/profile', authenticateToken, async (req, res) => {
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

app.listen(PORT, LOCAL_IP_ADDRESS, () => {
    console.log(`API Server is listening at http://${LOCAL_IP_ADDRESS}:${PORT}`);
});
