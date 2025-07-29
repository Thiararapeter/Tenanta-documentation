// Contact page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Contact information interactions
    console.log('Contact page loaded - form removed as requested');
    
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
    
    // Contact info card animations
    const infoCards = document.querySelectorAll('.info-card');
    const supportCards = document.querySelectorAll('.support-card');
    
    const cardObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    [...infoCards, ...supportCards].forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        cardObserver.observe(card);
    });
    
    // Enhanced hover effects for contact cards
    [...infoCards, ...supportCards].forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Copy contact information functionality
    const contactLinks = document.querySelectorAll('.info-card a[href^="mailto:"], .info-card a[href^="tel:"]');
    contactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            let textToCopy;
            if (this.href.startsWith('mailto:')) {
                textToCopy = this.href.replace('mailto:', '');
            } else if (this.href.startsWith('tel:')) {
                textToCopy = this.href.replace('tel:', '');
            }
            
            if (textToCopy && window.copyToClipboard) {
                window.copyToClipboard(textToCopy);
            }
            
            // Still open the default action after a short delay
            setTimeout(() => {
                window.location.href = this.href;
            }, 500);
        });
        
        // Add copy icon
        const copyIcon = document.createElement('i');
        copyIcon.className = 'fas fa-copy';
        copyIcon.style.cssText = `
            margin-left: 0.5rem;
            opacity: 0.6;
            font-size: 0.8rem;
            cursor: pointer;
        `;
        copyIcon.title = 'Click to copy';
        link.appendChild(copyIcon);
    });
    
    // Form field character counters
    const textareaField = document.querySelector('#message');
    if (textareaField) {
        const maxLength = 1000;
        textareaField.setAttribute('maxlength', maxLength);
        
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            text-align: right;
            font-size: 0.8rem;
            color: #64748b;
            margin-top: 0.25rem;
        `;
        
        function updateCounter() {
            const remaining = maxLength - textareaField.value.length;
            counter.textContent = `${remaining} characters remaining`;
            
            if (remaining < 100) {
                counter.style.color = '#ef4444';
            } else if (remaining < 200) {
                counter.style.color = '#f59e0b';
            } else {
                counter.style.color = '#64748b';
            }
        }
        
        textareaField.addEventListener('input', updateCounter);
        textareaField.parentNode.appendChild(counter);
        updateCounter();
    }
    
    // Auto-resize textarea
    if (textareaField) {
        textareaField.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }
    
    // Subject-based form customization
    const subjectSelect = document.querySelector('#subject');
    if (subjectSelect) {
        subjectSelect.addEventListener('change', function() {
            const messageField = document.querySelector('#message');
            const placeholders = {
                'demo': 'Please let us know your availability for a demo and any specific features you\'d like to see...',
                'pricing': 'Tell us about your property portfolio and we\'ll help you choose the right plan...',
                'support': 'Please describe the issue you\'re experiencing in detail...',
                'partnership': 'Tell us about your organization and how you\'d like to partner with us...',
                'general': 'Tell us how we can help you...'
            };
            
            if (messageField && placeholders[this.value]) {
                messageField.placeholder = placeholders[this.value];
            }
        });
    }
    
    // Form progress indicator
    function updateFormProgress() {
        const requiredFields = contactForm.querySelectorAll('[required]');
        const filledFields = Array.from(requiredFields).filter(field => field.value.trim());
        const progress = (filledFields.length / requiredFields.length) * 100;
        
        let progressBar = document.querySelector('.form-progress');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'form-progress';
            progressBar.style.cssText = `
                height: 3px;
                background: #e5e7eb;
                border-radius: 2px;
                margin-bottom: 1rem;
                overflow: hidden;
            `;
            
            const progressFill = document.createElement('div');
            progressFill.className = 'form-progress-fill';
            progressFill.style.cssText = `
                height: 100%;
                background: linear-gradient(90deg, #2563eb, #10b981);
                width: 0%;
                transition: width 0.3s ease;
            `;
            
            progressBar.appendChild(progressFill);
            contactForm.insertBefore(progressBar, contactForm.firstChild);
        }
        
        const progressFill = progressBar.querySelector('.form-progress-fill');
        progressFill.style.width = `${progress}%`;
    }
    
    if (contactForm) {
        const formFields = contactForm.querySelectorAll('input, select, textarea');
        formFields.forEach(field => {
            field.addEventListener('input', updateFormProgress);
        });
        updateFormProgress();
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to submit form
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && contactForm) {
            e.preventDefault();
            contactForm.dispatchEvent(new Event('submit'));
        }
    });
    
    // Add tooltips to form fields
    const tooltips = {
        'firstName': 'Enter your first name',
        'lastName': 'Enter your last name',
        'email': 'We\'ll use this to respond to your message',
        'company': 'Optional: Your company or organization name',
        'subject': 'Choose the topic that best describes your inquiry',
        'message': 'Provide as much detail as possible to help us assist you better'
    };
    
    Object.entries(tooltips).forEach(([fieldId, tooltip]) => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.title = tooltip;
        }
    });
    
    console.log('Contact page JavaScript loaded successfully!');
});
