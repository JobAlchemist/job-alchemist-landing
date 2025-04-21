const emailInput1 = document.getElementById("email-input1");
const signupButton1 = document.getElementById("signup-button1");
const message1 = document.getElementById("signup-message1");

const emailInput2 = document.getElementById("email-input2");
const signupButton2 = document.getElementById("signup-button2");
const message2 = document.getElementById("signup-message2");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Function to handle signup logic
function handleSignup(emailInput, message) {
  const email = emailInput.value;

  if (!email) {
    alert("Please enter an email address.");
    return;
  }

   // Reset message
   message.style.display = "none";
   message.textContent = "";
   message.style.color = "";

  if (!emailRegex.test(email)) {
    message.textContent = "Please enter a valid email address.";
    message.style.color = "red";
    message.style.display = "block";
    return;
  }

  fetch("https://script.google.com/macros/s/AKfycbzpHbuR_8vcZVVdwxHGZmRTSRejPexBpn0pOc5MyYO2rN0wAAHl4LBRxEfCFJG1DVhusw/exec", {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `email=${encodeURIComponent(email)}`
  })
  .then(() => {
    message.textContent = "🎉 You're on the list! Check your inbox soon.";
    message.style.color = "green";
    message.style.display = "block";
    emailInput.value = "";
  })
  .catch(() => {
    message.textContent = "Oops! Something went wrong.";
    message.style.color = "red";
    message.style.display = "block";
  });
}

// Add event listeners for both buttons
signupButton1.addEventListener("click", () => handleSignup(emailInput1, message1));
signupButton2.addEventListener("click", () => handleSignup(emailInput2, message2));