/* ========================================
   Navigation Scroll Effects
   ======================================== */

const nav = document.querySelector('nav');
const heroSection = document.querySelector('.hero, .page-header');

function updateNav() {
    if (!nav) return;
    
    const scrollY = window.scrollY;
    const isHomePage = document.querySelector('.hero');
    const isLightSection = isElementInView('.section-light');
    
    if (scrollY > 100) {
        nav.classList.remove('transparent');
        if (isLightSection && scrollY > window.innerHeight * 0.5) {
            nav.classList.add('light');
            nav.classList.remove('solid');
        } else {
            nav.classList.add('solid');
            nav.classList.remove('light');
        }
    } else {
        nav.classList.add('transparent');
        nav.classList.remove('solid', 'light');
    }
}

function isElementInView(selector) {
    const element = document.querySelector(selector);
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return rect.top < 100 && rect.bottom > 100;
}

window.addEventListener('scroll', updateNav);
window.addEventListener('load', updateNav);

/* ========================================
   Scroll Animations (Fade In)
   ======================================== */

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    fadeObserver.observe(el);
});

/* ========================================
   Smooth Scroll for Anchor Links
   ======================================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const navHeight = nav ? nav.offsetHeight : 0;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/* ========================================
   Active Navigation Link
   ======================================== */

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

window.addEventListener('load', setActiveNavLink);

/* ========================================
   Mobile Menu Toggle
   ======================================== */

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

/* ========================================
   Parallax Effect for Hero Background
   ======================================== */

const heroBackground = document.querySelector('.hero-background img, .page-header-background img');

if (heroBackground) {
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
            heroBackground.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
    });
}

/* ========================================
   Image Lazy Loading
   ======================================== */

const lazyImages = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
        }
    });
}, {
    rootMargin: '50px 0px'
});

lazyImages.forEach(img => {
    imageObserver.observe(img);
});

/* ========================================
   Timeline Animation Enhancement
   ======================================== */

const timelineItems = document.querySelectorAll('.timeline-item');

const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);
        }
    });
}, {
    threshold: 0.2
});

timelineItems.forEach(item => {
    item.classList.add('fade-in');
    timelineObserver.observe(item);
});

/* ========================================
   Stats Counter Animation
   ======================================== */

function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString() + (element.dataset.suffix || '');
        }
    }
    
    updateCounter();
}

const statNumbers = document.querySelectorAll('.stat-number');

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            entry.target.dataset.animated = 'true';
            const text = entry.target.textContent;
            const number = parseInt(text.replace(/[^0-9]/g, ''));
            const suffix = text.replace(/[0-9,]/g, '');
            
            if (!isNaN(number)) {
                entry.target.dataset.suffix = suffix;
                animateCounter(entry.target, number);
            }
        }
    });
}, {
    threshold: 0.5
});

statNumbers.forEach(stat => {
    statsObserver.observe(stat);
});
