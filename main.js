const nav = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const header = document.querySelector('.header');
const contactForm = document.getElementById('contact-form');


document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeForm();
    initializeSkillBars();
    initializeThemeToggle();
});


function initializeNavigation() {
    navToggle?.addEventListener('click', toggleMobileMenu);
    
    nav?.addEventListener('click', function(e) {
        if (e.target.classList.contains('nav__link')) {
            closeMobileMenu();
        }
    });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    window.addEventListener('scroll', updateActiveNavLink);
}


function toggleMobileMenu() {
    nav?.classList.toggle('active');
    navToggle?.classList.toggle('active');
}

function closeMobileMenu() {
    nav?.classList.remove('active');
    navToggle?.classList.remove('active');
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const scrollPosition = window.scrollY + header.offsetHeight + 100;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}


function initializeScrollEffects() {
    window.addEventListener('scroll', function() {
        handleHeaderScroll();
        handleScrollAnimations();
    });
}


function handleHeaderScroll() {
    if (window.scrollY > 50) {
        header?.classList.add('scrolled');
    } else {
        header?.classList.remove('scrolled');
    }
}

function handleScrollAnimations() {
    const animateElements = document.querySelectorAll('.service__card, .portfolio__item, .testimonial__card');
    
    animateElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

function initializeAnimations() {
    const animateElements = document.querySelectorAll('.service__card, .portfolio__item, .testimonial__card');
    
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    setTimeout(() => {
        const heroContent = document.querySelector('.hero__content');
        const heroImage = document.querySelector('.hero__image');
        
        if (heroContent) {
            heroContent.classList.add('animate-fadeInLeft');
        }
        
        if (heroImage) {
            heroImage.classList.add('animate-fadeInRight');
        }
    }, 300);
}

function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill__percentage');
    const animatedBars = new Set();

    function animateSkills() {
        skillBars.forEach(bar => {
            if (animatedBars.has(bar)) return;
            const barTop = bar.getBoundingClientRect().top;
            if (barTop < window.innerHeight - 100) {
                const width = bar.style.width;
                bar.style.width = '0%';
                void bar.offsetWidth;
                bar.style.width = width;
                animatedBars.add(bar);
            }
        });
    }

    window.addEventListener('scroll', animateSkills);
    animateSkills(); 
}

function initializeForm() {
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', handleFormSubmit);
    
    const inputs = contactForm.querySelectorAll('.form__input');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    if (!validateForm(data)) {
        return;
    }
    
    simulateFormSubmission(data);
}

function validateForm(data) {
    let isValid = true;
    
    if (!data.name || data.name.trim().length < 2) {
        showFieldError('name', 'Il nome deve contenere almeno 2 caratteri');
        isValid = false;
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        showFieldError('email', 'Inserisci un indirizzo email valido');
        isValid = false;
    }
    
    if (!data.service) {
        showFieldError('service', 'Seleziona un servizio');
        isValid = false;
    }
    
    if (!data.message || data.message.trim().length < 10) {
        showFieldError('message', 'Il messaggio deve contenere almeno 10 caratteri');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const name = field.name;
    
    switch (name) {
        case 'name':
            if (value.length < 2) {
                showFieldError(name, 'Il nome deve contenere almeno 2 caratteri');
                return false;
            }
            break;
            
        case 'email':
            if (!isValidEmail(value)) {
                showFieldError(name, 'Inserisci un indirizzo email valido');
                return false;
            }
            break;
            
        case 'service':
            if (!value) {
                showFieldError(name, 'Seleziona un servizio');
                return false;
            }
            break;
            
        case 'message':
            if (value.length < 10) {
                showFieldError(name, 'Il messaggio deve contenere almeno 10 caratteri');
                return false;
            }
            break;
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const errorSpan = document.getElementById(`${fieldName}-error`);
    const formGroup = field?.closest('.form__group');
    
    if (formGroup) {
        formGroup.classList.add('error');
    }
    
    if (errorSpan) {
        errorSpan.textContent = message;
    }
}

function clearFieldError(field) {
    const formGroup = field.closest('.form__group');
    const errorSpan = document.getElementById(`${field.name}-error`);
    
    if (formGroup) {
        formGroup.classList.remove('error');
    }
    
    if (errorSpan) {
        errorSpan.textContent = '';
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function simulateFormSubmission(data) {
    const submitButton = contactForm.querySelector('button[type="submit"]');
    
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    
    setTimeout(() => {
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
        
        showSuccessMessage();
        
        contactForm.reset();
        
        console.log('Form inviato con successo:', data);
    }, 2000);
}

function showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'success-message';
    message.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 1rem 2rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        ">
            <strong>Messaggio inviato con successo!</strong><br>
            Ti risponderò al più presto.
        </div>
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 5000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

window.addEventListener('scroll', throttle(handleScrollAnimations, 100));
window.addEventListener('resize', debounce(function() {
    updateActiveNavLink();
}, 250));


if ('performance' in window && 'PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'measure') {
                console.log(`Performance: ${entry.name} took ${entry.duration}ms`);
            }
        }
    });
    
    observer.observe({ entryTypes: ['measure'] });
}

window.addEventListener('load', function() {
    setTimeout(() => {
        const preloader = document.querySelector('.preloader');
        const loader = document.querySelector('.loader');
        const loaderText = document.querySelector('.loader-text');
        const siteContent = document.querySelector('.site-content');
        
        loader.style.display = 'none';
        loaderText.style.display = 'none';
        
        const logoReveal = document.createElement('img');
        logoReveal.src = 'Logo fatto da dexh-cerchio.png';
        logoReveal.classList.add('logo-reveal');
        preloader.appendChild(logoReveal);
        
        setTimeout(() => {
            logoReveal.classList.add('active');
            
            setTimeout(() => {
                logoReveal.classList.add('zoom-out');
                
                siteContent.style.opacity = '1';
                siteContent.style.transform = 'translateY(0)';
                
                setTimeout(() => {
                    preloader.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    
                    const elements = document.querySelectorAll('.hero__title, .hero__subtitle, .hero__buttons, .hero__code');
                    elements.forEach((el, index) => {
                        el.classList.add('stagger-animation');
                        el.style.animationDelay = `${index * 0.2}s`;
                    });
                }, 800);
            }, 1500);
        }, 100);
    }, 2000);
});

function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDarkScheme.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    themeToggle?.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}