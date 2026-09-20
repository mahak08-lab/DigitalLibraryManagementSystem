const API_BASE_URL = "http://localhost:8080";

document.addEventListener("DOMContentLoaded", function () {
    loadIssuedBooks();
});

async function loadIssuedBooks() {

    const loadingState = document.getElementById("loadingState");
    const tableContainer = document.getElementById("issuedBooksTableContainer");
    const emptyState = document.getElementById("emptyState");
    const errorMessage = document.getElementById("errorMessage");
    const tableBody = document.getElementById("issuedBooksTableBody");
    const count = document.getElementById("issuedBookCount");

    // Show loading state
    loadingState.style.display = "block";
    tableContainer.style.display = "none";
    emptyState.style.display = "none";
    errorMessage.style.display = "none";

    // Get JWT token from both storages
    // Remember Me checked    -> localStorage
    // Remember Me unchecked  -> sessionStorage
    const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

    // No token found
    if (!token) {

        loadingState.style.display = "none";

        errorMessage.textContent =
            "Your login session could not be found. Please login again.";

        errorMessage.style.display = "block";

        return;
    }

    try {

        const response = await fetch(
            API_BASE_URL + "/api/loans/issued",
            {
                method: "GET",

                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                }
            }
        );

        // Unauthorized
        if (response.status === 401) {

            loadingState.style.display = "none";

            errorMessage.textContent =
                "Your login session has expired. Please login again.";

            errorMessage.style.display = "block";

            // Remove invalid token
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");

            return;
        }

        // Forbidden
        if (response.status === 403) {

            loadingState.style.display = "none";

            errorMessage.textContent =
                "Access denied. Please login with an administrator account.";

            errorMessage.style.display = "block";

            return;
        }

        // Other server errors
        if (!response.ok) {

            throw new Error(
                "Unable to load issued books. HTTP Status: " +
                response.status
            );
        }

        const issuedBooks = await response.json();

        // Stop loading
        loadingState.style.display = "none";

        // Update count
        count.textContent =
            issuedBooks.length + " issued";

        // No issued books
        if (issuedBooks.length === 0) {

            emptyState.style.display = "block";

            return;
        }

        // Clear previous rows
        tableBody.innerHTML = "";

        // Create table rows
        issuedBooks.forEach(function (loan) {

            const row = document.createElement("tr");

            row.innerHTML =
                "<td>#" +
                    escapeHtml(loan.id) +
                "</td>" +

                "<td>" +
                    "<strong>" +
                        escapeHtml(loan.userName) +
                    "</strong><br>" +

                    "<small>" +
                        "Member ID: " +
                        escapeHtml(loan.userId) +
                    "</small>" +
                "</td>" +

                "<td>" +
                    "<strong>" +
                        escapeHtml(loan.bookTitle) +
                    "</strong><br>" +

                    "<small>" +
                        "Book ID: " +
                        escapeHtml(loan.bookId) +
                    "</small>" +
                "</td>" +

                "<td>" +
                    formatDate(loan.issuedAt) +
                "</td>" +

                "<td>" +
                    formatDate(loan.dueDate) +
                "</td>" +

                "<td>₹" +
                    Number(loan.fineAmount || 0).toFixed(2) +
                "</td>" +

                "<td>" +
                    (
                        loan.finePaid

                        ?

                        '<span class="badge text-bg-success">' +
                            '<i class="bi bi-check-circle me-1"></i>' +
                            'Paid' +
                        '</span>'

                        :

                        '<span class="badge text-bg-warning">' +
                            '<i class="bi bi-exclamation-circle me-1"></i>' +
                            'Unpaid' +
                        '</span>'
                    ) +
                "</td>" +

                "<td>" +
                    '<span class="badge text-bg-primary">' +
                        escapeHtml(loan.status) +
                    "</span>" +
                "</td>";

            tableBody.appendChild(row);
        });

        // Show table
        tableContainer.style.display = "block";

    } catch (error) {

        console.error(
            "Error loading issued books:",
            error
        );

        loadingState.style.display = "none";

        errorMessage.textContent =
            "Unable to load issued books. Please make sure the backend is running.";

        errorMessage.style.display = "block";
    }
}


/*
 * Format date
 */
function formatDate(dateValue) {

    if (!dateValue) {
        return "-";
    }

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


/*
 * Escape HTML
 *
 * Prevents unexpected HTML from being inserted
 * into the table when displaying backend data.
 */
function escapeHtml(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}