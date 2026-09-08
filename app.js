document.addEventListener('DOMContentLoaded', () => {

    // Navbar
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    });

    // Mobile nav
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a =>
        a.addEventListener('click', () => links.classList.remove('open'))
    );

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const el = document.querySelector(a.getAttribute('href'));
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Scroll reveal
    const items = document.querySelectorAll(
        '.svc, .eco, .folio, .val, .cp-step, .how-step, .story-left, .story-right, .cp-left, .cp-right, .contact-main, .contact-how'
    );
    items.forEach(el => el.classList.add('reveal'));

    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) e.target.classList.add('visible');
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

    items.forEach(el => obs.observe(el));

    // Custom Circular Scroll Progress
    const scrollCircle = document.getElementById('scrollCircle');
    const scrollText = document.getElementById('scrollText');
    
    if (scrollCircle && scrollText) {
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            let scrolled = (winScroll / height) * 100;
            
            // Prevent NaN or Infinity if content doesn't scroll
            if (!isFinite(scrolled) || height <= 0) scrolled = 0;
            
            scrollCircle.style.setProperty('--progress', scrolled + '%');
            scrollText.innerText = Math.round(scrolled) + '%';
        });
    }

    // Animated Logo Typing Effect
    const animatedLogo = document.getElementById('animatedLogo');
    if (animatedLogo) {
        const textTagline = "Custom PC Builds & Workspaces";
        const textBrandHTML = '<span class="logo-k">K</span><span class="logo-r">uzto</span>';
        let shouldAnimate = false;
        let animationRunning = false;


        // Cancellable sleep
        async function wait(ms) {
            const end = Date.now() + ms;
            while (Date.now() < end) {
                if (!shouldAnimate) return false;
                await new Promise(r => setTimeout(r, 40));
            }
            return shouldAnimate;
        }

        // Erase the styled brand logo by shrinking width (right to left)
        async function eraseBrand(steps, stepDelay) {
            const startWidth = animatedLogo.offsetWidth;
            animatedLogo.classList.add('typing-cursor');
            for (let i = 1; i <= steps; i++) {
                if (!shouldAnimate) return false;
                animatedLogo.style.width = Math.round(startWidth * (1 - i / steps)) + 'px';
                await new Promise(r => setTimeout(r, stepDelay));
            }
            animatedLogo.innerHTML = '';
            animatedLogo.style.width = '';
            animatedLogo.classList.remove('typing-cursor');
            return true;
        }

        // Reveal the styled brand logo by growing width (left to right)
        async function revealBrand(steps, stepDelay) {
            animatedLogo.classList.remove('logo-state-tagline');
            animatedLogo.classList.add('logo-state-brand');
            animatedLogo.innerHTML = textBrandHTML;

            // Measure the full rendered width
            animatedLogo.style.width = 'auto';
            const targetWidth = animatedLogo.offsetWidth;
            animatedLogo.style.width = '0px';

            animatedLogo.classList.add('typing-cursor');
            for (let i = 1; i <= steps; i++) {
                if (!shouldAnimate) return false;
                animatedLogo.style.width = Math.round(targetWidth * (i / steps)) + 'px';
                await new Promise(r => setTimeout(r, stepDelay));
            }
            animatedLogo.style.width = '';
            animatedLogo.classList.remove('typing-cursor');
            return true;
        }

        // Type tagline character by character
        async function typeChars(text, speed) {
            animatedLogo.classList.add('typing-cursor');
            for (let i = 0; i < text.length; i++) {
                if (!shouldAnimate) return false;
                animatedLogo.textContent = text.substring(0, i + 1);
                await new Promise(r => setTimeout(r, speed));
            }
            animatedLogo.classList.remove('typing-cursor');
            return true;
        }

        // Delete tagline character by character
        async function deleteChars(speed) {
            animatedLogo.classList.add('typing-cursor');
            let current = animatedLogo.textContent;
            while (current.length > 0) {
                if (!shouldAnimate) return false;
                current = current.slice(0, -1);
                animatedLogo.textContent = current;
                await new Promise(r => setTimeout(r, speed));
            }
            animatedLogo.classList.remove('typing-cursor');
            return true;
        }

        function setBrand() {
            animatedLogo.classList.remove('typing-cursor', 'logo-state-tagline');
            animatedLogo.classList.add('logo-state-brand');
            animatedLogo.innerHTML = textBrandHTML;
            animatedLogo.style.width = '';
        }

        async function runLogoLoop() {
            animationRunning = true;
            while (shouldAnimate) {
                // Pause on styled Kuzto
                if (!await wait(2000)) break;

                // Erase brand logo (width shrinks right-to-left, styled logo stays intact)
                if (!await eraseBrand(6, 70)) break;

                // Switch to tagline style and type character by character
                animatedLogo.classList.remove('logo-state-brand');
                animatedLogo.classList.add('logo-state-tagline');
                if (!await typeChars(textTagline, 40)) break;

                // Pause on tagline
                if (!await wait(3500)) break;

                // Delete tagline character by character
                if (!await deleteChars(30)) break;

                // Reveal brand logo (width grows left-to-right, styled logo appears)
                if (!await revealBrand(6, 70)) break;

                // Pause on brand (longer)
                if (!await wait(8000)) break;
            }
            setBrand();
            animationRunning = false;
        }

        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                if (!shouldAnimate) {
                    shouldAnimate = true;
                    if (!animationRunning) runLogoLoop();
                }
            } else {
                shouldAnimate = false;
            }
        });
    }

    // Hero Slideshow
    const slides = document.querySelectorAll('#heroSlideshow .hero-slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 4000); // Change image every 4 seconds
    }

    // Copy Email functionality
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const toast = document.getElementById('toast');
    
    if (copyEmailBtn && toast) {
        copyEmailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = copyEmailBtn.getAttribute('data-email');
            navigator.clipboard.writeText(email).then(() => {
                toast.classList.add('show');
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 3000); // Hide after 3 seconds
            }).catch(err => {
                console.error('Failed to copy email: ', err);
            });
        });
    }

    // Custom Contact Form Handling
    const contactForm = document.getElementById('kuzto-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.btn-form-submit');
            const messageDiv = document.getElementById('form-message');
            
            // UI Loading state
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Submitting...';
            submitBtn.disabled = true;
            messageDiv.style.display = 'none';
            messageDiv.className = 'form-message';
            
            // Gather data
            const formData = new FormData(contactForm);
            const dataObject = Object.fromEntries(formData.entries());
            
            // Combine country code and phone number for the backend
            if (dataObject['Country Code'] && dataObject['Contact Number']) {
                // Add a single quote to prevent Google Sheets from treating the '+' as a formula
                dataObject['Contact Number'] = "'" + dataObject['Country Code'] + ' ' + dataObject['Contact Number'];
                delete dataObject['Country Code'];
            }
            
            // Live Google Apps Script Web App URL
            const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxR8DwrKNZdeSL3CH12Kz9sXWQEENLKHYcP6bbtLASP6BplW3BC9kwRjRl4YyeaFb77/exec'; 
            
            fetch(WEB_APP_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                redirect: 'follow',
                body: JSON.stringify(dataObject)
            })
            .then(response => {
                if (response.ok) {
                    messageDiv.innerText = 'Thank you! Your enquiry has been received. We will contact you shortly.';
                    messageDiv.classList.add('success');
                    contactForm.reset();
                } else {
                    throw new Error('Network response was not ok.');
                }
            })
            .catch(error => {
                console.error('Error submitting form:', error);
                messageDiv.innerText = 'Oops! Something went wrong. Please try again later.';
                messageDiv.classList.add('error');
            })
            .finally(() => {
                messageDiv.style.display = 'block';
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }
});
