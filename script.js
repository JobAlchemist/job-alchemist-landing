// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

  // --- Signup Form Elements ---
  const emailInput1 = document.getElementById("email-input1");
  const signupButton1 = document.getElementById("signup-button1");
  const message1 = document.getElementById("signup-message1");

  const emailInput2 = document.getElementById("email-input2");
  const signupButton2 = document.getElementById("signup-button2");
  const message2 = document.getElementById("signup-message2");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // --- Video Modal Elements ---
  const openModalLink = document.getElementById('play-video-link'); // Link that opens the modal
  const closeModalBtn = document.getElementById('close-modal-btn'); // Button inside the modal to close it
  const modal = document.getElementById('video-modal');             // The modal overlay div
  const videoIframe = modal ? modal.querySelector('iframe') : null; // The iframe holding the video
  const originalVideoSrc = videoIframe ? videoIframe.src : '';      // Store the original video src
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

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

  // --- Video Modal Functions ---
  function openModal(event) {
    // Prevent the default link behavior (e.g., navigating to '#')
    if(event) event.preventDefault();

    if (modal && videoIframe) {
      // Ensure the video source is set correctly before showing, especially if it was cleared on close
      if (videoIframe.src !== originalVideoSrc && originalVideoSrc) {
          videoIframe.src = originalVideoSrc;
      }
      modal.style.display = 'flex'; // Use flex to enable centering defined in CSS
      // Use a tiny timeout to allow the 'display' change to render before starting the transition
      setTimeout(() => {
          modal.classList.add('active'); // Add class to trigger opacity/transform transitions
      }, 10);
    } else {
      console.error("Modal container or video iframe element not found!");
    }
  }

  function closeModal() {
    if (modal && videoIframe) {
      modal.classList.remove('active'); // Remove class to trigger fade-out transition
      // Wait for the fade-out transition to finish before hiding and stopping the video
      setTimeout(() => {
          modal.style.display = 'none'; // Hide the modal completely
          // Stop the video playback by removing the src attribute (most reliable method)
          videoIframe.src = '';
          // Note: We restore the src in openModal to avoid unnecessary loading if the modal isn't opened again.
      }, 300); // This duration should match the transition duration in your CSS (e.g., 0.3s)
    }
  }

  // --- Add Event Listeners ---

  // Signup Button Listeners
  if (signupButton1 && emailInput1 && message1) {
    signupButton1.addEventListener("click", (event) => handleSignup(event, emailInput1, message1));
  } else {
    console.warn("Signup form 1 elements not found.");
  }

  if (signupButton2 && emailInput2 && message2) {
    signupButton2.addEventListener("click", (event) => handleSignup(event, emailInput2, message2));
  } else {
    console.warn("Signup form 2 elements not found.");
  }

  // Video Modal Listeners
  if (openModalLink) {
    openModalLink.addEventListener('click', openModal);
  } else {
    console.warn("Video trigger link ('play-video-link') not found.");
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  } else {
    console.warn("Modal close button ('close-modal-btn') not found.");
  }

  // Listener to close modal when clicking on the overlay background
  if (modal) {
    modal.addEventListener('click', (event) => {
      // Check if the click is directly on the modal overlay itself (the dark background)
      if (event.target === modal) {
        closeModal();
      }
    });
  } else {
     console.warn("Modal container ('video-modal') not found for background click listener.");
  }

  // Listener to close modal with the Escape key
  document.addEventListener('keydown', (event) => {
      // Check if the modal exists, is currently active (visible), and the Escape key was pressed
      if (event.key === 'Escape' && modal && modal.classList.contains('active')) {
          closeModal();
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
