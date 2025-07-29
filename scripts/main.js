// Main JavaScript file for Tenanta website

document.addEventListener('DOMContentLoaded', function() {
    // Update footer year automatically
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .benefit-item, .stat, .value-card, .team-member');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Counter animation for stats
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }

    // Animate counters when they come into view
    const statNumbers = document.querySelectorAll('.stat-number');
    const statObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.textContent.replace(/[^\d]/g, ''));
                if (target && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    animateCounter(entry.target, target);
                }
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statObserver.observe(stat);
    });

    // FAQ functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all FAQ items
                faqItems.forEach(faq => faq.classList.remove('active'));
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });

    // Form validation helper
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            const errorElement = field.parentNode.querySelector('.error-message');
            
            // Remove existing error styling
            field.classList.remove('error');
            if (errorElement) {
                errorElement.remove();
            }
            
            // Check if field is empty
            if (!field.value.trim()) {
                showFieldError(field, 'This field is required');
                isValid = false;
            } else if (field.type === 'email' && !validateEmail(field.value)) {
                showFieldError(field, 'Please enter a valid email address');
                isValid = false;
            }
        });
        
        return isValid;
    }

    function showFieldError(field, message) {
        field.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
    }

    // Expose validation functions globally
    window.validateForm = validateForm;
    window.validateEmail = validateEmail;
    window.showFieldError = showFieldError;

    // Loading state helper
    function setLoadingState(button, isLoading) {
        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    // Success message helper
    function showSuccessMessage(message, duration = 3000) {
        const successElement = document.createElement('div');
        successElement.className = 'success-message';
        successElement.textContent = message;
        successElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(successElement);
        
        setTimeout(() => {
            successElement.remove();
        }, duration);
    }

    // Expose helper functions globally
    window.setLoadingState = setLoadingState;
    window.showSuccessMessage = showSuccessMessage;

    // Initialize phone mockup functionality
    initPhoneMockup();

    // Initialize auto sidebar for demo
    initAutoSidebar();
    
    // Initialize sidebar interactions
    initSidebarInteractions();

    console.log('Main JavaScript loaded successfully!');
});

// Phone mockup functionality
function initPhoneMockup() {
    // Update live date
    const liveDateElement = document.querySelector('.live-date');
    if (liveDateElement) {
        const now = new Date();
        const options = { month: 'short', day: 'numeric' };
        liveDateElement.textContent = now.toLocaleDateString('en-US', options);
    }

    // Phone billing toggle functionality
    const phoneBillingToggle = document.getElementById('phone-billing-toggle');
    if (phoneBillingToggle) {
        phoneBillingToggle.addEventListener('change', function() {
            const isAnnual = this.checked;
            const monthlyPrices = document.querySelectorAll('.pricing-cards-phone .plan-price.monthly');
            const annualPrices = document.querySelectorAll('.pricing-cards-phone .plan-price.annual');
            const toggleLabels = document.querySelectorAll('.billing-toggle-phone .toggle-label');
            
            monthlyPrices.forEach(price => {
                price.style.display = isAnnual ? 'none' : 'block';
            });
            
            annualPrices.forEach(price => {
                price.style.display = isAnnual ? 'block' : 'none';
            });
            
            toggleLabels.forEach((label, index) => {
                if (index === 0) { // Monthly
                    label.classList.toggle('active', !isAnnual);
                } else { // Annual
                    label.classList.toggle('active', isAnnual);
                }
            });
        });
    }
}

// Auto-open sidebar functionality for mobile mockup
function initAutoSidebar() {
    // Auto-open sidebar after 10 seconds
    setTimeout(() => {
        const sidebar = document.getElementById('sidebarMenu');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (sidebar && overlay) {
            sidebar.classList.add('active');
            overlay.classList.add('active');
            
            // Auto-close after 4 seconds
            setTimeout(() => {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            }, 4000);
        }
    }, 10000);
}

// Initialize auto sidebar when page loads
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    
    // Initialize auto sidebar for demo
    initAutoSidebar();
    
    // Initialize sidebar interactions
    initSidebarInteractions();
});

// Enhanced sidebar interactions
function initSidebarInteractions() {
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            menuItems.forEach(mi => mi.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.className = 'menu-ripple';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add ripple animation CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Add flash animation CSS
const flashStyle = document.createElement('style');
flashStyle.textContent = `
    @keyframes flash {
        0% { background-color: transparent; }
        50% { background-color: rgba(102, 126, 234, 0.1); }
        100% { background-color: transparent; }
    }
`;
document.head.appendChild(flashStyle);

// Handle menu item clicks and update dashboard content
function handleMenuItemClick(menuText) {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    switch(menuText) {
        case 'Dashboard':
            showDashboardContent();
            break;
        case 'Properties':
            showPropertiesContent();
            break;
        case 'Tenants':
            showTenantsContent();
            break;
        case 'Billing':
            showBillingContent();
            break;
        case 'Analytics':
            showAnalyticsContent();
            break;
        case 'Maintenance':
            showMaintenanceContent();
            break;
        case 'Settings':
            showSettingsContent();
            break;
    }
}

function showLoadingState() {
    const appContent = document.querySelector('.app-content');
    if (appContent) {
        appContent.style.opacity = '0.5';
        appContent.style.transform = 'scale(0.98)';
    }
}

function hideLoadingState() {
    const appContent = document.querySelector('.app-content');
    if (appContent) {
        appContent.style.opacity = '1';
        appContent.style.transform = 'scale(1)';
    }
}

function updateDashboardView() {
    const incomeCard = document.querySelector('.income-card .stat-value');
    const unitsCard = document.querySelector('.units-card .stat-value');
    const propertyInfo = document.querySelector('.property-info h3');
    const propertyDetails = document.querySelector('.property-info p');
    const welcomeText = document.querySelector('.welcome-text');

    if (welcomeText) welcomeText.textContent = 'Good morning, Thiarara!';
    if (propertyInfo) propertyInfo.textContent = 'Nairobi Heights';
    if (propertyDetails) propertyDetails.innerHTML = '18 Units • <span class="occupancy-rate">89%</span> Occupied';

    // Ensure amounts are displayed with black text
    if (incomeCard) {
        incomeCard.textContent = 'KSh 185,000';
        incomeCard.style.fontSize = '1.5rem';
        incomeCard.style.fontWeight = '700';
        incomeCard.style.color = '#000000';
    }
    
    if (unitsCard) {
        unitsCard.textContent = '18';
        unitsCard.style.fontSize = '1.5rem';
        unitsCard.style.fontWeight = '700';
        unitsCard.style.color = '#000000';
    }

    // Update labels with black text
    const incomeLabel = document.querySelector('.income-card .stat-label');
    const unitsLabel = document.querySelector('.units-card .stat-label');
    if (incomeLabel) {
        incomeLabel.textContent = 'Monthly Income';
        incomeLabel.style.color = '#000000';
    }
    if (unitsLabel) {
        unitsLabel.textContent = 'Total Units';
        unitsLabel.style.color = '#000000';
    }
}

function updatePropertiesView() {
    const incomeCard = document.querySelector('.income-card .stat-value');
    const unitsCard = document.querySelector('.units-card .stat-value');
    const propertyInfo = document.querySelector('.property-info h3');
    const propertyDetails = document.querySelector('.property-info p');
    const welcomeText = document.querySelector('.welcome-text');

    if (welcomeText) welcomeText.textContent = 'Properties Overview';
    if (propertyInfo) propertyInfo.textContent = 'Total Properties';
    if (propertyDetails) propertyDetails.innerHTML = '5 Properties • <span class="occupancy-rate">87%</span> Average Occupancy';

    animateCounterTo(incomeCard, 850000, 'KSh ');
    animateCounterTo(unitsCard, 5, '');

    // Update labels
    const incomeLabel = document.querySelector('.income-card .stat-label');
    const unitsLabel = document.querySelector('.units-card .stat-label');
    if (incomeLabel) incomeLabel.textContent = 'Total Value';
    if (unitsLabel) unitsLabel.textContent = 'Properties';
}

function updateTenantsView() {
    const incomeCard = document.querySelector('.income-card .stat-value');
    const unitsCard = document.querySelector('.units-card .stat-value');
    const propertyInfo = document.querySelector('.property-info h3');
    const propertyDetails = document.querySelector('.property-info p');
    const welcomeText = document.querySelector('.welcome-text');

    if (welcomeText) welcomeText.textContent = 'Tenant Management';
    if (propertyInfo) propertyInfo.textContent = 'Active Tenants';
    if (propertyDetails) propertyDetails.innerHTML = '42 Tenants • <span class="occupancy-rate">38</span> Units Occupied';

    animateCounterTo(incomeCard, 42, '');
    animateCounterTo(unitsCard, 4, '');

    // Update labels
    const incomeLabel = document.querySelector('.income-card .stat-label');
    const unitsLabel = document.querySelector('.units-card .stat-label');
    if (incomeLabel) incomeLabel.textContent = 'Active Tenants';
    if (unitsLabel) unitsLabel.textContent = 'Vacant Units';
}

function updateBillingView() {
    const incomeCard = document.querySelector('.income-card .stat-value');
    const unitsCard = document.querySelector('.units-card .stat-value');
    const propertyInfo = document.querySelector('.property-info h3');
    const propertyDetails = document.querySelector('.property-info p');
    const welcomeText = document.querySelector('.welcome-text');

    if (welcomeText) welcomeText.textContent = 'Billing Overview';
    if (propertyInfo) propertyInfo.textContent = 'Monthly Bills';
    if (propertyDetails) propertyDetails.innerHTML = 'January 2025 • <span class="occupancy-rate">95%</span> Collection Rate';

    animateCounterTo(incomeCard, 195000, 'KSh ');
    animateCounterTo(unitsCard, 42, '');

    // Update labels
    const incomeLabel = document.querySelector('.income-card .stat-label');
    const unitsLabel = document.querySelector('.units-card .stat-label');
    if (incomeLabel) incomeLabel.textContent = 'Bills Generated';
    if (unitsLabel) unitsLabel.textContent = 'Total Bills';
}

function updatePaymentsView() {
    const incomeCard = document.querySelector('.income-card .stat-value');
    const unitsCard = document.querySelector('.units-card .stat-value');
    const propertyInfo = document.querySelector('.property-info h3');
    const propertyDetails = document.querySelector('.property-info p');
    const welcomeText = document.querySelector('.welcome-text');

    if (welcomeText) welcomeText.textContent = 'Payment Tracking';
    if (propertyInfo) propertyInfo.textContent = 'Payments Received';
    if (propertyDetails) propertyDetails.innerHTML = 'This Month • <span class="occupancy-rate">39</span> Payments Processed';

    animateCounterTo(incomeCard, 175500, 'KSh ');
    animateCounterTo(unitsCard, 3, '');

    // Update labels
    const incomeLabel = document.querySelector('.income-card .stat-label');
    const unitsLabel = document.querySelector('.units-card .stat-label');
    if (incomeLabel) incomeLabel.textContent = 'Received';
    if (unitsLabel) unitsLabel.textContent = 'Pending';
}

function updateReportsView() {
    const incomeCard = document.querySelector('.income-card .stat-value');
    const unitsCard = document.querySelector('.units-card .stat-value');
    const propertyInfo = document.querySelector('.property-info h3');
    const propertyDetails = document.querySelector('.property-info p');
    const welcomeText = document.querySelector('.welcome-text');

    if (welcomeText) welcomeText.textContent = 'Financial Reports';
    if (propertyInfo) propertyInfo.textContent = 'Annual Summary';
    if (propertyDetails) propertyDetails.innerHTML = '2024 Report • <span class="occupancy-rate">12</span> Months Data';

    animateCounterTo(incomeCard, 2100000, 'KSh ');
    animateCounterTo(unitsCard, 89, '');

    // Update labels
    const incomeLabel = document.querySelector('.income-card .stat-label');
    const unitsLabel = document.querySelector('.units-card .stat-label');
    if (incomeLabel) incomeLabel.textContent = 'Annual Income';
    if (unitsLabel) unitsLabel.textContent = 'Avg Occupancy %';
}

function updateMaintenanceView() {
    const incomeCard = document.querySelector('.income-card .stat-value');
    const unitsCard = document.querySelector('.units-card .stat-value');
    const propertyInfo = document.querySelector('.property-info h3');
    const propertyDetails = document.querySelector('.property-info p');
    const welcomeText = document.querySelector('.welcome-text');

    if (welcomeText) welcomeText.textContent = 'Maintenance Overview';
    if (propertyInfo) propertyInfo.textContent = 'Maintenance Requests';
    if (propertyDetails) propertyDetails.innerHTML = 'This Month • <span class="occupancy-rate">2</span> Pending Requests';

    animateCounterTo(incomeCard, 25000, 'KSh ');
    animateCounterTo(unitsCard, 2, '');


    // Update labels
    const incomeLabel = document.querySelector('.income-card .stat-label');
    const unitsLabel = document.querySelector('.units-card .stat-label');
    if (incomeLabel) incomeLabel.textContent = 'Monthly Cost';
    if (unitsLabel) unitsLabel.textContent = 'Pending';
}

function animateCounterTo(element, target, prefix = '') {
    if (!element) return;
    
    // Set initial display
    element.textContent = prefix + target.toLocaleString();
    element.style.fontSize = '1.5rem';
    element.style.fontWeight = '700';
    element.style.color = '#1f2937';
}

// Make functions globally available
window.toggleSidebar = toggleSidebar;
window.handleMenuItemClick = handleMenuItemClick;

function showBillingContent() {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.innerHTML = `
            <div class="billing-view">
                <div class="view-header">
                    <h2>Billing</h2>
                    <div class="billing-toggle-mini">
                        <span class="toggle-text monthly active">Monthly</span>
                        <span class="toggle-text annual">Annual</span>
                    </div>
                </div>
                <div class="pricing-cards-mini">
                    <div class="price-card">
                        <div class="plan-name">Starter</div>
                        <div class="plan-price">$29/mo</div>
                    </div>
                    <div class="price-card featured">
                        <div class="plan-name">Professional</div>
                        <div class="plan-price">$79/mo</div>
                    </div>
                </div>
            </div>
        `;
    }
}

function showDashboardContent() {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.innerHTML = `
            <div class="dashboard-view">
                <div class="view-header">
                    <h2>Dashboard</h2>
                </div>
                <div class="dashboard-cards">
                    <div class="card income-card">
                        <div class="card-header">
                            <h3>Monthly Income</h3>
                        </div>
                        <div class="card-content">
                            <div class="stat-value">KSh 185,000</div>
                            <div class="stat-label">Monthly Income</div>
                        </div>
                    </div>
                    <div class="card units-card">
                        <div class="card-header">
                            <h3>Total Units</h3>
                        </div>
                        <div class="card-content">
                            <div class="stat-value">18</div>
                            <div class="stat-label">Total Units</div>
                        </div>
                    </div>
                    <div class="card property-card">
                        <div class="card-header">
                            <h3>Property Information</h3>
                        </div>
                        <div class="card-content">
                            <h4>Nairobi Heights</h4>
                            <p>18 Units • <span class="occupancy-rate">89%</span> Occupied</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

function showPropertiesContent() {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.innerHTML = `
            <div class="properties-view">
                <div class="view-header">
                    <h2>Properties Overview</h2>
                </div>
                <div class="properties-cards">
                    <div class="card income-card">
                        <div class="card-header">
                            <h3>Total Value</h3>
                        </div>
                        <div class="card-content">
                            <div class="stat-value">KSh 850,000</div>
                            <div class="stat-label">Total Value</div>
                        </div>
                    </div>
                    <div class="card units-card">
                        <div class="card-header">
                            <h3>Properties</h3>
                        </div>
                        <div class="card-content">
                            <div class="stat-value">5</div>
                            <div class="stat-label">Properties</div>
                        </div>
                    </div>
                    <div class="card property-card">
                        <div class="card-header">
                            <h3>Average Occupancy</h3>
                        </div>
                        <div class="card-content">
                            <h4>87%</h4>
                            <p>Average Occupancy Rate</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

function showTenantsContent() {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.innerHTML = `
            <div class="tenants-view">
                <div class="view-header">
                    <h2>Tenant Management</h2>
                </div>
                <div class="tenants-cards">
                    <div class="card income-card">
                        <div class="card-header">
                            <h3>Active Tenants</h3>
                        </div>
                        <div class="card-content">
                            <div class="stat-value">42</div>
                            <div class="stat-label">Active Tenants</div>
                        </div>
                    </div>
                    <div class="card units-card">
                        <div class="card-header">
                            <h3>Vacant Units</h3>
                        </div>
                        <div class="card-content">
                            <div class="stat-value">4</div>
                            <div class="stat-label">Vacant Units</div>
                        </div>
                    </div>
                    <div class="card property-card">
                        <div class="card-header">
                            <h3>Occupied Units</h3>
                        </div>
                        <div class="card-content">
                            <h4>42</h4>
                            <p>Units Occupied</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

function showAnalyticsContent() {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.innerHTML = `
            <div class="analytics-view">
                <div class="view-header">
                    <h2>Analytics</h2>
                </div>
                <div class="analytics-cards">
                    <div class="card income-card">
                        <div class="card-header">
                            <h3>Annual Income</h3>
                        </div>
                        <div class="card-content">
                            <div class="stat-value">KSh 2,100,000</div>
                            <div class="stat-label">Annual Income</div>
                        </div>
                    </div>
                    <div class="card units-card">
                        <div class="card-header">
                            <h3>Avg Occupancy %</h3>
                        </div>
                        <div class="card-content">
                            <div class="stat-value">89</div>
                            <div class="stat-label">Avg Occupancy %</div>
                        </div>
                    </div>
                    <div class="card property-card">
                        <div class="card-header">
                            <h3>2024 Report</h3>
                        </div>
                        <div class="card-content">
                            <h4>12 Months Data</h4>
                            <p>Financial Summary for 2024</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

function showMaintenanceContent() {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.innerHTML = `
            <div class="maintenance-view">
                <div class="view-header">
                    <h2>Maintenance Overview</h2>
                </div>
                <div class="maintenance-cards">
                    <div class="card income-card">
                        <div class="card-header">
                            <h3>Monthly Cost</h3>
                        </div>
                        <div class="card-content">
                            <div class="stat-value">KSh 25,000</div>
                            <div class="stat-label">Monthly Cost</div>
                        </div>
                    </div>
                    <div class="card units-card">
                        <div class="card-header">
                            <h3>Pending Requests</h3>
                        </div>
                        <div class="card-content">
                            <div class="stat-value">2</div>
                            <div class="stat-label">Pending Requests</div>
                        </div>
                    </div>
                    <div class="card property-card">
                        <div class="card-header">
                            <h3>This Month</h3>
                        </div>
                        <div class="card-content">
                            <h4>2</h4>
                            <p>Pending Maintenance Requests</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

function showSettingsContent() {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.innerHTML = `
            <div class="settings-view">
                <div class="view-header">
                    <h2>Settings</h2>
                </div>
                <div class="settings-content">
                    <h3>Account Settings</h3>
                    <p>Manage your account information and preferences here.</p>
                    <div class="setting-item">
                        <label for="email">Email Address:</label>
                        <input type="email" id="email" name="email" value="user@example.com">
                    </div>
                    <div class="setting-item">
                        <label for="password">Password:</label>
                        <input type="password" id="password" name="password">
                    </div>
                    <div class="setting-item">
                        <label for="notifications">Enable Notifications:</label>
                        <input type="checkbox" id="notifications" name="notifications" checked>
                    </div>
                    <button class="btn btn-primary">Save Changes</button>
                </div>
            </div>
        `;
    }
}

function showLoadingState() {
    const appContent = document.querySelector('.app-content');
    if (appContent) {
        appContent.style.opacity = '0.5';
        appContent.style.transform = 'scale(0.98)';
    }
}

function hideLoadingState() {
    const appContent = document.querySelector('.app-content');
    if (appContent) {
        appContent.style.opacity = '1';
        appContent.style.transform = 'scale(1)';
    }
}

function updateDashboardView() {
    const incomeCard = document.querySelector('.income-card .stat-value');
    const unitsCard = document.querySelector('.units-card .stat-value');
    const propertyInfo = document.querySelector('.property-info h3');
    const propertyDetails = document.querySelector('.property-info p');
    const welcomeText = document.querySelector('.welcome-text');

    if (welcomeText) welcomeText.textContent = 'Good morning, Thiarara!';
    if (propertyInfo) propertyInfo.textContent = 'Nairobi Heights';
    if (propertyDetails) propertyDetails.innerHTML = '18 Units • <span class="occupancy-rate">89%</span> Occupied';

    // Ensure amounts are displayed with black text
    if (incomeCard) {
        incomeCard.textContent = 'KSh 185,000';
        incomeCard.style.fontSize = '1.5rem';
        incomeCard.style.fontWeight = '700';
        incomeCard.style.color = '#000000';
    }
    
    if (unitsCard) {
        unitsCard.textContent = '18';
        unitsCard.style.fontSize = '1.5rem';
        unitsCard.style.fontWeight = '700';
        unitsCard.style.color = '#000000';
    }

    // Update labels with black text
    const incomeLabel = document.querySelector('.income-card .stat-label');
    const unitsLabel = document.querySelector('.units-card .stat-label');
    if (incomeLabel) {
        incomeLabel.textContent = 'Monthly Income';
        incomeLabel.style.color = '#000000';
    }
    if (unitsLabel) {
        unitsLabel.textContent = 'Total Units';
        unitsLabel.style.color = '#000000';
    }
}

function updatePropertiesView() {
    const incomeCard = document.querySelector('.income-card .stat-value');
    const unitsCard = document.querySelector('.units-card .stat-value');
    const propertyInfo = document.querySelector('.property-info h3');
    const propertyDetails = document.querySelector('.property-info p');
    const welcomeText = document.querySelector('.welcome-text');

    if (welcomeText) welcomeText.textContent = 'Properties Overview';
    if (propertyInfo) propertyInfo.textContent = 'Total Properties';
    if (propertyDetails) propertyDetails.innerHTML = '5 Properties • <span class="occupancy-rate">87%</span> Average Occupancy';

    animateCounterTo(incomeCard, 850000, 'KSh ');
    animateCounterTo(unitsCard, 5, '');

    // Update labels
    const incomeLabel = document.querySelector('.income-card .stat-label');
    const unitsLabel = document.querySelector('.units-card .stat-label');
    if (incomeLabel) incomeLabel.textContent = 'Total Value';
    if (unitsLabel) unitsLabel.textContent = 'Properties';
}

function updateTenantsView() {
    const incomeCard = document.querySelector('.income-card .stat-value');
    const unitsCard = document.querySelector('.units-card .stat-value');
    const propertyInfo = document.querySelector('.property-info h3');
    const propertyDetails = document.querySelector('.property-info p');
    const welcomeText = document.querySelector('.welcome-text');

    if (welcomeText) welcomeText.textContent = 'Tenant Management';
    if (propertyInfo) propertyInfo.textContent = 'Active Tenants';
    if (propertyDetails) propertyDetails.innerHTML = '42 Tenants • <span class="occupancy-rate">38</span> Units Occupied';

    animateCounterTo(incomeCard, 42, '');
    animateCounterTo(unitsCard, 4, '');

    // Update labels
    const incomeLabel = document.querySelector('.income-card .stat-label');
    const unitsLabel = document.querySelector('.units-card .stat-label');
    if (incomeLabel) incomeLabel.textContent = 'Active Tenants';
    if (unitsLabel) unitsLabel.textContent = 'Vacant Units';
}

function updateBillingView() {
    const incomeCard = document.querySelector('.income-card .stat-value');
    const unitsCard = document.querySelector('.units-card .stat-value');
    const propertyInfo = document.querySelector('.property-info h3');
    const propertyDetails = document.querySelector('.property-info p');
    const welcomeText = document.querySelector('.welcome-text');

    if (welcomeText) welcomeText.textContent = 'Billing Overview';
    if (propertyInfo) propertyInfo.textContent = 'Monthly Bills';
    if (propertyDetails) propertyDetails.innerHTML = 'January 2025 • <span class="occupancy-rate">95%</span> Collection Rate';

    animateCounterTo(incomeCard, 195000, 'KSh ');
    animateCounterTo(unitsCard, 42, '');

    // Update labels
    const incomeLabel = document.querySelector('.income-card .stat-label');
    const unitsLabel = document.querySelector('.units-card .stat-label');
    if (incomeLabel) incomeLabel.textContent = 'Bills Generated';
    if (unitsLabel) unitsLabel.textContent = 'Total Bills';
}

function updatePaymentsView() {
    const incomeCard = document.querySelector('.income-card .stat-value');
    const unitsCard = document.querySelector('.units-card .stat-value');
    const propertyInfo = document.querySelector('.property-info h3');
    const propertyDetails = document.querySelector('.property-info p');
    const welcomeText = document.querySelector('.welcome-text');

    if (welcomeText) welcomeText.textContent = 'Payment Tracking';
    if (propertyInfo) propertyInfo.textContent = 'Payments Received';
    if (propertyDetails) propertyDetails.innerHTML = 'This Month • <span class="occupancy-rate">39</span> Payments Processed';

    animateCounterTo(incomeCard, 175500, 'KSh ');
    animateCounterTo(unitsCard, 3, '');

    // Update labels
    const incomeLabel = document.querySelector('.income-card .stat-label');
    const unitsLabel = document.querySelector('.units-card .stat-label');
    if (incomeLabel) incomeLabel.textContent = 'Received';
    if (unitsLabel) unitsLabel.textContent = 'Pending';
}

function updateReportsView() {
    const incomeCard = document.querySelector('.income-card .stat-value');
    const unitsCard = document.querySelector('.units-card .stat-value');
    const propertyInfo = document.querySelector('.property-info h3');
    const propertyDetails = document.querySelector('.property-info p');
    const welcomeText = document.querySelector('.welcome-text');

    if (welcomeText) welcomeText.textContent = 'Financial Reports';
    if (propertyInfo) propertyInfo.textContent = 'Annual Summary';
    if (propertyDetails) propertyDetails.innerHTML = '2024 Report • <span class="occupancy-rate">12</span> Months Data';

    animateCounterTo(incomeCard, 2100000, 'KSh ');
    animateCounterTo(unitsCard, 89, '');

    // Update labels
    const incomeLabel = document.querySelector('.income-card .stat-label');
    const unitsLabel = document.querySelector('.units-card .stat-label');
    if (incomeLabel) incomeLabel.textContent = 'Annual Income';
    if (unitsLabel) unitsLabel.textContent = 'Avg Occupancy %';
}

function updateMaintenanceView() {
    const incomeCard = document.querySelector('.income-card .stat-value');
    const unitsCard = document.querySelector('.units-card .stat-value');
    const propertyInfo = document.querySelector('.property-info h3');
    const propertyDetails = document.querySelector('.property-info p');
    const welcomeText = document.querySelector('.welcome-text');

    if (welcomeText) welcomeText.textContent = 'Maintenance Overview';
    if (propertyInfo) propertyInfo.textContent = 'Maintenance Requests';
    if (propertyDetails) propertyDetails.innerHTML = 'This Month • <span class="occupancy-rate">2</span> Pending Requests';

    animateCounterTo(incomeCard, 25000, 'KSh ');
    animateCounterTo(unitsCard, 2, '');


    // Update labels
    const incomeLabel = document.querySelector('.income-card .stat-label');
    const unitsLabel = document.querySelector('.units-card .stat-label');
    if (incomeLabel) incomeLabel.textContent = 'Monthly Cost';
    if (unitsLabel) unitsLabel.textContent = 'Pending';
}

function animateCounterTo(element, target, prefix = '') {
    if (!element) return;
    
    // Set initial display
    element.textContent = prefix + target.toLocaleString();
    element.style.fontSize = '1.5rem';
    element.style.fontWeight = '700';
    element.style.color = '#1f2937';
}

// Make functions globally available
window.toggleSidebar = toggleSidebar;
window.handleMenuItemClick = handleMenuItemClick;






















