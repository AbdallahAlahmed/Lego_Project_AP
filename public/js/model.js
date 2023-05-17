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

// LOGIN
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  })
  .then(response => {
    if (response.ok) {
      alert("Login successful!");
      window.location.href = "/home"; // Redirect to homepage
    } else {
      alert("Login failed. Please try again.");
    }
  })
  .catch(error => {
    console.error(error);
    alert("An error occurred. Please try again later.");
  });
}

function register() {
  const username = document.getElementById("regUsername").value;
  const password = document.getElementById("regPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match. Please try again.");
    return;
  }

  fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  })
  .then(response => {
    if (response.ok) {
      alert("Registration successful!");
      document.getElementById("check").checked = false; // Close registration form
    } else {
      alert("Registration failed. Please try again.");
    }
  })
  .catch(error => {
    console.error(error);
    alert("An error occurred. Please try again later.");
  });
}
