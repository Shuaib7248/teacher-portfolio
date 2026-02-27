/* =============================================
   TEACHER PORTFOLIO — JAVASCRIPT
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ===== PRELOADER =====
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 2000);
    });
    // Fallback: hide preloader after 3s regardless
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 3000);

    // ===== NAVBAR SCROLL =====
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');

    function handleNavScroll() {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Active link on scroll
    function updateActiveLink() {
        const scrollPos = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    function handleParallax() {
        const scrolled = window.scrollY;

        // Background Parallax
        const heroBg = document.querySelector('.hero-bg-pattern');
        if (heroBg) {
            heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
        }

        // Floating Elements Parallax
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0.2;
            const yPos = -(scrolled * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });

        // Video Parallax (Optional, keep it slow)
        const videoBg = document.querySelector('.hero-video');
        if (videoBg) {
            videoBg.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    }

    window.addEventListener('scroll', () => {
        handleNavScroll();
        updateActiveLink();
        handleBackToTop();
        handleParallax();
    });

    // ===== MOBILE MENU =====
    const hamburger = document.getElementById('hamburger');
    const navLinksContainer = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinksContainer.classList.toggle('open');
        document.body.classList.toggle('menu-open');
    });

    // Close menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinksContainer.classList.remove('open');
            document.body.classList.remove('menu-open');
        });
    });

    // ===== ANIMATED COUNTERS =====
    function animateCounter(el) {
        const target = parseFloat(el.getAttribute('data-target'));
        const isDecimal = target % 1 !== 0;
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = target * easeOut;

            if (isDecimal) {
                el.textContent = current.toFixed(1);
            } else {
                el.textContent = Math.floor(current).toLocaleString();
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                if (isDecimal) {
                    el.textContent = target.toFixed(1);
                } else {
                    el.textContent = target.toLocaleString();
                }
            }
        }

        requestAnimationFrame(update);
    }

    // ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
    const animateElements = document.querySelectorAll('[data-animate]');
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');

                // Check if it's the hero stats
                if (entry.target.closest('.hero-stats') && !countersAnimated) {
                    countersAnimated = true;
                    statNumbers.forEach(num => animateCounter(num));
                }
            }
        });
    }, observerOptions);

    animateElements.forEach(el => observer.observe(el));

    // Also observe hero stats
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated) {
                    countersAnimated = true;
                    statNumbers.forEach(num => animateCounter(num));
                }
            });
        }, { threshold: 0.3 });
        statsObserver.observe(heroStats);
    }

    // ===== TESTIMONIAL SLIDER =====
    const track = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('sliderDots');
    const cards = track.querySelectorAll('.testimonial-card');
    let currentSlide = 0;
    let autoPlayInterval;

    // Create dots
    cards.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot');

    function goToSlide(index) {
        currentSlide = index;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach(d => d.classList.remove('active'));
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % cards.length;
        goToSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + cards.length) % cards.length;
        goToSlide(currentSlide);
    }

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
    });

    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    startAutoPlay();

    // Touch / Swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
            resetAutoPlay();
        }
    }, { passive: true });

    // ===== FAQ ACCORDION =====
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach(fi => {
                fi.classList.remove('active');
                fi.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Open clicked (if wasn't already open)
            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ===== BACK TO TOP =====
    const backToTop = document.getElementById('backToTop');

    function handleBackToTop() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== HERO PARTICLES =====
    const particlesContainer = document.getElementById('heroParticles');

    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        const size = Math.random() * 4 + 2;
        const left = Math.random() * 100;
        const duration = Math.random() * 12 + 8;
        const delay = Math.random() * 5;
        const colors = ['var(--emerald)', 'var(--gold)', 'var(--emerald-light)'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.background = color;
        particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;

        particlesContainer.appendChild(particle);

        // Clean up
        setTimeout(() => {
            particle.remove();
        }, (duration + delay) * 1000);
    }

    // Create initial particles
    for (let i = 0; i < 20; i++) {
        createParticle();
    }

    // Keep creating particles
    setInterval(() => {
        if (document.querySelectorAll('.particle').length < 25) {
            createParticle();
        }
    }, 1500);

    // ===== CONTACT FORM =====
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = contactForm.querySelector('button[type="submit"]');
        const originalHTML = btn.innerHTML;

        btn.innerHTML = '<i class="fas fa-check-circle"></i> Message Sent! ✨';
        btn.style.background = 'var(--emerald)';

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            contactForm.reset();
        }, 3000);
    });

    // ===== CUSTOM CURSOR =====
    const cursorDot = document.getElementById('cursorDot');
    const cursorOutline = document.getElementById('cursorOutline');

    // Only run if device has a fine pointer (mouse)
    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: 'forwards' });
        });

        // Add hover effect to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, .course-card, .feature-card, .testimonial-card');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.classList.remove('hover');
            });
        });
    }

    // ===== 3D TILT CARDS =====
    const tiltCards = document.querySelectorAll('.course-card, .feature-card, .pricing-card');

    if (window.matchMedia("(pointer: fine)").matches) {
        tiltCards.forEach(card => {
            card.classList.add('tilt-card');

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg
                const rotateY = ((x - centerX) / centerX) * 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            });
        });
    }

    // ===== THEME TOGGLE (DAY/NIGHT) =====
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Check for saved theme
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');

        // Save preference
        if (body.classList.contains('light-mode')) {
            localStorage.setItem('portfolio-theme', 'light');
        } else {
            localStorage.setItem('portfolio-theme', 'dark');
        }

        // Optional: Trigger a small animation or sound effect here if desired
    });

    // ===== SMOOTH SCROLL FOR ALL ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetEl.offsetTop - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== COURSE FILTER TABS =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    const courseCards = document.querySelectorAll('.course-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            courseCards.forEach(card => {
                card.classList.remove('fade-in');
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    void card.offsetWidth;
                    card.classList.add('fade-in');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ===== BOOK FREE TRIAL MODAL =====
    const trialModal = document.getElementById('trialModal');
    const modalClose = document.getElementById('modalClose');
    const modalWaBtn = document.getElementById('modalWaBtn');
    const modalCourseBtns = document.querySelectorAll('.modal-course-btn');
    let selectedCourse = 'Quran Reading (Nazra)';
    const waBase = 'https://wa.me/1234567890?text=';

    function updateWaLink() {
        const msg = encodeURIComponent(`Assalamu Alaikum! I'd like to book a FREE TRIAL class for: ${selectedCourse}. Please let me know the available slots. JazakAllah Khair!`);
        modalWaBtn.href = waBase + msg;
    }
    updateWaLink();

    function openModal() {
        trialModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        trialModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    // Open modal from "Book Free Trial" buttons
    document.querySelectorAll('[data-open-trial]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    // Course selection inside modal
    modalCourseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modalCourseBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedCourse = btn.getAttribute('data-course');
            updateWaLink();
        });
    });

    // Close modal on X, backdrop click, or Escape
    modalClose.addEventListener('click', closeModal);
    trialModal.addEventListener('click', (e) => {
        if (e.target === trialModal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // ===== VIDEO INTRO PLAY BUTTON =====
    const videoPlayBtn = document.getElementById('videoPlayBtn');
    const videoIframeWrap = document.getElementById('videoIframeWrap');
    const youtubeIframe = document.getElementById('youtubeIframe');

    if (videoPlayBtn) {
        videoPlayBtn.addEventListener('click', () => {
            youtubeIframe.src = youtubeIframe.getAttribute('data-src');
            videoIframeWrap.style.display = 'block';
            videoPlayBtn.style.display = 'none';
            document.querySelector('.video-thumbnail').style.display = 'none';
        });
    }
    // ===== SCROLL PROGRESS BAR =====
    const scrollProgressBar = document.getElementById('scrollProgressBar');
    if (scrollProgressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgressBar.style.width = scrollPercent + '%';
        });
    }

});

