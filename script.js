document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', function() {
      mobileMenu.classList.toggle('show');
      // Update toggle icon
      if (mobileMenu.classList.contains('show')) {
        mobileMenuToggle.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        `;
      } else {
        mobileMenuToggle.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        `;
      }
    });
  }

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href').substring(1);
      if (!targetId) return;
      
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        // Close mobile menu if it's open
        if (mobileMenu && mobileMenu.classList.contains('show')) {
          mobileMenu.classList.remove('show');
          mobileMenuToggle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          `;
        }
        
        // Scroll to target
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Account for fixed header
          behavior: 'smooth'
        });
      }
    });
  });

  // Helper function to scroll to a section
  window.scrollToSection = function(id) {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
      
      // Close mobile menu if it's open
      if (mobileMenu && mobileMenu.classList.contains('show')) {
        mobileMenu.classList.remove('show');
      }
    }
  };

  // Form validation and submission
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  // Handle form submissions
  const handleFormSubmit = (formId, inputId, errorId) => {
    const form = document.getElementById(formId);
    const input = document.getElementById(inputId);
    const errorElement = document.getElementById(errorId);
    
    if (form && input && errorElement) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous error
        errorElement.textContent = '';
        
        const email = input.value.trim();
        
        if (!email) {
          errorElement.textContent = 'Please enter your email address';
          return;
        }
        
        if (!validateEmail(email)) {
          errorElement.textContent = 'Please enter a valid email address';
          return;
        }
        
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.innerHTML = `
          <span class="loading">
            <svg class="loading-spinner" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" stroke-width="4" stroke-dasharray="15 85" stroke-dashoffset="0">
                <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" />
              </circle>
            </svg>
            Submitting...
          </span>
        `;
        
        // Simulate API call
        setTimeout(() => {
          // Create success message
          const successMessage = document.createElement('div');
          successMessage.className = 'success-message show';
          successMessage.textContent = 'Thanks for joining! Check your email for confirmation.';
          
          // Replace form with success message
          form.parentNode.replaceChild(successMessage, form);
          
          // Track submission in localStorage to show success message on page refresh
          localStorage.setItem('emailSubmitted', 'true');
          localStorage.setItem('submittedEmail', email);
        }, 1500);
      });
    }
  };

  // Initialize form handlers
  handleFormSubmit('hero-form', 'hero-email', 'hero-error');
  handleFormSubmit('cta-form', 'cta-email', 'cta-error');
  
  // Check if forms were already submitted (for page refresh)
  if (localStorage.getItem('emailSubmitted') === 'true') {
    const heroForm = document.getElementById('hero-form');
    const ctaForm = document.getElementById('cta-form');
    
    if (heroForm) {
      const successMessage = document.createElement('div');
      successMessage.className = 'success-message show';
      successMessage.textContent = 'Thanks for joining! Check your email for confirmation.';
      heroForm.parentNode.replaceChild(successMessage, heroForm);
    }
    
    if (ctaForm) {
      const successMessage = document.createElement('div');
      successMessage.className = 'success-message show';
      successMessage.textContent = 'Thanks for joining! Check your email for confirmation.';
      ctaForm.parentNode.replaceChild(successMessage, ctaForm);
    }
  }

  // FAQ Accordion
  const accordionButtons = document.querySelectorAll('.accordion-button');
  
  accordionButtons.forEach(button => {
    button.addEventListener('click', () => {
      const accordionItem = button.parentElement;
      
      // Toggle current item
      accordionItem.classList.toggle('active');
      
      // Close other items (optional)
      // document.querySelectorAll('.accordion-item').forEach(item => {
      //   if (item !== accordionItem) {
      //     item.classList.remove('active');
      //   }
      // });
    });
  });

  // Animate counter
  const counterElement = document.getElementById('counter');
  if (counterElement) {
    const finalCount = 157;
    let count = 0;
    
    const animateCounter = () => {
      if (count < finalCount) {
        const increment = Math.ceil((finalCount - count) / 10);
        count += increment;
        
        if (count > finalCount) {
          count = finalCount;
        }
        
        counterElement.textContent = count + '+';
        
        requestAnimationFrame(() => {
          setTimeout(animateCounter, 50);
        });
      }
    };
    
    // Start counter animation when element is in viewport
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter();
          observer.unobserve(entry.target);
        }
      });
    });
    
    observer.observe(counterElement);
  }

  // Update copyright year
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});