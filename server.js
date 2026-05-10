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

// Cache for settings
let siteSettings = {
    brand_name: 'CHAMUNDA',
    hero_title: 'Exceptional Wedding Artistry',
    hero_subtitle: 'Established 1995',
    contact_phone: '+91 98765 43210',
    contact_email: 'info@chamundamandap.com',
    office_address: 'Main Road, Surat, Gujarat'
};

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

app.patch('/api/gallery/:id', async (req, res) => {
    const { id } = req.params;
    const { caption } = req.body;
    const { error } = await supabase.from('gallery').update({ caption }).eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Gallery item updated" });
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

app.patch('/api/services/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const { error } = await supabase.from('services').update({ title, description }).eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Service updated" });
});

// Settings Endpoints
app.get('/api/settings', async (req, res) => {
    // Try to get from Supabase, fallback to memory
    const { data, error } = await supabase.from('settings').select('*').single();
    if (error || !data) return res.json(siteSettings);
    res.json(data);
});

app.post('/api/settings', async (req, res) => {
    const newSettings = req.body;
    const { error } = await supabase.from('settings').upsert([newSettings]);
    if (error) {
        siteSettings = { ...siteSettings, ...newSettings }; // Fallback to memory
        return res.status(400).json({ error: error.message });
    }
    res.json({ message: "Settings updated successfully" });
});

// Seed Default Data Endpoint (one-time use)
app.post('/api/seed', async (req, res) => {
    const { password } = req.body;
    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // Default Gallery Items
        const galleryItems = [
            { caption: 'Royal Palace Mandap', image_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1200' },
            { caption: 'Night Glow Reception', image_url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=1200' },
            { caption: 'Traditional Stage Decoration', image_url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=1200' },
            { caption: 'Floral Entrance Arch', image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200' },
            { caption: 'Garden Wedding Setup', image_url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=1200' },
            { caption: 'Luxury Chandelier Decor', image_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200' }
        ];

        // Default Services
        const serviceItems = [
            { title: 'Royal Traditional Mandap', description: 'Our signature gold and red theme with hand-carved pillars and fresh rose arrangements.', image_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1200' },
            { title: 'Modern Floral Paradise', description: 'A minimalist white and pastel theme with exotic lilies and orchids for morning weddings.', image_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200' },
            { title: 'Grand Entrance Decor', description: 'Create a lasting first impression with luxury floral arches and cinematic walkway lighting.', image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200' }
        ];

        const { error: galleryError } = await supabase.from('gallery').insert(galleryItems);
        const { error: serviceError } = await supabase.from('services').insert(serviceItems);

        if (galleryError) console.log('Gallery seed error:', galleryError.message);
        if (serviceError) console.log('Service seed error:', serviceError.message);

        res.json({ 
            message: 'Default data seeded successfully!', 
            gallery: galleryError ? galleryError.message : '6 items added',
            services: serviceError ? serviceError.message : '3 items added'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
