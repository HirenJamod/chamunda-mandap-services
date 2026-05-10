// Chamunda Mandap Services - Luxury Modern Logic

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    const bookingForm = document.getElementById('booking-form');

    // 1. Custom Cursor Logic with Safety Checks
    if (cursor && follower) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            follower.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        });

        document.querySelectorAll('a, button, .service-card').forEach(link => {
            link.addEventListener('mouseenter', () => {
                follower.style.width = '60px';
                follower.style.height = '60px';
                follower.style.background = 'rgba(197, 160, 89, 0.1)';
            });
            link.addEventListener('mouseleave', () => {
                follower.style.width = '30px';
                follower.style.height = '30px';
                follower.style.background = 'transparent';
            });
        });
    }

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
        if (!gallery) return;

        fetch(`/api/gallery?t=${Date.now()}`)
            .then(res => res.json())
            .then(images => {
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
            })
            .catch(err => {
                console.error('Error loading gallery:', err);
                gallery.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #dc3545;">Failed to load gallery.</p>';
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

            const formData = {
                id: 'BK-' + Date.now(),
                name: document.getElementById('full-name').value,
                phone: document.getElementById('phone').value,
                date: document.getElementById('event-date').value,
                style: document.getElementById('service-type').value,
                message: document.getElementById('message').value,
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

    // Disable past dates
    const dateInput = document.getElementById('event-date');
    if (dateInput) {
        dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
    }
});

