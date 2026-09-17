const API_BASE_URL = "https://digitallibrarymanagementsystem-production-a092.up.railway.app";


// =====================================================
// GET TOKEN
// =====================================================

function getToken() {

    return localStorage.getItem("token") ||
           sessionStorage.getItem("token");

}


// =====================================================
// GET ROLE
// =====================================================

function getRole() {

    return localStorage.getItem("role") ||
           sessionStorage.getItem("role");

}


// =====================================================
// API REQUEST
// =====================================================

async function apiRequest(endpoint, options = {}) {

    const token = getToken();

    if (!token) {

        throw new Error("SESSION_EXPIRED");

    }


    const headers = {

        "Content-Type": "application/json",

        "Authorization": "Bearer " + token

    };


    // Allow additional headers if needed

    if (options.headers) {

        Object.assign(headers, options.headers);

    }


    let response;


    try {

        response = await fetch(
            API_BASE_URL + endpoint,
            {
                ...options,
                headers: headers
            }
        );

    } catch (error) {

        console.error("Network error:", error);

        throw new Error(
            "Unable to connect to the server. Please make sure Spring Boot is running."
        );

    }


    // =================================================
    // AUTHORIZATION ERROR
    // =================================================

    if (response.status === 401 ||
        response.status === 403) {

        throw new Error("SESSION_EXPIRED");

    }


    // =================================================
    // READ RESPONSE
    // =================================================

    const contentType =
        response.headers.get("content-type") || "";


    let data;


    if (contentType.includes("application/json")) {

        data = await response.json().catch(() => null);

    } else {

        data = await response.text().catch(() => "");

    }


    // =================================================
    // OTHER HTTP ERRORS
    // =================================================

    if (!response.ok) {

        let message = "Something went wrong.";


        if (data && typeof data === "object") {

            message =
                data.message ||
                data.error ||
                data.detail ||
                message;

        }


        if (typeof data === "string" && data.trim()) {

            message = data;

        }


        throw new Error(message);

    }


    return data;

}


// =====================================================
// LOAD USER INFORMATION
// =====================================================

function loadUserInformation() {

    const email =
        localStorage.getItem("userEmail") ||
        sessionStorage.getItem("userEmail");


    const name =
        localStorage.getItem("userName") ||
        sessionStorage.getItem("userName");


    const displayName =
        name || "Library User";


    const userNameElement =
        document.getElementById("userName");


    const welcomeNameElement =
        document.getElementById("welcomeUserName");


    if (userNameElement) {

        userNameElement.textContent =
            displayName;

    }


    if (welcomeNameElement) {

        welcomeNameElement.textContent =
            displayName;

    }

}


// =====================================================
// LOAD MY LOANS
// =====================================================

async function loadMyLoans() {

    const loansTableBody =
        document.getElementById("loansTableBody");


    if (!loansTableBody) {

        console.error(
            "ERROR: loansTableBody element not found."
        );

        return;

    }


    // Show loading state

    loansTableBody.innerHTML = `

        <tr>

            <td
                colspan="7"
                class="text-center py-5">

                <div class="dashboard-loading">

                    <div
                        class="spinner-border"
                        role="status">
                    </div>

                    <p class="mt-3 mb-0">
                        Loading your loans...
                    </p>

                </div>

            </td>

        </tr>

    `;


    try {

        console.log(
            "Loading loans from /api/loans/my..."
        );


        const loans =
            await apiRequest("/api/loans/my");


        console.log(
            "Loans received:",
            loans
        );


        // Clear loading state

        loansTableBody.innerHTML = "";


        // =================================================
        // NO LOANS
        // =================================================

        if (!Array.isArray(loans) ||
            loans.length === 0) {

            loansTableBody.innerHTML = `

                <tr>

                    <td
                        colspan="7"
                        class="text-center py-5">

                        <i
                            class="bi bi-journal-bookmark fs-1 d-block mb-3">
                        </i>

                        <strong>
                            No books issued yet.
                        </strong>

                        <p class="text-muted mb-0 mt-2">
                            Browse the catalogue to find your next book.
                        </p>

                    </td>

                </tr>

            `;


            updateElement(
                "activeLoansCount",
                "0"
            );


            updateElement(
                "dueSoonCount",
                "0"
            );


            updateElement(
                "fineAmount",
                "₹0.00"
            );


            return;

        }


        // =================================================
        // CALCULATIONS
        // =================================================

        let activeLoans = 0;

        let dueSoon = 0;

        let outstandingFine = 0;


        const today =
            new Date();


        // =================================================
        // CREATE LOAN ROWS
        // =================================================

        loans.forEach(function (loan) {


            // -----------------------------
            // ACTIVE LOAN
            // -----------------------------

            if (loan.status === "ISSUED") {

                activeLoans++;

            }


            // -----------------------------
            // FINE
            // -----------------------------

            const fine =
                Number(loan.fineAmount || 0);


            if (!loan.finePaid) {

                outstandingFine += fine;

            }


            // -----------------------------
            // DUE SOON
            // -----------------------------

            if (loan.status === "ISSUED" &&
                loan.dueDate) {


                const dueDate =
                    new Date(loan.dueDate);


                const difference =
                    dueDate.getTime() -
                    today.getTime();


                const daysRemaining =
                    difference /
                    (1000 * 60 * 60 * 24);


                if (daysRemaining >= 0 &&
                    daysRemaining <= 3) {

                    dueSoon++;

                }

            }


            // -----------------------------
            // TABLE ROW
            // -----------------------------

            const row =
                document.createElement("tr");


            const bookTitle =
                escapeHtml(
                    loan.bookTitle ||
                    "Unknown Book"
                );


            const issueDate =
                formatDate(
                    loan.issuedAt
                );


            const dueDate =
                formatDate(
                    loan.dueDate
                );


            const returnedDate =
                loan.returnedAt
                    ? formatDate(loan.returnedAt)
                    : "-";


            const fineText =
                "₹" +
                fine.toFixed(2);


            const statusBadge =
                getLoanStatusBadge(
                    loan.status
                );


            let actionHtml = "-";


            if (loan.status === "ISSUED") {

                actionHtml = `

                    <button
                        type="button"
                        class="btn btn-sm btn-primary"
                        onclick="returnBook(${loan.id})">

                        <i class="bi bi-arrow-return-left"></i>

                        Return

                    </button>

                `;

            }


            row.innerHTML = `

                <td>

                    <strong>
                        ${bookTitle}
                    </strong>

                </td>


                <td>
                    ${issueDate}
                </td>


                <td>
                    ${dueDate}
                </td>


                <td>
                    ${returnedDate}
                </td>


                <td>
                    ${fineText}
                </td>


                <td>
                    ${statusBadge}
                </td>


                <td>
                    ${actionHtml}
                </td>

            `;


            loansTableBody.appendChild(row);

        });


        // =================================================
        // UPDATE DASHBOARD STATS
        // =================================================

        updateElement(
            "activeLoansCount",
            activeLoans
        );


        updateElement(
            "dueSoonCount",
            dueSoon
        );


        updateElement(
            "fineAmount",
            "₹" +
            outstandingFine.toFixed(2)
        );


    } catch (error) {


        console.error(
            "Error loading loans:",
            error
        );


        // =================================================
        // SESSION EXPIRED
        // =================================================

        if (error.message === "SESSION_EXPIRED") {

            alert(
                "Your session has expired. Please login again."
            );


            logoutUser();

            return;

        }


        // =================================================
        // DISPLAY ERROR
        // =================================================

        loansTableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="text-center py-5 text-danger">

                    <i
                        class="bi bi-exclamation-circle fs-1 d-block mb-3">
                    </i>

                    <strong>
                        Unable to load your loans.
                    </strong>

                    <p class="mt-2 mb-0">
                        ${escapeHtml(error.message)}
                    </p>

                    <button
                        type="button"
                        class="btn btn-outline-primary btn-sm mt-3"
                        onclick="loadMyLoans()">

                        <i class="bi bi-arrow-clockwise"></i>
                        Try Again

                    </button>

                </td>

            </tr>

        `;

    }

}


// =====================================================
// LOAD MY BOOKINGS
// =====================================================

async function loadMyBookings() {

    const bookingsTableBody =
        document.getElementById(
            "bookingsTableBody"
        );


    if (!bookingsTableBody) {

        console.error(
            "ERROR: bookingsTableBody element not found."
        );

        return;

    }


    // Loading state

    bookingsTableBody.innerHTML = `

        <tr>

            <td
                colspan="4"
                class="text-center py-5">

                <div class="dashboard-loading">

                    <div
                        class="spinner-border"
                        role="status">
                    </div>

                    <p class="mt-3 mb-0">
                        Loading your bookings...
                    </p>

                </div>

            </td>

        </tr>

    `;


    try {

        console.log(
            "Loading bookings from /api/bookings/my..."
        );


        const bookings =
            await apiRequest(
                "/api/bookings/my"
            );


        console.log(
            "Bookings received:",
            bookings
        );


        bookingsTableBody.innerHTML = "";


        // =================================================
        // NO BOOKINGS
        // =================================================

        if (!Array.isArray(bookings) ||
            bookings.length === 0) {

            bookingsTableBody.innerHTML = `

                <tr>

                    <td
                        colspan="4"
                        class="text-center py-5">

                        <i
                            class="bi bi-calendar-x fs-1 d-block mb-3">
                        </i>

                        <strong>
                            No advance bookings found.
                        </strong>

                        <p class="text-muted mb-0 mt-2">
                            Books that are currently unavailable can be
                            reserved in advance.
                        </p>

                    </td>

                </tr>

            `;


            updateElement(
                "bookingCount",
                "0"
            );


            return;

        }


        // =================================================
        // UPDATE COUNT
        // =================================================

        updateElement(
            "bookingCount",
            bookings.length
        );


        // =================================================
        // CREATE BOOKING ROWS
        // =================================================

        bookings.forEach(function (booking) {


            const row =
                document.createElement("tr");


            const bookTitle =
                escapeHtml(
                    booking.bookTitle ||
                    "Unknown Book"
                );


            const bookingDate =
                formatDate(
                    booking.bookingDate
                );


            const statusBadge =
                getBookingStatusBadge(
                    booking.status
                );


            const bookingId =
                booking.id || "-";


            row.innerHTML = `

                <td>

                    <strong>
                        ${bookTitle}
                    </strong>

                </td>


                <td>
                    ${bookingDate}
                </td>


                <td>
                    ${statusBadge}
                </td>


                <td>
                    #${bookingId}
                </td>

            `;


            bookingsTableBody.appendChild(row);

        });


    } catch (error) {


        console.error(
            "Error loading bookings:",
            error
        );


        if (error.message === "SESSION_EXPIRED") {

            alert(
                "Your session has expired. Please login again."
            );


            logoutUser();

            return;

        }


        bookingsTableBody.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    class="text-center py-5 text-danger">

                    <i
                        class="bi bi-exclamation-circle fs-1 d-block mb-3">
                    </i>

                    <strong>
                        Unable to load your bookings.
                    </strong>

                    <p class="mt-2 mb-0">
                        ${escapeHtml(error.message)}
                    </p>

                    <button
                        type="button"
                        class="btn btn-outline-primary btn-sm mt-3"
                        onclick="loadMyBookings()">

                        <i class="bi bi-arrow-clockwise"></i>
                        Try Again

                    </button>

                </td>

            </tr>

        `;

    }

}


// =====================================================
// RETURN BOOK
// =====================================================

async function returnBook(loanId) {


    const confirmed =
        confirm(
            "Are you sure you want to return this book?"
        );


    if (!confirmed) {

        return;

    }


    try {


        await apiRequest(
            "/api/loans/" +
            loanId +
            "/return",
            {
                method: "POST"
            }
        );


        alert(
            "Book returned successfully."
        );


        // Reload dashboard data

        await loadMyLoans();

        await loadMyBookings();


    } catch (error) {


        console.error(
            "Return book error:",
            error
        );


        if (error.message === "SESSION_EXPIRED") {

            alert(
                "Your session has expired. Please login again."
            );


            logoutUser();

            return;

        }


        alert(
            error.message ||
            "Unable to return the book."
        );

    }

}


// =====================================================
// LOAN STATUS BADGE
// =====================================================

function getLoanStatusBadge(status) {


    switch (status) {


        case "ISSUED":

            return `

                <span class="status-badge status-issued">

                    <i class="bi bi-book"></i>
                    Issued

                </span>

            `;


        case "RETURNED":

            return `

                <span class="status-badge status-returned">

                    <i class="bi bi-check-circle"></i>
                    Returned

                </span>

            `;


        case "OVERDUE":

            return `

                <span class="status-badge status-overdue">

                    <i class="bi bi-exclamation-circle"></i>
                    Overdue

                </span>

            `;


        default:

            return `

                <span class="status-badge">

                    ${escapeHtml(
                        status ||
                        "Unknown"
                    )}

                </span>

            `;

    }

}


// =====================================================
// BOOKING STATUS BADGE
// =====================================================

function getBookingStatusBadge(status) {


    switch (status) {


        case "WAITING":

            return `

                <span class="status-badge status-waiting">

                    <i class="bi bi-hourglass-split"></i>
                    Waiting

                </span>

            `;


        case "FULFILLED":

            return `

                <span class="status-badge status-returned">

                    <i class="bi bi-check-circle"></i>
                    Fulfilled

                </span>

            `;


        case "CANCELLED":

            return `

                <span class="status-badge status-overdue">

                    <i class="bi bi-x-circle"></i>
                    Cancelled

                </span>

            `;


        default:

            return `

                <span class="status-badge">

                    ${escapeHtml(
                        status ||
                        "Unknown"
                    )}

                </span>

            `;

    }

}


// =====================================================
// FORMAT DATE
// =====================================================

function formatDate(dateString) {


    if (!dateString) {

        return "-";

    }


    const date =
        new Date(dateString);


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


// =====================================================
// UPDATE ELEMENT
// =====================================================

function updateElement(id, value) {


    const element =
        document.getElementById(id);


    if (element) {

        element.textContent = value;

    }

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(value) {


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// =====================================================
// CONTACT MODAL
// =====================================================

function openContactModal() {


    const modalElement =
        document.getElementById(
            "contactModal"
        );


    if (!modalElement) {

        return;

    }


    const modal =
        bootstrap.Modal.getOrCreateInstance(
            modalElement
        );


    modal.show();

}


// =====================================================
// CONTACT FORM
// =====================================================

async function submitContactQuery(event) {


    event.preventDefault();


    const subject =
        document
            .getElementById(
                "contactSubject"
            )
            .value
            .trim();


    const message =
        document
            .getElementById(
                "contactMessage"
            )
            .value
            .trim();


    const messageBox =
        document.getElementById(
            "contactMessageBox"
        );


    if (!subject || !message) {

        showContactMessage(
            "Please fill in all fields.",
            "danger"
        );

        return;

    }


    try {


        await apiRequest(
            "/api/contact",
            {
                method: "POST",

				
				body: JSON.stringify({
				    name:
				        localStorage.getItem("userName") ||
				        sessionStorage.getItem("userName"),

				    email:
				        localStorage.getItem("userEmail") ||
				        sessionStorage.getItem("userEmail"),

				    subject: subject,

				    message: message
				})
				

            }
        );


        showContactMessage(
            "Your query has been submitted successfully.",
            "success"
        );


        document
            .getElementById(
                "contactForm"
            )
            .reset();


        setTimeout(function () {


            const modalElement =
                document.getElementById(
                    "contactModal"
                );


            if (modalElement) {

                const modal =
                    bootstrap.Modal
                        .getInstance(
                            modalElement
                        );


                if (modal) {

                    modal.hide();

                }

            }


            messageBox.classList.add(
                "d-none"
            );


        }, 1500);


    } catch (error) {


        console.error(
            "Contact query error:",
            error
        );


        if (error.message === "SESSION_EXPIRED") {

            logoutUser();

            return;

        }


        showContactMessage(
            error.message ||
            "Unable to submit your query.",
            "danger"
        );

    }

}


// =====================================================
// SHOW CONTACT MESSAGE
// =====================================================

function showContactMessage(
    message,
    type
) {


    const messageBox =
        document.getElementById(
            "contactMessageBox"
        );


    if (!messageBox) {

        return;

    }


    messageBox.className =
        "alert alert-" +
        type;


    messageBox.textContent =
        message;


    messageBox.classList.remove(
        "d-none"
    );

}


// =====================================================
// LOGOUT
// =====================================================

function logoutUser() {


    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "role"
    );

    localStorage.removeItem(
        "userName"
    );

    localStorage.removeItem(
        "userEmail"
    );


    sessionStorage.removeItem(
        "token"
    );

    sessionStorage.removeItem(
        "role"
    );

    sessionStorage.removeItem(
        "userName"
    );

    sessionStorage.removeItem(
        "userEmail"
    );


    window.location.href =
        "login.html";

}


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        console.log(
            "User dashboard loaded."
        );


        const token =
            getToken();


        const role =
            getRole();


        console.log(
            "Token exists:",
            !!token
        );


        console.log(
            "Role:",
            role
        );


        // =================================================
        // CHECK LOGIN
        // =================================================

        if (!token) {

            console.warn(
                "No JWT token found. Redirecting to login."
            );


            window.location.href =
                "login.html";


            return;

        }


        // =================================================
        // CHECK ROLE
        // =================================================

        if (role !== "USER") {

            console.warn(
                "User role required. Current role:",
                role
            );


            window.location.href =
                "login.html";


            return;

        }


        // =================================================
        // LOAD USER INFO
        // =================================================

        loadUserInformation();


        // =================================================
        // LOAD DASHBOARD DATA
        // =================================================

        loadMyLoans();

        loadMyBookings();


        // =================================================
        // CONTACT FORM
        // =================================================

        const contactForm =
            document.getElementById(
                "contactForm"
            );


        if (contactForm) {

            contactForm.addEventListener(
                "submit",
                submitContactQuery
            );

        }

    }
);