// seed-data.js - Run this locally to seed data through the working API
// Usage: node seed-data.js

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const FormData = require('form-data');

const BASE_URL = 'https://chamunda-mandap-services.onrender.com';

async function downloadImage(url) {
    const response = await fetch(url);
    const buffer = await response.buffer();
    return buffer;
}

async function uploadGalleryImage(imageUrl, caption) {
    try {
        console.log(`  Uploading: ${caption}...`);
        const imageBuffer = await downloadImage(imageUrl);
        
        const form = new FormData();
        form.append('image', imageBuffer, { filename: `${caption.replace(/\\s+/g, '_')}.jpg`, contentType: 'image/jpeg' });
        form.append('caption', caption);

        const res = await fetch(`${BASE_URL}/api/gallery`, {
            method: 'POST',
            body: form
        });
        const data = await res.json();
        console.log(`  ✓ ${caption}: ${data.message || JSON.stringify(data)}`);
    } catch (err) {
        console.error(`  ✗ ${caption}: ${err.message}`);
    }
}

async function uploadService(imageUrl, title, description) {
    try {
        console.log(`  Uploading: ${title}...`);
        const imageBuffer = await downloadImage(imageUrl);
        
        const form = new FormData();
        form.append('image', imageBuffer, { filename: `${title.replace(/\\s+/g, '_')}.jpg`, contentType: 'image/jpeg' });
        form.append('title', title);
        form.append('description', description);

        const res = await fetch(`${BASE_URL}/api/services`, {
            method: 'POST',
            body: form
        });
        const data = await res.json();
        console.log(`  ✓ ${title}: ${data.message || JSON.stringify(data)}`);
    } catch (err) {
        console.error(`  ✗ ${title}: ${err.message}`);
    }
}

async function main() {
    console.log('\\n🖼️  Seeding Gallery Images...');
    console.log('─'.repeat(50));
    
    await uploadGalleryImage('https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1200', 'Royal Palace Mandap');
    await uploadGalleryImage('https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=1200', 'Night Glow Reception');
    await uploadGalleryImage('https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=1200', 'Traditional Stage Decoration');
    await uploadGalleryImage('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200', 'Floral Entrance Arch');
    await uploadGalleryImage('https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=1200', 'Garden Wedding Setup');
    await uploadGalleryImage('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200', 'Luxury Chandelier Decor');

    console.log('\\n🛎️  Seeding Services...');
    console.log('─'.repeat(50));
    
    await uploadService(
        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1200',
        'Royal Traditional Mandap',
        'Our signature gold and red theme with hand-carved pillars and fresh rose arrangements.'
    );
    await uploadService(
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200',
        'Modern Floral Paradise',
        'A minimalist white and pastel theme with exotic lilies and orchids for morning weddings.'
    );
    await uploadService(
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
        'Grand Entrance Decor',
        'Create a lasting first impression with luxury floral arches and cinematic walkway lighting.'
    );

    console.log('\\n✅ Seeding complete! Refresh your website to see the changes.');
    console.log('🌐 ' + BASE_URL);
}

main();
