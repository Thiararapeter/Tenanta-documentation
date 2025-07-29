// Pricing page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Billing toggle functionality
    const billingToggle = document.getElementById('billing-toggle');
    const monthlyAmounts = document.querySelectorAll('.amount.monthly');
    const annualAmounts = document.querySelectorAll('.amount.annual');
    const annualNotes = document.querySelectorAll('.annual-note');
    const toggleLabels = document.querySelectorAll('.toggle-label');

    if (billingToggle) {
        billingToggle.addEventListener('change', function() {
            const isAnnual = this.checked;
            
            // Toggle price displays
            monthlyAmounts.forEach(amount => {
                amount.style.display = isAnnual ? 'none' : 'inline';
            });
            
            annualAmounts.forEach(amount => {
                amount.style.display = isAnnual ? 'inline' : 'none';
            });
            
            annualNotes.forEach(note => {
                note.style.display = isAnnual ? 'block' : 'none';
            });
            
            // Update toggle label styling
            toggleLabels.forEach((label, index) => {
                if (index === 0) { // Monthly
                    label.style.opacity = isAnnual ? '0.6' : '1';
                } else { // Annual
                    label.style.opacity = isAnnual ? '1' : '0.6';
                }
            });
        });
    }

    console.log('Pricing page JavaScript loaded successfully!');
});

