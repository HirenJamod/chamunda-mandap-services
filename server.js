const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Supabase Setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn("WARNING: Supabase credentials missing. Database will not work.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin_chamunda";

// API Endpoints

// Login Endpoint
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        res.json({ success: true, token: 'fake-jwt-token' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid password' });
    }
});

// Get all bookings
app.get('/api/bookings', async (req, res) => {
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('timestamp', { ascending: false });

    if (error) {
        return res.status(400).json({ error: error.message });
    }
    res.json(data);
});

// Create new booking
app.post('/api/bookings', async (req, res) => {
    const { id, name, phone, date, style, message, status, timestamp } = req.body;
    
    const { data, error } = await supabase
        .from('bookings')
        .insert([{ id, name, phone, date, style, message, status, timestamp }]);

    if (error) {
        return res.status(400).json({ error: error.message });
    }
    res.json({ message: "Booking created successfully", id: id });
});

// Update booking status
app.patch('/api/bookings/:id', async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    
    const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

    if (error) {
        return res.status(400).json({ error: error.message });
    }
    res.json({ message: "Booking updated successfully" });
});

// Static files handled by express.static

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
