-- ============================================
-- Chamunda Mandap Services - Default Data Seed
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Disable RLS temporarily (so inserts work)
ALTER TABLE gallery DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;

-- Step 2: Insert Default Gallery Photos
INSERT INTO gallery (caption, image_url) VALUES
('Royal Palace Mandap', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1200'),
('Night Glow Reception', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=1200'),
('Traditional Stage Decoration', 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=1200'),
('Floral Entrance Arch', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200'),
('Garden Wedding Setup', 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=1200'),
('Luxury Chandelier Decor', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200');

-- Step 3: Insert Default Services
INSERT INTO services (title, description, image_url) VALUES
('Royal Traditional Mandap', 'Our signature gold and red theme with hand-carved pillars and fresh rose arrangements.', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1200'),
('Modern Floral Paradise', 'A minimalist white and pastel theme with exotic lilies and orchids for morning weddings.', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200'),
('Grand Entrance Decor', 'Create a lasting first impression with luxury floral arches and cinematic walkway lighting.', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200');

-- Step 4: Re-enable RLS (keep your data secure)
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Done! Refresh your website to see the changes.
