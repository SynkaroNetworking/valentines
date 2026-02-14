// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initHearts();
    initIntersectionObserver();
    initImageUpload();
    initCountdown();
    initMusicToggle();
    initScrollIndicator();
});

// ========================================
// FLOATING HEARTS ANIMATION (CANVAS)
// ========================================

function initHearts() {
    const canvas = document.getElementById('heartsCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Heart particles array
    const hearts = [];
    const heartCount = 15; // Number of floating hearts
    
    // Heart class
    class Heart {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 100;
            this.size = Math.random() * 20 + 15;
            this.speed = Math.random() * 1.5 + 0.5;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.drift = Math.random() * 2 - 1; // Horizontal drift
        }
        
        update() {
            this.y -= this.speed;
            this.x += this.drift;
            
            // Reset when heart goes off screen
            if (this.y < -50) {
                this.reset();
            }
            
            // Keep hearts within horizontal bounds
            if (this.x < -50 || this.x > canvas.width + 50) {
                this.x = Math.random() * canvas.width;
            }
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = '#b76e79';
            
            // Draw heart shape
            ctx.beginPath();
            const x = this.x;
            const y = this.y;
            const size = this.size;
            
            // Heart path
            ctx.moveTo(x, y + size / 4);
            ctx.bezierCurveTo(x, y, x - size / 2, y - size / 2, x - size / 2, y + size / 6);
            ctx.bezierCurveTo(x - size / 2, y + size / 3, x, y + size / 2, x, y + size);
            ctx.bezierCurveTo(x, y + size / 2, x + size / 2, y + size / 3, x + size / 2, y + size / 6);
            ctx.bezierCurveTo(x + size / 2, y - size / 2, x, y, x, y + size / 4);
            
            ctx.fill();
            ctx.restore();
        }
    }
    
    // Initialize hearts
    for (let i = 0; i < heartCount; i++) {
        hearts.push(new Heart());
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        hearts.forEach(heart => {
            heart.update();
            heart.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ========================================
// INTERSECTION OBSERVER FOR FADE-IN
// ========================================

function initIntersectionObserver() {
    const fadeElements = document.querySelectorAll('.fade-in-element');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// ========================================
// IMAGE UPLOAD & PREVIEW
// ========================================

function initImageUpload() {
    const uploadInput = document.getElementById('imageUpload');
    const photoGrid = document.getElementById('photoGrid');
    const clearButton = document.getElementById('clearGallery');
    
    let uploadedImages = [];
    
    // Handle file selection
    uploadInput.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        
        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    uploadedImages.push(event.target.result);
                    updateGallery();
                };
                
                reader.readAsDataURL(file);
            }
        });
        
        // Reset input
        uploadInput.value = '';
    });
    
    // Update gallery display
    function updateGallery() {
        // Clear current grid
        photoGrid.innerHTML = '';
        
        // Add uploaded images
        uploadedImages.forEach((imgSrc, index) => {
            const photoCard = document.createElement('div');
            photoCard.className = 'photo-card';
            
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = `Uploaded memory ${index + 1}`;
            img.loading = 'lazy';
            
            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '×';
            deleteBtn.setAttribute('aria-label', 'Delete photo');
            deleteBtn.addEventListener('click', function() {
                uploadedImages.splice(index, 1);
                updateGallery();
            });
            
            photoCard.appendChild(img);
            photoCard.appendChild(deleteBtn);
            photoGrid.appendChild(photoCard);
        });
        
        // Add placeholders for remaining slots
        const totalSlots = 6;
        const remainingSlots = totalSlots - uploadedImages.length;
        
        for (let i = 0; i < remainingSlots; i++) {
            const placeholder = document.createElement('div');
            placeholder.className = 'photo-card placeholder';
            
            const icons = ['📷', '💝', '🌹', '💕', '✨', '💖'];
            const icon = document.createElement('div');
            icon.className = 'placeholder-icon';
            icon.textContent = icons[i % icons.length];
            
            const text = document.createElement('p');
            text.textContent = 'Upload Photo';
            
            placeholder.appendChild(icon);
            placeholder.appendChild(text);
            photoGrid.appendChild(placeholder);
        }
    }
    
    // Clear all photos
    clearButton.addEventListener('click', function() {
        if (uploadedImages.length === 0) return;
        
        if (confirm('Are you sure you want to clear all photos?')) {
            uploadedImages = [];
            updateGallery();
        }
    });
}

// ========================================
// VALENTINE'S DAY COUNTDOWN TIMER
// ========================================

function initCountdown() {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    function updateCountdown() {
        const now = new Date();
        const currentYear = now.getFullYear();
        
        // Set Valentine's Day target
        let valentinesDay = new Date(currentYear, 1, 14); // February 14
        
        // If Valentine's Day has passed this year, target next year
        if (now > valentinesDay) {
            valentinesDay = new Date(currentYear + 1, 1, 14);
        }
        
        // Calculate time difference
        const diff = valentinesDay - now;
        
        // If we're on Valentine's Day or it has passed
        if (diff <= 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }
        
        // Calculate time units
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        // Update display with leading zeros
        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }
    
    // Update immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ========================================
// MUSIC TOGGLE
// ========================================

function initMusicToggle() {
    const musicToggle = document.getElementById('musicToggle');
    let isPlaying = false;
    
    musicToggle.addEventListener('click', function() {
        isPlaying = !isPlaying;
        
        if (isPlaying) {
            musicToggle.classList.add('active');
            // In a real implementation, you would start playing audio here
            // Example: backgroundMusic.play();
            console.log('Music would start playing');
        } else {
            musicToggle.classList.remove('active');
            // Example: backgroundMusic.pause();
            console.log('Music would pause');
        }
    });
}

// ========================================
// SCROLL INDICATOR
// ========================================

function initScrollIndicator() {
    const scrollIndicator = document.getElementById('scrollIndicator');
    const scrollContainer = document.querySelector('.scroll-container');
    
    // Hide indicator after user scrolls
    scrollContainer.addEventListener('scroll', function() {
        if (scrollContainer.scrollTop > 100) {
            scrollIndicator.classList.add('hidden');
        } else {
            scrollIndicator.classList.remove('hidden');
        }
    });
    
    // Click indicator to scroll to next section
    scrollIndicator.addEventListener('click', function() {
        const sections = document.querySelectorAll('.snap-section');
        if (sections.length > 1) {
            sections[1].scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Smooth scroll to section (can be used for navigation)
function scrollToSection(sectionIndex) {
    const sections = document.querySelectorAll('.snap-section');
    if (sections[sectionIndex]) {
        sections[sectionIndex].scrollIntoView({ behavior: 'smooth' });
    }
}

// Add sparkle effect on click (optional enhancement)
document.addEventListener('click', function(e) {
    // Only add sparkle on photo cards
    if (e.target.closest('.photo-card')) {
        createSparkle(e.pageX, e.pageY);
    }
});

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.style.position = 'fixed';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.width = '10px';
    sparkle.style.height = '10px';
    sparkle.style.background = '#d4a373';
    sparkle.style.borderRadius = '50%';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '9999';
    sparkle.style.animation = 'sparkleFloat 1s ease-out forwards';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 1000);
}

// Add sparkle animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkleFloat {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(${Math.random() * 100 - 50}px, -100px) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================

// Lazy load images when they come into view
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================================
// CONSOLE MESSAGE
// ========================================

console.log('%c💖 Valentine\'s Day Digital Scrapbook 💖', 'color: #b76e79; font-size: 20px; font-weight: bold;');
console.log('%cMade with love for someone special', 'color: #6b4e71; font-size: 14px;');