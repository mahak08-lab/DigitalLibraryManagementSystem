const API_BASE_URL = "http://digitallibrarymanagementsystem-production-a092.up.railway.app";

document
    .getElementById("loginForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const errorBox = document.getElementById("loginError");
        const loginButton = document.querySelector(".login-btn");

        // Clear previous error
        errorBox.classList.add("d-none");
        errorBox.textContent = "";

        // Show loading state
        loginButton.disabled = true;
        loginButton.innerHTML =
            '<span class="spinner-border spinner-border-sm me-2"></span>Signing in...';

        try {

            // Send login request to Spring Boot backend
            const response = await fetch(
                `${API_BASE_URL}/api/users/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            // Check backend response
            if (!response.ok) {

                errorBox.textContent =
                    data.message || "Invalid email or password.";

                errorBox.classList.remove("d-none");

                return;
            }

            // Get JWT token
            const token = data.token;

            // Get user role
            const role = String(data.role || "")
                .replace("ROLE_", "")
                .toUpperCase();

            // Debug information
            console.log("LOGIN RESPONSE:", data);
            console.log("JWT TOKEN:", data.token);
            console.log("ROLE:", data.role);

            // Validate login response
            if (!token || !role) {

                errorBox.textContent =
                    "Login failed. Invalid response from server.";

                errorBox.classList.remove("d-none");

                return;
            }

            // -------------------------------------------------
            // Clear old authentication information
            // -------------------------------------------------

            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("userName");
            localStorage.removeItem("userEmail");

            sessionStorage.removeItem("token");
            sessionStorage.removeItem("role");
            sessionStorage.removeItem("userName");
            sessionStorage.removeItem("userEmail");


            // -------------------------------------------------
            // Save current login information
            // -------------------------------------------------
            // Token is always stored in localStorage because
            // all protected pages in this project read the JWT
            // from localStorage.
            // -------------------------------------------------

            localStorage.setItem("token", token);
            localStorage.setItem("role", role);

            if (data.name) {
                localStorage.setItem("userName", data.name);
            }

            if (data.email) {
                localStorage.setItem("userEmail", data.email);
            }


            // -------------------------------------------------
            // Redirect based on role
            // -------------------------------------------------

            if (role === "ADMIN") {

                console.log("Admin login successful.");

                window.location.href = "admin-dashboard.html";

            } else if (role === "USER") {

                console.log("User login successful.");

                window.location.href = "user-dashboard.html";

            } else {

                // Unknown role
                errorBox.textContent =
                    "Unknown user role. Please contact the administrator.";

                errorBox.classList.remove("d-none");

            }

        } catch (error) {

            console.error("Login error:", error);

            errorBox.textContent =
                "Unable to connect to the server. Please make sure the Spring Boot application is running.";

            errorBox.classList.remove("d-none");

        } finally {

            // Restore login button
            loginButton.disabled = false;

            loginButton.innerHTML =
                '<i class="bi bi-box-arrow-in-right"></i> Sign In';
        }

    });