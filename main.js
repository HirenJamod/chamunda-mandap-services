// Chamunda Mandap Services - Luxury Modern Logic

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    const bookingForm = document.getElementById('booking-form');

    // 1. Custom Cursor Logic
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

    // 2. Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Dynamic Services Fetching
    const loadServices = () => {
        fetch('/api/services')
            .then(res => res.json())
            .then(services => {
                const servicesGrid = document.getElementById('dynamic-services');
                if (services.length === 0) {
                    servicesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #888;">Services loading...</p>';
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
            });
    };

    // 4. Dynamic Gallery Fetching
    const loadGallery = () => {
        fetch('/api/gallery')
            .then(res => res.json())
            .then(images => {
                const gallery = document.getElementById('dynamic-gallery');
                gallery.innerHTML = images.map(img => `
                    <div class="gallery-item">
                        <img src="${img.image_url}" alt="${img.caption}">
                        <div class="gallery-overlay">
                            <span>${img.caption}</span>
                        </div>
                    </div>
                `).join('');
            });
    };

    // 5. Booking Form
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = bookingForm.querySelector('button');
            submitBtn.innerText = 'Sending...';

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
                bookingForm.innerHTML = `<div class="serif" style="font-size: 2rem; text-align: center; color: #C5A059;">Inquiry Sent. We will contact you soon.</div>`;
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

    // Initialize
    loadServices();
    loadGallery();

    // Disable past dates
    const dateInput = document.getElementById('event-date');
    if (dateInput) {
        dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
    }
});
