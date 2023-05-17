// W3Schools code
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");
var btn2 = document.getElementById("myBtn2");
var btn3 = document.getElementById("myBtn3");
var btn4 = document.getElementById("myBtn4");
var btn5 = document.getElementById("myBtn5");
var btn6 = document.getElementById("myBtn6");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

btn2.onclick = function() {
    modal.style.display = "block";
  }
  
btn3.onclick = function() {
    modal.style.display = "block";
  }
  
btn4.onclick = function() {
    modal.style.display = "block";
  }
  
btn5.onclick = function() {
    modal.style.display = "block";
  }

  btn6.onclick = function() {
    modal.style.display = "block";
  }

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
//LOGIN

/* ======================================================================
  Author Custom JavaScript
====================================================================== */

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const storedData = localStorage.getItem("registrationData");

  if (storedData) {
    const registrationData = JSON.parse(storedData);

    if (registrationData.username === username && registrationData.password === password) {
      alert("Login successful!");
      window.location.href = "/home"; // Redirect to dashboard page
    } else {
      alert("Login failed. Please try again.");
    }
  } else {
    alert("No registration data found. Please register first.");
  }
}

function register() {
  const username = document.getElementById("regUsername").value;
  const password = document.getElementById("regPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match. Please try again.");
    return;
  }

  const registrationData = {
    username: username,
    password: password
  };

  localStorage.setItem("registrationData", JSON.stringify(registrationData));
  alert("Registration successful!");
  document.getElementById("check").checked = false; // Close registration form
}
