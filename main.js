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
                    function renderServices(services) {
                        const grid = document.getElementById('dynamic-services');
                        if (!grid) return;

                        grid.innerHTML = services.map(service => `
                            <div class="service-card-elysian" data-reveal>
                                <img src="${service.image_url}" alt="${service.title}">
                                <h3>${service.title}</h3>
                                <p>${service.description}</p>
                                <button class="btn-elysian-gold" onclick="window.location.href='portfolio.html'">VIEW GALLERY</button>
                            </div>
                        `).join('');
                    }
                    renderServices(services);
                }
            })
            .catch(err => {
                console.error('Error loading services:', err);
                servicesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #dc3545;">Failed to load services.</p>';
            });
    };

    // 4. Dynamic Gallery Fetching with Cache Busting
    let allGalleryImages = [];

    const renderBookingImages = (filteredImages) => {
        const bookingSelector = document.getElementById('booking-gallery-selector');
        if (!bookingSelector) return;
        
        if (filteredImages.length === 0) {
            bookingSelector.innerHTML = '<p style="color: #888; font-size: 0.8rem; grid-column: 1/-1; text-align: center; padding: 20px;">Showing all gallery images. Select a specific style to filter.</p>';
            // Fallback: show all if no specific filter matches
            renderBookingImages(allGalleryImages.slice(0, 8)); // Show a subset
        } else {
            bookingSelector.innerHTML = filteredImages.map(img => `
                <label style="cursor: pointer; position: relative; border-radius: 12px; overflow: hidden; border: 2px solid transparent; transition: 0.3s; display: block; aspect-ratio: 1/1;">
                    <input type="checkbox" name="booking-images" value="${img.image_url}" style="position: absolute; top: 8px; right: 8px; z-index: 10; width: 18px; height: 18px; accent-color: var(--secondary);">
                    <img src="${img.image_url}" alt="${img.caption}" title="${img.caption}" style="width: 100%; height: 100%; object-fit: cover; display: block;">
                </label>
            `).join('');
            
            bookingSelector.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                cb.addEventListener('change', (e) => {
                    e.target.parentElement.style.borderColor = e.target.checked ? 'var(--secondary)' : 'transparent';
                    e.target.parentElement.style.boxShadow = e.target.checked ? '0 0 15px rgba(197, 160, 89, 0.3)' : 'none';
                });
            });
        }
    };

    const loadGallery = () => {
        const gallery = document.getElementById('dynamic-gallery');
        const bookingSelector = document.getElementById('booking-gallery-selector');

        fetch(`/api/gallery?t=${Date.now()}`)
            .then(res => res.json())
            .then(images => {
                allGalleryImages = images;

                if (gallery) {
                    if (!images || images.length === 0) {
                        gallery.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #888;">Gallery is empty.</p>';
                    } else {
                        gallery.innerHTML = images.map((img, index) => `
                            <div class="gallery-item-luxury ${index % 3 === 1 ? 'highlight' : ''}">
                                <img src="${img.image_url}" alt="${img.caption}">
                            </div>
                        `).join('');
                    }
                }

                if (bookingSelector) {
                    renderBookingImages(allGalleryImages);
                }
            })
            .catch(err => {
                console.error('Error loading gallery:', err);
                if (gallery) gallery.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #dc3545;">Failed to load gallery.</p>';
            });
    };

    // Style filtering listener
    const serviceDropdown = document.getElementById('service-type');
    if (serviceDropdown) {
        serviceDropdown.addEventListener('change', (e) => {
            const style = e.target.value.toLowerCase();
            const filtered = allGalleryImages.filter(img => 
                (img.caption && img.caption.toLowerCase().includes(style)) || style === ""
            );
            renderBookingImages(filtered.length > 0 ? filtered : allGalleryImages);
        });
    }

    // 5. Booking Form (Premium)
    const bookingFormPremium = document.getElementById('booking-form-premium');
    if (bookingFormPremium) {
        bookingFormPremium.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = bookingFormPremium.querySelector('button');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'PROCESSING...';
            submitBtn.disabled = true;

            const selectedImages = Array.from(document.querySelectorAll('input[name="booking-images"]:checked')).map(cb => cb.value);
            const servicesRequired = Array.from(document.querySelectorAll('.service-check:checked')).map(cb => cb.value);

            const formData = {
                id: 'BK-' + Date.now(),
                couple_names: document.getElementById('couple-names').value,
                event_date: document.getElementById('booking-date').value,
                guest_count: document.getElementById('guest-count').value,
                venue: document.getElementById('wedding-venue').value,
                ceremony_details: document.getElementById('ceremony-details').value,
                services_required: servicesRequired,
                message: document.getElementById('special-requests').value,
                selected_images: selectedImages,
                status: 'Planning',
                timestamp: new Date().toISOString()
            };

            fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            .then(res => res.json())
            .then(data => {
                alert('Thank you! Your wedding inquiry has been sent to our artistry team.');
                bookingFormPremium.reset();
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            })
            .catch(err => {
                console.error('Booking error:', err);
                alert('Failed to send inquiry. Please try again.');
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
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

// 11. Global Helper for Service Selection
window.selectServiceAndBook = (serviceTitle) => {
    const bookingSection = document.getElementById('booking');
    const serviceDropdown = document.getElementById('service-type');
    
    if (bookingSection && serviceDropdown) {
        // Find or add the option to the dropdown if it doesn't exist
        let optionExists = false;
        for (let i = 0; i < serviceDropdown.options.length; i++) {
            if (serviceDropdown.options[i].text === serviceTitle || serviceDropdown.options[i].value === serviceTitle) {
                serviceDropdown.selectedIndex = i;
                optionExists = true;
                break;
            }
        }
        
        if (!optionExists) {
            const newOpt = new Option(serviceTitle, serviceTitle);
            serviceDropdown.add(newOpt);
            serviceDropdown.value = serviceTitle;
        }

        // Scroll to booking
        bookingSection.scrollIntoView({ behavior: 'smooth' });
        
        // Highlight the image selector to show related images
        const gallerySelector = document.getElementById('booking-gallery-selector');
        if (gallerySelector) {
            gallerySelector.style.boxShadow = '0 0 20px rgba(197, 160, 89, 0.5)';
            setTimeout(() => gallerySelector.style.boxShadow = 'none', 2000);
        }
    } else {
        // If not on index page, redirect
        window.location.href = `index.html?service=${encodeURIComponent(serviceTitle)}#booking`;
    }
};

// Check for URL parameter on load
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    // 12. Section Navigation Observer
    const sections = document.querySelectorAll('section, .hero');
    const dots = document.querySelectorAll('.dot');

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                dots.forEach(dot => {
                    dot.classList.remove('active');
                    if (dot.getAttribute('href') === `#${id}`) {
                        dot.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => scrollObserver.observe(section));

    // 13. INITIALIZE DATA LOADING
    loadServices();
    loadGallery();
});

