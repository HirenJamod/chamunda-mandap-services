// Chamunda Mandap Services - Luxury Modern Logic

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    const bookingForm = document.getElementById('booking-form');

    // 1. Custom Cursor Removed (Using CSS now)

    // 2. Navbar Scroll Effect
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // 3. Dynamic Services Fetching with Cache Busting
    const loadServices = () => {
        const servicesGrid = document.getElementById('dynamic-services');
        if (!servicesGrid) return;
        
        fetch(`/api/services?t=${Date.now()}`)
            .then(res => res.json())
            .then(services => {
                if (!services || services.length === 0) {
                    servicesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #888;">No services added yet.</p>';
                } else {
                    servicesGrid.innerHTML = services.map((s, index) => `
                        <div class="service-card" style="animation-delay: ${index * 0.2}s">
                            <img src="${s.image_url}" alt="${s.title}" class="service-img">
                            <div class="service-info">
                                <h3 class="serif">${s.title}</h3>
                                <p>${s.description}</p>
                            </div>
                        </div>
                    `).join('');
                }
            })
            .catch(err => {
                console.error('Error loading services:', err);
                servicesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #dc3545;">Failed to load services.</p>';
            });
    };

    // 4. Dynamic Gallery Fetching with Cache Busting
    const loadGallery = () => {
        const gallery = document.getElementById('dynamic-gallery');
        const bookingSelector = document.getElementById('booking-gallery-selector');

        fetch(`/api/gallery?t=${Date.now()}`)
            .then(res => res.json())
            .then(images => {
                if (gallery) {
                    if (!images || images.length === 0) {
                        gallery.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #888;">Gallery is empty.</p>';
                    } else {
                        gallery.innerHTML = images.map(img => `
                            <div class="gallery-item">
                                <img src="${img.image_url}" alt="${img.caption}">
                                <div class="gallery-overlay">
                                    <span>${img.caption}</span>
                                </div>
                            </div>
                        `).join('');
                    }
                }

                if (bookingSelector) {
                    if (!images || images.length === 0) {
                        bookingSelector.innerHTML = '<p style="color: #888; font-size: 0.8rem;">No images available.</p>';
                    } else {
                        bookingSelector.innerHTML = images.map(img => `
                            <label style="cursor: pointer; position: relative; border-radius: 8px; overflow: hidden; border: 2px solid transparent; transition: 0.3s;">
                                <input type="checkbox" name="booking-images" value="${img.image_url}" style="position: absolute; top: 5px; right: 5px; z-index: 10; width: 16px; height: 16px;">
                                <img src="${img.image_url}" alt="${img.caption}" style="width: 100%; height: 80px; object-fit: cover; display: block;">
                            </label>
                        `).join('');
                        
                        // Add some quick CSS for checked state
                        bookingSelector.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                            cb.addEventListener('change', (e) => {
                                e.target.parentElement.style.borderColor = e.target.checked ? 'var(--secondary)' : 'transparent';
                            });
                        });
                    }
                }
            })
            .catch(err => {
                console.error('Error loading gallery:', err);
                if (gallery) gallery.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #dc3545;">Failed to load gallery.</p>';
            });
    };

    // 5. Booking Form
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = bookingForm.querySelector('button');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            const selectedImages = Array.from(document.querySelectorAll('input[name="booking-images"]:checked')).map(cb => cb.value);
            let finalMessage = document.getElementById('message').value;
            if (selectedImages.length > 0) {
                finalMessage += '|||IMAGES|||' + JSON.stringify(selectedImages);
            }

            const formData = {
                id: 'BK-' + Date.now(),
                name: document.getElementById('full-name').value,
                phone: document.getElementById('phone').value,
                date: document.getElementById('event-date').value,
                style: document.getElementById('service-type').value,
                message: finalMessage,
                status: 'Pending',
                timestamp: new Date().toLocaleString()
            };

            fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            .then(() => {
                bookingForm.innerHTML = `<div class="serif" style="font-size: 2rem; text-align: center; color: #C5A059; padding: 40px 0;">Inquiry Sent. <br><small style="font-size: 1rem; color: #888;">We will contact you soon.</small></div>`;
            })
            .catch(err => {
                console.error('Booking error:', err);
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                alert('Failed to send inquiry. Please try again.');
            });
        });
    }

    // 6. Intersection Observer for Reveal Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));

    // 7. Dynamic Site Settings
    const loadSiteSettings = () => {
        fetch(`/api/settings?t=${Date.now()}`)
            .then(res => res.json())
            .then(data => {
                // Update Logo
                const logo = document.getElementById('site-logo');
                const footerLogo = document.getElementById('footer-logo');
                if (logo) logo.innerHTML = `${data.brand_name || 'CHAMUNDA'}<span>.</span>`;
                if (footerLogo) footerLogo.innerHTML = data.brand_name || 'CHAMUNDA';

                // Update Hero (index.html only)
                const heroTitle = document.getElementById('hero-title');
                const heroSub = document.getElementById('hero-sub');
                if (heroTitle) heroTitle.innerText = data.hero_title || 'Exceptional Wedding Artistry';
                if (heroSub) heroSub.innerText = data.hero_subtitle || 'Established 1995';

                // Update Brand Text
                document.querySelectorAll('.brand-text').forEach(el => el.innerText = data.brand_name || 'Chamunda Mandap Services');

                // Update Footer Contact info if exists
                document.querySelectorAll('.footer-phone').forEach(el => el.innerText = data.contact_phone);
                document.querySelectorAll('.footer-address').forEach(el => el.innerText = data.office_address);
                
                // Update WhatsApp link
                const waBtn = document.querySelector('.whatsapp-btn');
                if (waBtn && data.contact_phone) {
                    const cleanPhone = data.contact_phone.replace(/\D/g, '');
                    waBtn.href = `https://wa.me/${cleanPhone}?text=Hi, I'm interested in booking your services!`;
                }
            });
    };

    // Initialize
    loadServices();
    loadGallery();
    loadSiteSettings();

    // 10. Background Music Logic
    const music = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-toggle');

    if (music && musicBtn) {
        music.volume = 1.0; // Ensure volume is at max

        // Function to start music
        const startMusic = () => {
            music.play().then(() => {
                musicBtn.classList.add('playing');
                // Remove listeners once music starts
                document.removeEventListener('click', startMusic);
                document.removeEventListener('touchstart', startMusic);
                document.removeEventListener('scroll', startMusic);
            }).catch(e => {
                console.log("Autoplay blocked, waiting for interaction...");
            });
        };

        // Add listeners for various interactions
        document.addEventListener('click', startMusic);
        document.addEventListener('touchstart', startMusic);
        document.addEventListener('scroll', startMusic);

        musicBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent the global click listener from firing
            if (music.paused) {
                music.play();
                musicBtn.classList.add('playing');
            } else {
                music.pause();
                musicBtn.classList.remove('playing');
            }
        });
    }

    // Disable past dates
    const dateInput = document.getElementById('event-date');
    if (dateInput) {
        dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
    }
});

