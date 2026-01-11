// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

  // --- Signup Form Elements ---
  const emailInput1 = document.getElementById("email-input1");
  const signupButton1 = document.getElementById("signup-button1");
  const message1 = document.getElementById("signup-message1");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const imageModal = document.getElementById('image-modal');
  const imageModalImg = document.getElementById('image-modal-img');
  const imageModalClose = document.getElementById('image-modal-close');
  const imageModalTitle = document.getElementById('image-modal-title');
  const imageModalCaption = document.getElementById('image-modal-caption');
  const proofImageLinks = document.querySelectorAll('[data-image-modal]');
  const waitlistLinks = document.querySelectorAll('a[href="#email-input1"]');

  // --- Function to Handle Signup Logic ---
  function handleSignup(event, emailInput, message) {
    const button = event.target; // Get the specific button that was clicked
    const originalButtonText = button.textContent; // Store the original button text
    const email = emailInput.value.trim(); // Trim whitespace from email

    // Reset message styling and content before validation
    message.style.display = "none";
    message.textContent = "";
    message.style.color = ""; // Reset color

    // Basic validation
    if (!email) {
      // Using the message element instead of alert for consistency
      message.textContent = "Please enter an email address.";
      message.style.color = "red";
      message.style.display = "block";
      return; // Exit if no email
    }

    if (!emailRegex.test(email)) {
      message.textContent = "Please enter a valid email address.";
      message.style.color = "red";
      message.style.display = "block";
      return; // Exit if email is invalid
    }

    // --- Indicate Processing ---
    button.disabled = true; // Disable the button
    button.textContent = "Processing..."; // Change button text

    // --- Fetch Request to Google Apps Script ---
    fetch("https://script.google.com/macros/s/AKfycbzpHbuR_8vcZVVdwxHGZmRTSRejPexBpn0pOc5MyYO2rN0wAAHl4LBRxEfCFJG1DVhusw/exec", {
      method: "POST",
      // Note: 'no-cors' mode prevents reading the response body or status directly in JS.
      // The Google Script needs to handle the CORS response correctly if you want 'cors' mode.
      // For simple submission where you don't need a detailed success/error from the script, 'no-cors' is okay.
      mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      // Encode the email for safe transmission in the URL-encoded body
      body: `email=${encodeURIComponent(email)}`
    })
    .then(() => {
      // IMPORTANT: With 'no-cors', this .then() block executes if the request could be *sent*,
      // not necessarily if the server processed it successfully. We assume success here.
      message.textContent = "🎉 You're on the list! Check your inbox soon.";
      message.style.color = "green";
      message.style.display = "block";
      emailInput.value = ""; // Clear the input field on assumed success
    })
    .catch((error) => {
      // This catches *network* errors (e.g., server unreachable, DNS issues),
      // not application-level errors from the Google Script (due to 'no-cors').
      console.error("Signup Fetch Network Error:", error); // Log the network error
      message.textContent = "Oops! Network error. Please try again later.";
      message.style.color = "red";
      message.style.display = "block";
    })
    .finally(() => {
      // --- Reset Button State (runs after .then() or .catch()) ---
      button.disabled = false; // Re-enable the button
      button.textContent = originalButtonText; // Restore original text
    });
  }

  // --- Proof Image Modal Functions ---
  function openImageModal(event) {
    event.preventDefault();

    if (!imageModal || !imageModalImg) {
      console.error("Image modal elements not found!");
      return;
    }

    const trigger = event.currentTarget;
    const src = trigger.getAttribute('data-image-modal');
    const alt = trigger.getAttribute('data-image-alt') || '';
    const title = trigger.getAttribute('data-image-title') || '';
    const caption = trigger.getAttribute('data-image-caption') || '';

    if (!src) {
      console.error("Image modal source not found!");
      return;
    }

    imageModalImg.src = src;
    imageModalImg.alt = alt;
    if (imageModalTitle) {
      imageModalTitle.textContent = title;
    }
    if (imageModalCaption) {
      imageModalCaption.textContent = caption;
    }
    imageModal.style.display = 'flex';
    setTimeout(() => {
      imageModal.classList.add('active');
    }, 10);
  }

  function closeImageModal() {
    if (!imageModal || !imageModalImg) {
      return;
    }

    imageModal.classList.remove('active');
    setTimeout(() => {
      imageModal.style.display = 'none';
      imageModalImg.src = '';
      imageModalImg.alt = '';
      if (imageModalTitle) {
        imageModalTitle.textContent = '';
      }
      if (imageModalCaption) {
        imageModalCaption.textContent = '';
      }
    }, 300);
  }

  // --- Add Event Listeners ---

  // Signup Button Listeners
  if (signupButton1 && emailInput1 && message1) {
    signupButton1.addEventListener("click", (event) => handleSignup(event, emailInput1, message1));
  } else {
    console.warn("Signup form 1 elements not found.");
  }

  if (emailInput1 && waitlistLinks.length) {
    waitlistLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        emailInput1.scrollIntoView({ behavior: "smooth", block: "center" });
        requestAnimationFrame(() => emailInput1.focus({ preventScroll: true }));
      });
    });
  }

  // Proof Image Modal Listeners
  if (proofImageLinks.length) {
    proofImageLinks.forEach((link) => {
      link.addEventListener('click', openImageModal);
    });
  } else {
    console.warn("Proof image links not found.");
  }

  if (imageModalClose) {
    imageModalClose.addEventListener('click', closeImageModal);
  } else {
    console.warn("Image modal close button not found.");
  }

  if (imageModal) {
    imageModal.addEventListener('click', (event) => {
      if (event.target === imageModal) {
        closeImageModal();
      }
    });
  } else {
    console.warn("Image modal container not found.");
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && imageModal && imageModal.classList.contains('active')) {
      closeImageModal();
    }
  });

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', (!expanded).toString());
      navMenu.classList.toggle('active');
    });
    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  } else {
    console.warn("Navigation toggle/menu not found.");
  }

}); // End DOMContentLoaded listener
