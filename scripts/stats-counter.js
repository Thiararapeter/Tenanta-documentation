// Stats Counter Animation Script for Tenanta
// Handles animated counters for the hero stats section

document.addEventListener('DOMContentLoaded', function() {
    // Counter animation function
    function animateCounter(element, target, duration = 2000, suffix = '') {
        const start = 0;
        const increment = target / (duration / 16); // 60fps
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format the number based on the target value
            let displayValue;
            if (target >= 100) {
                displayValue = Math.floor(current);
            } else if (target >= 10) {
                displayValue = Math.floor(current);
            } else {
                displayValue = current.toFixed(1);
            }
            
            element.textContent = displayValue + suffix;
        }, 16);
    }
    
    // Intersection Observer for triggering animations when in view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');

                // Find all counter numbers in the stats section
                const counters = entry.target.querySelectorAll('.counter-number');

                counters.forEach(counter => {
                    const target = parseFloat(counter.dataset.target);
                    const suffix = counter.dataset.suffix || '';

                    // Special handling for different counter types
                    if (counter.classList.contains('uptime-counter')) {
                        // For uptime percentage (99.9%)
                        animateUptimeCounter(counter, 99.9, 2000, '%');
                    } else if (counter.classList.contains('plus-counter')) {
                        // For counters with + suffix
                        animateCounter(counter, target, 2000, '+');
                    } else {
                        // Default counter
                        animateCounter(counter, target, 2000, suffix);
                    }
                });
            }
        });
    }, observerOptions);
    
    // Special animation for uptime counter (99.9%)
    function animateUptimeCounter(element, target, duration = 2000, suffix = '') {
        const start = 90.0;
        const increment = (target - start) / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            element.textContent = current.toFixed(1) + suffix;
        }, 16);
    }
    
    // Initialize counters
    function initializeCounters() {
        const statsSection = document.querySelector('.hero-stats');
        if (statsSection) {
            observer.observe(statsSection);
        }
        
        // Alternative: observe individual counter containers
        const counterContainers = document.querySelectorAll('.stat-item');
        counterContainers.forEach(container => {
            observer.observe(container);
        });
    }
    
    // Manual trigger function for immediate animation
    function triggerCounterAnimations() {
        const counters = document.querySelectorAll('.counter-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const suffix = counter.dataset.suffix || '';
            
            if (counter.classList.contains('uptime-counter')) {
                animateUptimeCounter(counter, 99.9, 2000, '%');
            } else if (counter.classList.contains('plus-counter')) {
                animateCounter(counter, target, 2000, '+');
            } else {
                animateCounter(counter, target, 2000, suffix);
            }
        });
    }
    
    // Initialize the counter system
    initializeCounters();
    
    // Expose functions globally for manual triggering if needed
    window.triggerCounterAnimations = triggerCounterAnimations;
    window.animateCounter = animateCounter;
});

// CSS classes and HTML structure expected:
/*
HTML Structure:
<section class="hero-stats">
    <div class="stat-item">
        <div class="counter-number plus-counter" data-target="10">0</div>
        <div class="stat-label">Happy Customers</div>
    </div>
    <div class="stat-item">
        <div class="counter-number plus-counter" data-target="50">0</div>
        <div class="stat-label">Happy Tenants</div>
    </div>
    <div class="stat-item">
        <div class="counter-number uptime-counter" data-target="9.99">9.99</div>
        <div class="stat-label">Uptime</div>
    </div>
</section>

CSS Classes:
.counter-number - Main counter element
.plus-counter - For counters that show "+" suffix
.uptime-counter - For uptime percentage counter
.stat-item - Individual stat container
.hero-stats - Main stats section container
.animated - Added when animation has been triggered
*/
