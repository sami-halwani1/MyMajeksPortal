// script.js

// Function to validate credentials from a JSON file
async function validateCredentials(username, password) {
    try {
        // Fetch the JSON file
        const response = await fetch('/tempUserList.json'); // Update the path to your JSON file
        if (!response.ok) {
            throw new Error('Failed to load tempUserList.json');
        }

        // Parse the JSON data
        const data = await response.json();

        // Search for a matching username and password in ghost-users
        const ghostUser = data["ghost-users"].find(
            user => user.username === username && user.password === password
        );

        // Search for a matching username and password in users
        const regularUser = data["users"].find(
            user => user.username === username && user.password === password
        );

        // Return the matching user object or null if no match is found
        return ghostUser || regularUser || null;
    } catch (error) {
        console.error('Error validating credentials:', error);
        return null;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Handle form submission
    const form = document.querySelector("form");
    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault(); // Prevent the default form submission

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            const user = await validateCredentials(username, password);

            // Example: Validate credentials locally
            if (user) {
                // Set the isLoggedIn cookie with an expiration time of 1 day
                document.cookie = `isLoggedIn=true; path=/; max-age=86400`;
                // alert(`Welcome, ${user.username}! Role: ${user.role}`);
                document.cookie = `username=${user.username}; path=/; max-age=86400`; // Store username in cookie
                window.location.href = "/pages/main.html"; // Redirect to dashboard
            } else {
                console.log("Invalid username or password."); // Debugging
                let errorMessage = document.getElementById("error-message");
                if (!errorMessage) {
                    errorMessage = document.createElement("div");
                    errorMessage.id = "error-message";
                    errorMessage.style.color = "red";
                    errorMessage.style.marginTop = "10px";
                    form.appendChild(errorMessage); // Add the error message at the end of the form
                }
                errorMessage.textContent = "Invalid username or password.";
                // Add fade-out effect after 3 seconds
                setTimeout(() => {
                    errorMessage.classList.add("fade-out");
                    errorMessage.addEventListener("animationend", () => {
                        errorMessage.remove();
                    });
                }, 3000); // 3 seconds delay
            }
        });
    }

    // Check if the user is logged in
    if (window.location.pathname.endsWith("/pages/main.html")) {
        const isLoggedIn = getCookie("isLoggedIn");
        console.log("isLoggedIn:", isLoggedIn); // Debugging

        if (isLoggedIn !== "true") {
            // alert("You must log in first!");
            window.location.href = "/index.html"; // Redirect to login page
        }
    }

    // Load dynamic content
    const dynamicContent = document.getElementById('dynamic-content');
    if (dynamicContent) {
        // Get the hash value from the URL
        const hash = window.location.hash.substring(1); // Remove the '#' character

        // Determine the content to load based on the hash value
        const section = hash || 'home'; // Default to 'home' if no hash is present

        // Fetch the content for the specified section
        fetch(`${section}.html`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(html => {
                dynamicContent.innerHTML = html;
            })
            .catch(error => {
                dynamicContent.innerHTML = "<p>Content not found.</p>";
                console.error('Error loading content:', error);
            });

        // Add event listeners for sidebar links
        document.querySelectorAll('.sidebar nav ul li a').forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default link behavior
                const section = event.target.getAttribute('href').substring(1);

                // Update the URL hash
                window.location.hash = section;

                // Fetch the content for the clicked section
                fetch(`${section}.html`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.text();
                    })
                    .then(html => {
                        dynamicContent.innerHTML = html;
                    })
                    .catch(error => {
                        dynamicContent.innerHTML = "<p>Content not found.</p>";
                        console.error('Error loading content:', error);
                    });
            });
        });
    }
});

function logout() {
    // Clear the isLoggedIn cookie
    document.cookie = "isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = "username=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC"; // Clear username cookie
    window.location.href = "/index.html"; // Redirect to login page
}

// Helper function to get a cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(";").shift();
    }
    return null;
}
document.addEventListener("DOMContentLoaded", () => {
    const username = getCookie("username");
    if (username) {
      document.getElementById("username").textContent = username;
    } else {
      document.getElementById("username").textContent = "Guest";
    }
  });

if (window.location.pathname.endsWith("/login.html")) {
    document.addEventListener("DOMContentLoaded", () => {
        const passwordInput = document.getElementById("password");
        const togglePasswordCheckbox = document.getElementById("toggle-password");

        // Add an event listener to the checkbox
        togglePasswordCheckbox.addEventListener("change", () => {
            // Toggle the password input type between "password" and "text"
            if (togglePasswordCheckbox.checked) {
                passwordInput.type = "text"; // Show password
            } else {
                passwordInput.type = "password"; // Hide password
            }
        });
    });
}