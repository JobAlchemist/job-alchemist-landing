const emailInput1 = document.getElementById("email-input1");
const signupButton1 = document.getElementById("signup-button1");
const message1 = document.getElementById("signup-message1");

const emailInput2 = document.getElementById("email-input2");
const signupButton2 = document.getElementById("signup-button2");
const message2 = document.getElementById("signup-message2");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Function to handle signup logic
// Added 'event' parameter to know which button was clicked
function handleSignup(event, emailInput, message) {
  const button = event.target; // Get the specific button that was clicked
  const originalButtonText = button.textContent; // Store the original button text
  const email = emailInput.value;

  if (!email) {
    alert("Please enter an email address.");
    return; // Exit if no email
  }

   // Reset message styling and content
   message.style.display = "none";
   message.textContent = "";
   message.style.color = ""; // Reset color

  if (!emailRegex.test(email)) {
    message.textContent = "Please enter a valid email address.";
    message.style.color = "red";
    message.style.display = "block";
    return; // Exit if email is invalid
  }

  // --- Indicate Processing ---
  button.disabled = true; // Disable the button
  button.textContent = "Processing..."; // Change button text
  // Optional: You could add a CSS class here for more styling (e.g., adding a spinner)
  // button.classList.add('processing');

  fetch("https://script.google.com/macros/s/AKfycbzpHbuR_8vcZVVdwxHGZmRTSRejPexBpn0pOc5MyYO2rN0wAAHl4LBRxEfCFJG1DVhusw/exec", {
    method: "POST",
    mode: "no-cors", // Important: 'no-cors' means JS won't see the actual response status
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `email=${encodeURIComponent(email)}`
  })
  .then(() => {
    // With 'no-cors', .then() executes if the request could be sent,
    // regardless of the actual server success/failure.
    // We assume success here if no network error occurred.
    message.textContent = "🎉 You're on the list! Check your inbox soon.";
    message.style.color = "green";
    message.style.display = "block";
    emailInput.value = ""; // Clear the input field on success
  })
  .catch((error) => {
    // This catches network errors (e.g., server down, DNS issues)
    console.error("Signup Fetch Error:", error); // Log error for debugging
    message.textContent = "Oops! Something went wrong. Please try again.";
    message.style.color = "red";
    message.style.display = "block";
  })
  .finally(() => {
    // --- Reset Button State (runs after .then() or .catch()) ---
    button.disabled = false; // Re-enable the button
    button.textContent = originalButtonText; // Restore original text
    // Optional: Remove the processing class if you added one
    // button.classList.remove('processing');
  });
}

// Add event listeners for both buttons
signupButton1.addEventListener("click", (event) => handleSignup(event, emailInput1, message1));
signupButton2.addEventListener("click", (event) => handleSignup(event, emailInput2, message2));