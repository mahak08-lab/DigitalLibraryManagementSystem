
const API_BASE_URL = "https://digitallibrarymanagementsystem-production-a092.up.railway.app";


// ===============================
// Get JWT Token
// ===============================
function getToken() {
    return (
        localStorage.getItem("token") ||
        sessionStorage.getItem("token")
    );
}


// ===============================
// Load Advance Bookings
// ===============================
async function loadBookings() {

    const loadingState =
        document.getElementById("loadingState");

    const errorMessage =
        document.getElementById("errorMessage");

    const emptyState =
        document.getElementById("emptyState");

    const tableContainer =
        document.getElementById("bookingsTableContainer");

    const tableBody =
        document.getElementById("bookingsTableBody");


    // Reset states
    loadingState.style.display = "block";
    errorMessage.style.display = "none";
    emptyState.style.display = "none";
    tableContainer.style.display = "none";

    tableBody.innerHTML = "";


    // Get token
    const token = getToken();


    if (!token) {

        loadingState.style.display = "none";

        errorMessage.textContent =
            "Please login as administrator.";

        errorMessage.style.display = "block";

        return;
    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/api/bookings`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );


        // Handle unauthorized access
        if (response.status === 401 ||
            response.status === 403) {

            loadingState.style.display = "none";

            errorMessage.textContent =
                "You are not authorized to view advance bookings.";

            errorMessage.style.display = "block";

            return;
        }


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Booking API error:",
                errorText
            );

            loadingState.style.display = "none";

            errorMessage.textContent =
                "Unable to load advance bookings.";

            errorMessage.style.display = "block";

            return;
        }


        const bookings =
            await response.json();


        console.log(
            "Advance bookings:",
            bookings
        );


        loadingState.style.display = "none";


        // ===============================
        // Summary
        // ===============================

        const totalBookings =
            bookings.length;

        const waitingBookings =
            bookings.filter(
                booking =>
                    String(booking.status)
                        .toUpperCase() === "WAITING"
            ).length;

        const completedBookings =
            bookings.filter(
                booking =>
                    String(booking.status)
                        .toUpperCase() === "COMPLETED"
            ).length;


        document.getElementById(
            "totalBookings"
        ).textContent = totalBookings;


        document.getElementById(
            "waitingBookings"
        ).textContent = waitingBookings;


        document.getElementById(
            "completedBookings"
        ).textContent = completedBookings;


        // ===============================
        // No bookings
        // ===============================

        if (!Array.isArray(bookings) ||
            bookings.length === 0) {

            emptyState.style.display = "block";

            return;
        }


        // ===============================
        // Table
        // ===============================

        bookings.forEach(booking => {

            const row =
                document.createElement("tr");


            const status =
                String(booking.status || "")
                    .toUpperCase();


            let statusClass =
                "bg-secondary";


            if (status === "WAITING") {
                statusClass = "bg-warning text-dark";
            }

            else if (status === "COMPLETED") {
                statusClass = "bg-success";
            }

            else if (status === "CANCELLED") {
                statusClass = "bg-danger";
            }


            const bookingDate =
                formatDate(booking.bookingDate)


            row.innerHTML = `
                <td>
                    <strong>#${escapeHtml(booking.id)}</strong>
                </td>

                <td>
                    <div class="fw-semibold">
                        ${escapeHtml(
                            booking.userName || "Unknown"
                        )}
                    </div>

                    <small class="text-muted">
                        User ID: ${escapeHtml(
                            booking.userId ?? "-"
                        )}
                    </small>
                </td>

                <td>
                    <div class="fw-semibold">
                        ${escapeHtml(
                            booking.bookTitle || "Unknown Book"
                        )}
                    </div>

                    <small class="text-muted">
                        Book ID: ${escapeHtml(
                            booking.bookId ?? "-"
                        )}
                    </small>
                </td>

                <td>
                    ${bookingDate}
                </td>

                <td>
                    <span class="badge ${statusClass}">
                        ${escapeHtml(status || "UNKNOWN")}
                    </span>
                </td>
            `;


            tableBody.appendChild(row);
        });


        document.getElementById(
            "bookingCountBadge"
        ).textContent =
            `${bookings.length} booking${
                bookings.length === 1 ? "" : "s"
            }`;


        tableContainer.style.display = "block";


    } catch (error) {

        console.error(
            "Load bookings error:",
            error
        );

        loadingState.style.display = "none";

        errorMessage.textContent =
            "Unable to connect to the server. Please make sure the Spring Boot application is running.";

        errorMessage.style.display = "block";
    }
}


// ===============================
// Format Date
// ===============================
function formatDate(dateValue) {

    if (!dateValue) {
        return "-";
    }


    const date =
        new Date(dateValue);


    if (Number.isNaN(date.getTime())) {
        return escapeHtml(String(dateValue));
    }


    return date.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


// ===============================
// Escape HTML
// ===============================
function escapeHtml(value) {

    if (value === null ||
        value === undefined) {

        return "";
    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ===============================
// Logout
// ===============================
function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userEmail");

    window.location.href = "login.html";
}


// ===============================
// Load bookings when page opens
// ===============================
document.addEventListener(
    "DOMContentLoaded",
    loadBookings
);

