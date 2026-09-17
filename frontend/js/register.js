const API_BASE_URL = "https://digitallibrarymanagementsystem-production-a092.up.railway.app";

document
    .getElementById("registerForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const errorBox = document.getElementById("registerError");
        const successBox = document.getElementById("registerSuccess");

        // Clear previous messages
        errorBox.classList.add("d-none");
        successBox.classList.add("d-none");

        // Frontend validation
        if (password !== confirmPassword) {

            errorBox.textContent = "Passwords do not match.";
            errorBox.classList.remove("d-none");

            return;
        }

        try {

            const response = await fetch(
                `${API_BASE_URL}/api/users/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                errorBox.textContent =
                    data.message || "Registration failed.";

                errorBox.classList.remove("d-none");

                return;
            }

            // Registration successful
            successBox.textContent =
                "Account created successfully! Redirecting to login...";

            successBox.classList.remove("d-none");

            // Clear form
            document.getElementById("registerForm").reset();

            // Redirect to login
            setTimeout(function () {

                window.location.href = "login.html";

            }, 1500);

        } catch (error) {

            console.error("Registration error:", error);

            errorBox.textContent =
                "Unable to connect to the server. Please make sure the Spring Boot application is running.";

            errorBox.classList.remove("d-none");
        }
    });