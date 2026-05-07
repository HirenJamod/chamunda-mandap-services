// Chamunda Mandap Services - Interactive Logic

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const bookingForm = document.getElementById('booking-form');
    const formSuccess = document.getElementById('form-success');
    const dateInput = document.getElementById('event-date');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    // Disable past dates
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // Mobile Menu Toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Form Handling
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic animation for button
            const submitBtn = bookingForm.querySelector('button');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Checking...';
            submitBtn.disabled = true;

            // API Call to save to database
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
            .then(response => response.json())
            .then(data => {
                bookingForm.style.display = 'none';
                formSuccess.style.display = 'block';
                formSuccess.style.animation = 'fadeInUp 0.5s ease forwards';
                console.log('Booking Saved to DB:', data);
            })
            .catch(error => {
                console.error('Error saving booking:', error);
                alert('There was an error saving your booking. Please try again.');
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Close mobile menu if open
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }

            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Apply reveal animation to service cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });
});
