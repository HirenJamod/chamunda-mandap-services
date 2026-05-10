// seed-direct.js - Inserts data directly using image URLs (no Supabase Storage needed)
// Usage: node seed-direct.js

const fetch = require('node-fetch');
const BASE_URL = 'https://chamunda-mandap-services.onrender.com';

async function main() {
    console.log('\\n🖼️  Seeding Gallery Images (using direct URLs)...');
    console.log('─'.repeat(50));
    
    const galleryItems = [
        { caption: 'Royal Palace Mandap', image_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1200' },
        { caption: 'Night Glow Reception', image_url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=1200' },
        { caption: 'Traditional Stage Decoration', image_url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=1200' },
        { caption: 'Floral Entrance Arch', image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200' },
        { caption: 'Garden Wedding Setup', image_url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=1200' },
        { caption: 'Luxury Chandelier Decor', image_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200' }
    ];

    const serviceItems = [
        { title: 'Royal Traditional Mandap', description: 'Our signature gold and red theme with hand-carved pillars and fresh rose arrangements.', image_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1200' },
        { title: 'Modern Floral Paradise', description: 'A minimalist white and pastel theme with exotic lilies and orchids for morning weddings.', image_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200' },
        { title: 'Grand Entrance Decor', description: 'Create a lasting first impression with luxury floral arches and cinematic walkway lighting.', image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200' }
    ];

    // Use the seed endpoint
    const res = await fetch(`${BASE_URL}/api/seed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'admin_chamunda' })
    });
    const data = await res.json();
    console.log('Seed result:', JSON.stringify(data, null, 2));

    if (data.sql_fallback) {
        console.log('\\n⚠️  RLS blocked the insert. Trying direct Supabase insert...');
    }

    // Also try to add a direct URL-based gallery endpoint
    console.log('\\n📡 Trying direct URL-based gallery insert...');
    for (const item of galleryItems) {
        try {
            const r = await fetch(`${BASE_URL}/api/gallery/url`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });
            const d = await r.json();
            console.log(`  ${item.caption}: ${d.message || d.error || JSON.stringify(d)}`);
        } catch (e) {
            console.log(`  ${item.caption}: ${e.message}`);
        }
    }

    console.log('\\n📡 Trying direct URL-based service insert...');
    for (const item of serviceItems) {
        try {
            const r = await fetch(`${BASE_URL}/api/services/url`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });
            const d = await r.json();
            console.log(`  ${item.title}: ${d.message || d.error || JSON.stringify(d)}`);
        } catch (e) {
            console.log(`  ${item.title}: ${e.message}`);
        }
    }

    console.log('\\n✅ Done! Check your site: ' + BASE_URL);
}

main();
