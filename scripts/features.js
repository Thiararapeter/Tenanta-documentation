// Features page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality for feature categories
    const tabButtons = document.querySelectorAll('.tab-button');
    const featureCategories = document.querySelectorAll('.feature-category');

    function switchTab(targetCategory) {
        // Remove active class from all tabs and categories
        tabButtons.forEach(btn => btn.classList.remove('active'));
        featureCategories.forEach(category => category.classList.remove('active'));

        // Add active class to clicked tab and corresponding category
        const targetButton = document.querySelector(`[data-category="${targetCategory}"]`);
        const targetCategoryElement = document.getElementById(targetCategory);

        if (targetButton && targetCategoryElement) {
            targetButton.classList.add('active');
            targetCategoryElement.classList.add('active');
        }
    }

    // Add click event listeners to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            switchTab(category);
            
            // Smooth scroll to category section
            const categoryElement = document.getElementById(category);
            if (categoryElement) {
                categoryElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Keyboard navigation for tabs
    tabButtons.forEach((button, index) => {
        button.addEventListener('keydown', function(e) {
            let targetIndex;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    targetIndex = index > 0 ? index - 1 : tabButtons.length - 1;
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    targetIndex = index < tabButtons.length - 1 ? index + 1 : 0;
                    break;
                case 'Home':
                    e.preventDefault();
                    targetIndex = 0;
                    break;
                case 'End':
                    e.preventDefault();
                    targetIndex = tabButtons.length - 1;
                    break;
                default:
                    return;
            }
            
            tabButtons[targetIndex].focus();
            tabButtons[targetIndex].click();
        });
    });

    // Auto-switch tabs on scroll (optional)
    const categoryObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                const categoryId = entry.target.id;
                const correspondingTab = document.querySelector(`[data-category="${categoryId}"]`);
                
                if (correspondingTab && !correspondingTab.classList.contains('active')) {
                    // Only switch if user isn't actively clicking tabs
                    if (!document.querySelector('.tab-button:hover')) {
                        switchTab(categoryId);
                    }
                }
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '-100px 0px -100px 0px'
    });

    // Observe feature categories for auto-switching
    featureCategories.forEach(category => {
        categoryObserver.observe(category);
    });

    // Feature card animations
    const featureCards = document.querySelectorAll('.feature-detail');
    
    const cardObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100); // Stagger animation
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        cardObserver.observe(card);
    });

    // Feature list item animations
    const featureListItems = document.querySelectorAll('.feature-list li');
    
    featureListItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = `opacity 0.4s ease ${index * 0.1}s, transform 0.4s ease ${index * 0.1}s`;
        
        const listObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }
            });
        }, { threshold: 0.5 });
        
        listObserver.observe(item);
    });

    // Tab indicator animation
    function updateTabIndicator() {
        const activeTab = document.querySelector('.tab-button.active');
        if (activeTab) {
            const indicator = document.querySelector('.tab-indicator');
            if (!indicator) {
                const newIndicator = document.createElement('div');
                newIndicator.className = 'tab-indicator';
                newIndicator.style.cssText = `
                    position: absolute;
                    bottom: 0;
                    height: 3px;
                    background: #2563eb;
                    transition: all 0.3s ease;
                    border-radius: 2px 2px 0 0;
                `;
                document.querySelector('.category-tabs').appendChild(newIndicator);
            }
            
            const tabRect = activeTab.getBoundingClientRect();
            const containerRect = activeTab.parentElement.getBoundingClientRect();
            
            indicator.style.left = `${tabRect.left - containerRect.left}px`;
            indicator.style.width = `${tabRect.width}px`;
        }
    }

    // Update indicator on tab change
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            setTimeout(updateTabIndicator, 100);
        });
    });

    // Update indicator on window resize
    window.addEventListener('resize', updateTabIndicator);

    // Initialize indicator
    setTimeout(updateTabIndicator, 100);

    // Feature card hover effects
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Search functionality for features (if search box exists)
    const searchInput = document.querySelector('#feature-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            featureCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                const listItems = Array.from(card.querySelectorAll('.feature-list li'))
                    .map(li => li.textContent.toLowerCase())
                    .join(' ');
                
                const isMatch = title.includes(searchTerm) || 
                               description.includes(searchTerm) || 
                               listItems.includes(searchTerm);
                
                if (isMatch) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Show/hide categories based on visible cards
            featureCategories.forEach(category => {
                const visibleCards = category.querySelectorAll('.feature-detail[style*="display: block"], .feature-detail:not([style*="display: none"])');
                if (visibleCards.length === 0 && searchTerm) {
                    category.style.display = 'none';
                } else {
                    category.style.display = 'block';
                }
            });
        });
    }

    // Copy feature link functionality
    const featureLinks = document.querySelectorAll('.feature-detail h3');
    featureLinks.forEach(title => {
        title.style.cursor = 'pointer';
        title.title = 'Click to copy link to this feature';
        
        title.addEventListener('click', function() {
            const featureId = this.textContent.toLowerCase().replace(/\s+/g, '-');
            const url = `${window.location.origin}${window.location.pathname}#${featureId}`;
            
            if (window.copyToClipboard) {
                window.copyToClipboard(url);
            }
        });
    });

    // URL hash handling for direct feature links
    function handleHashChange() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            // Check if hash corresponds to a category
            const category = document.getElementById(hash);
            if (category && category.classList.contains('feature-category')) {
                switchTab(hash);
                return;
            }
            
            // Check if hash corresponds to a feature
            const featureTitle = document.querySelector(`h3:contains("${hash.replace(/-/g, ' ')}")`);
            if (featureTitle) {
                const categoryElement = featureTitle.closest('.feature-category');
                if (categoryElement) {
                    switchTab(categoryElement.id);
                    setTimeout(() => {
                        featureTitle.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }, 300);
                }
            }
        }
    }

    // Handle hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Handle initial hash
    if (window.location.hash) {
        setTimeout(handleHashChange, 100);
    }

    // Add ARIA attributes for accessibility
    tabButtons.forEach((button, index) => {
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-selected', button.classList.contains('active'));
        button.setAttribute('aria-controls', button.getAttribute('data-category'));
        button.setAttribute('tabindex', button.classList.contains('active') ? '0' : '-1');
    });

    featureCategories.forEach(category => {
        category.setAttribute('role', 'tabpanel');
        category.setAttribute('aria-hidden', !category.classList.contains('active'));
    });

    // Update ARIA attributes when tabs change
    const originalSwitchTab = switchTab;
    switchTab = function(targetCategory) {
        originalSwitchTab(targetCategory);
        
        tabButtons.forEach(button => {
            const isActive = button.getAttribute('data-category') === targetCategory;
            button.setAttribute('aria-selected', isActive);
            button.setAttribute('tabindex', isActive ? '0' : '-1');
        });
        
        featureCategories.forEach(category => {
            const isActive = category.id === targetCategory;
            category.setAttribute('aria-hidden', !isActive);
        });
    };

    // Interactive Demo functionality
    const demoCards = document.querySelectorAll('.demo-card');
    const demoContents = document.querySelectorAll('.demo-content');

    function switchDemo(targetDemo) {
        // Remove active class from all demo cards and contents
        demoCards.forEach(card => card.classList.remove('active'));
        demoContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked card and corresponding content
        const targetCard = document.querySelector(`[data-demo="${targetDemo}"]`);
        const targetContent = document.getElementById(`demo-${targetDemo}`);

        if (targetCard && targetContent) {
            targetCard.classList.add('active');
            targetContent.classList.add('active');
        }
    }

    // Add click event listeners to demo cards
    demoCards.forEach(card => {
        card.addEventListener('click', function() {
            const demo = this.getAttribute('data-demo');
            switchDemo(demo);
        });
    });

    // Auto-cycle through demos (optional)
    let currentDemoIndex = 0;
    const demoTypes = ['dashboard', 'properties', 'tenants', 'billing'];

    function autoCycleDemo() {
        currentDemoIndex = (currentDemoIndex + 1) % demoTypes.length;
        switchDemo(demoTypes[currentDemoIndex]);
    }

    // Auto-cycle every 5 seconds (uncomment to enable)
    // setInterval(autoCycleDemo, 5000);

    console.log('Features page JavaScript loaded successfully!');
});
