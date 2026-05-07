require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Multer for file uploads (storing in memory)
const upload = multer({ storage: multer.memoryStorage() });

// Supabase Setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin_chamunda";

// Helper function to upload to Supabase Storage
async function uploadToSupabase(file) {
    const fileName = `${Date.now()}-${file.originalname}`;
    const { data, error } = await supabase.storage
        .from('media')
        .upload(fileName, file.buffer, {
            contentType: file.mimetype
        });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
}

// API Endpoints

app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        res.json({ success: true, token: 'fake-jwt-token' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid password' });
    }
});

app.get('/api/bookings', async (req, res) => {
    const { data, error } = await supabase.from('bookings').select('*').order('timestamp', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

app.post('/api/bookings', async (req, res) => {
    const { id, name, phone, date, style, message, status, timestamp } = req.body;
    const { data, error } = await supabase.from('bookings').insert([{ id, name, phone, date, style, message, status, timestamp }]);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Booking created successfully" });
});

app.patch('/api/bookings/:id', async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Booking updated" });
});

// Gallery Endpoints
app.get('/api/gallery', async (req, res) => {
    const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

app.post('/api/gallery', upload.single('image'), async (req, res) => {
    try {
        const { caption } = req.body;
        const imageUrl = await uploadToSupabase(req.file);
        
        const { error } = await supabase.from('gallery').insert([{ image_url: imageUrl, caption }]);
        if (error) throw error;
        
        res.json({ message: "Image uploaded and added to gallery" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/gallery/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Image removed" });
});

// Services Endpoints
app.get('/api/services', async (req, res) => {
    const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: true });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

app.post('/api/services', upload.single('image'), async (req, res) => {
    try {
        const { title, description } = req.body;
        const imageUrl = await uploadToSupabase(req.file);
        
        const { error } = await supabase.from('services').insert([{ title, description, image_url: imageUrl }]);
        if (error) throw error;
        
        res.json({ message: "Service uploaded and added" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/services/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Service removed" });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
