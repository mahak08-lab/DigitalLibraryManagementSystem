
const API_BASE_URL = "http://digitallibrarymanagementsystem-production-a092.up.railway.app";

document.addEventListener("DOMContentLoaded", function () {
    loadQueries();
});


// ==========================================
// LOAD ALL MEMBER QUERIES
// ==========================================

async function loadQueries() {

    const loadingState =
        document.getElementById("loadingState");

    const tableContainer =
        document.getElementById("queriesTableContainer");

    const emptyState =
        document.getElementById("emptyState");

    const errorMessage =
        document.getElementById("errorMessage");


    loadingState.style.display = "block";
    tableContainer.style.display = "none";
    emptyState.style.display = "none";
    errorMessage.style.display = "none";


    // Get JWT from either storage
    const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");


    if (!token) {

        loadingState.style.display = "none";

        errorMessage.textContent =
            "Please login as administrator.";

        errorMessage.style.display = "block";

        return;
    }


    try {

        const response = await fetch(
            API_BASE_URL + "/api/contact",
            {
                method: "GET",

                headers: {
                    "Authorization":
                        "Bearer " + token
                }
            }
        );


        const responseText =
            await response.text();


        if (!response.ok) {

            console.error(
                "Load queries error:",
                responseText
            );

            let message =
                "Unable to load member queries.";

            try {

                const errorData =
                    JSON.parse(responseText);

                if (errorData.message) {
                    message =
                        errorData.message;
                }

            } catch (error) {

                console.error(
                    "Unable to parse error response:",
                    error
                );
            }

            throw new Error(message);
        }


        const queries =
            responseText
                ? JSON.parse(responseText)
                : [];


        console.log(
            "Queries received:",
            queries
        );


        loadingState.style.display = "none";


        // ==========================================
        // SUMMARY COUNTS
        // ==========================================

        document.getElementById("totalQueries")
            .textContent = queries.length;


        const pendingQueries =
            queries.filter(function (query) {

                return !query.resolved;

            });


        const resolvedQueries =
            queries.filter(function (query) {

                return query.resolved;

            });


        document.getElementById("pendingQueries")
            .textContent =
            pendingQueries.length;


        document.getElementById("resolvedQueries")
            .textContent =
            resolvedQueries.length;


        document.getElementById("queryCountBadge")
            .textContent =
            queries.length + " records";


        // ==========================================
        // EMPTY STATE
        // ==========================================

        if (queries.length === 0) {

            emptyState.style.display = "block";

            return;
        }


        // ==========================================
        // BUILD TABLE
        // ==========================================

        const tableBody =
            document.getElementById(
                "queriesTableBody"
            );


        tableBody.innerHTML = "";


        queries.forEach(function (query) {

            const row =
                document.createElement("tr");


            // --------------------------------------
            // STATUS BADGE
            // --------------------------------------

            let statusBadge;


            if (query.resolved) {

                statusBadge =
                    '<span class="badge text-bg-success">' +
                    '<i class="bi bi-check-circle me-1"></i>' +
                    'Resolved' +
                    '</span>';

            } else {

                statusBadge =
                    '<span class="badge text-bg-warning">' +
                    '<i class="bi bi-hourglass-split me-1"></i>' +
                    'Pending' +
                    '</span>';
            }


            // --------------------------------------
            // ACTION
            // --------------------------------------

            let actionButton;


            if (query.resolved) {

                actionButton =
                    '<span class="text-success">' +
                    '<i class="bi bi-check2-circle me-1"></i>' +
                    'Completed' +
                    '</span>';

            } else {

                actionButton =
                    '<button ' +
                    'class="btn btn-sm btn-success" ' +
                    'onclick="markQueryResolved(' +
                    query.id +
                    ')">' +
                    '<i class="bi bi-check-lg me-1"></i>' +
                    'Mark Resolved' +
                    '</button>';
            }


            // --------------------------------------
            // TABLE ROW
            // --------------------------------------

            row.innerHTML =

                "<td>" +
                    "<strong>#" +
                    query.id +
                    "</strong>" +
                "</td>" +


                "<td>" +
                    "<strong>" +
                    escapeHtml(query.name) +
                    "</strong><br>" +

                    "<small class=\"text-muted\">" +
                    escapeHtml(query.email) +
                    "</small>" +
                "</td>" +


                "<td>" +
                    "<strong>" +
                    escapeHtml(query.subject) +
                    "</strong>" +
                "</td>" +


                "<td style=\"min-width: 300px; max-width: 450px;\">" +

                    "<div class=\"text-wrap\">" +
                    escapeHtml(query.message) +
                    "</div>" +

                "</td>" +


                "<td>" +
                    formatDate(query.submittedAt) +
                "</td>" +


                "<td>" +
                    statusBadge +
                "</td>" +


                "<td>" +
                    actionButton +
                "</td>";


            tableBody.appendChild(row);

        });


        tableContainer.style.display = "block";


    } catch (error) {

        console.error(
            "Error loading queries:",
            error
        );


        loadingState.style.display = "none";


        errorMessage.textContent =
            error.message ||
            "Unable to load member queries. " +
            "Please make sure the backend is running.";


        errorMessage.style.display = "block";
    }
}



// ==========================================
// MARK QUERY AS RESOLVED
// ==========================================

async function markQueryResolved(queryId) {

    const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");


    if (!token) {

        alert(
            "Please login as administrator."
        );

        return;
    }


    const confirmed =
        confirm(
            "Are you sure you want to mark this query as resolved?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response = await fetch(

            API_BASE_URL +
            "/api/contact/" +
            queryId +
            "/resolve",

            {
                method: "PATCH",

                headers: {
                    "Authorization":
                        "Bearer " + token
                }
            }
        );


        const responseText =
            await response.text();


        if (!response.ok) {

            console.error(
                "Resolve query error:",
                responseText
            );


            let message =
                "Unable to resolve the query.";


            try {

                const errorData =
                    JSON.parse(responseText);


                if (errorData.message) {

                    message =
                        errorData.message;
                }

            } catch (error) {

                console.error(
                    "Unable to parse error response:",
                    error
                );
            }


            alert(message);

            return;
        }


        alert(
            "Query marked as resolved successfully."
        );


        // Reload table
        loadQueries();


    } catch (error) {

        console.error(
            "Error resolving query:",
            error
        );


        alert(
            "Unable to connect to the server."
        );
    }
}



// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(dateValue) {

    if (!dateValue) {
        return "-";
    }


    const date =
        new Date(dateValue);


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



// ==========================================
// ESCAPE HTML
// Prevents user-submitted text from
// being interpreted as HTML
// ==========================================

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



// ==========================================
// LOGOUT
// ==========================================

function logout() {

    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    localStorage.removeItem("role");
    sessionStorage.removeItem("role");

    localStorage.removeItem("userName");
    sessionStorage.removeItem("userName");

    localStorage.removeItem("userEmail");
    sessionStorage.removeItem("userEmail");


    window.location.href =
        "login.html";
}

