
const API_BASE_URL = "http://localhost:8080";

document.addEventListener("DOMContentLoaded", function () {
    loadFines();
});


// ================= LOAD FINES =================

async function loadFines() {

    const loadingState = document.getElementById("loadingState");
    const tableContainer = document.getElementById("finesTableContainer");
    const emptyState = document.getElementById("emptyState");
    const errorMessage = document.getElementById("errorMessage");

    loadingState.style.display = "block";
    tableContainer.style.display = "none";
    emptyState.style.display = "none";
    errorMessage.style.display = "none";

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
            API_BASE_URL + "/api/admin/loans/fines",
            {
                method: "GET",

                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );


        if (!response.ok) {

            throw new Error(
                "Unable to load fine records."
            );
        }


        const fines = await response.json();

        loadingState.style.display = "none";


        // ================= SUMMARY =================

        document.getElementById("totalFineRecords")
            .textContent = fines.length;


        const unpaidFines = fines.filter(
            function (loan) {
                return !loan.finePaid;
            }
        );


        document.getElementById("unpaidFineRecords")
            .textContent = unpaidFines.length;


        const totalFine = fines.reduce(
            function (total, loan) {

                return total +
                    Number(loan.fineAmount || 0);

            },
            0
        );


        document.getElementById("totalFineAmount")
            .textContent =
            "₹" + totalFine.toFixed(2);


        document.getElementById("fineCountBadge")
            .textContent =
            fines.length + " records";


        // ================= EMPTY STATE =================

        if (fines.length === 0) {

            emptyState.style.display = "block";

            return;
        }


        // ================= TABLE =================

        const tableBody =
            document.getElementById("finesTableBody");

        tableBody.innerHTML = "";


        fines.forEach(function (loan) {

            const row =
                document.createElement("tr");


            let statusBadge;

            if (loan.finePaid) {

                statusBadge =
                    '<span class="badge text-bg-success">' +
                    '<i class="bi bi-check-circle me-1"></i>' +
                    'Paid' +
                    '</span>';

            } else {

                statusBadge =
                    '<span class="badge text-bg-warning">' +
                    '<i class="bi bi-exclamation-circle me-1"></i>' +
                    'Unpaid' +
                    '</span>';
            }


            let actionButton;

            if (loan.finePaid) {

                actionButton =
                    '<span class="text-success">' +
                    '<i class="bi bi-check2 me-1"></i>' +
                    'Completed' +
                    '</span>';

            } else {

                actionButton =
                    '<button ' +
                    'class="btn btn-sm btn-success" ' +
                    'onclick="markFineAsPaid(' +
                    loan.id +
                    ')">' +
                    '<i class="bi bi-cash-coin me-1"></i>' +
                    'Mark as Paid' +
                    '</button>';
            }


            row.innerHTML =

                "<td>" +
                    "<strong>#" +
                    loan.id +
                    "</strong>" +
                "</td>" +

                "<td>" +
                    "<strong>" +
                    loan.userName +
                    "</strong><br>" +
                    "<small class=\"text-muted\">" +
                    "Member ID: " +
                    loan.userId +
                    "</small>" +
                "</td>" +

                "<td>" +
                    "<strong>" +
                    loan.bookTitle +
                    "</strong><br>" +
                    "<small class=\"text-muted\">" +
                    "Book ID: " +
                    loan.bookId +
                    "</small>" +
                "</td>" +

                "<td>" +
                    formatDate(loan.dueDate) +
                "</td>" +

                "<td>" +
                    formatDate(loan.returnedAt) +
                "</td>" +

                "<td>" +
                    "<strong>₹" +
                    Number(loan.fineAmount || 0)
                        .toFixed(2) +
                    "</strong>" +
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
            "Error loading fines:",
            error
        );

        loadingState.style.display = "none";

        errorMessage.textContent =
            "Unable to load fine records. " +
            "Please make sure the backend is running.";

        errorMessage.style.display = "block";
    }
}



// ================= MARK FINE AS PAID =================

async function markFineAsPaid(loanId) {

	const token =
	    localStorage.getItem("token") ||
	    sessionStorage.getItem("token");

    if (!token) {

        alert(
            "Please login as administrator."
        );

        return;
    }


    const confirmed = confirm(
        "Are you sure you want to mark this fine as paid?"
    );


    if (!confirmed) {
        return;
    }


    try {

        const response = await fetch(
            API_BASE_URL +
            "/api/admin/loans/" +
            loanId +
            "/pay-fine",
            {
                method: "POST",

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
                "Pay fine error:",
                responseText
            );


            let message =
                "Unable to mark fine as paid.";


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
            "Fine marked as paid successfully."
        );


        // Refresh the table

        loadFines();


    } catch (error) {

        console.error(
            "Error paying fine:",
            error
        );

        alert(
            "Unable to connect to the server."
        );
    }
}



// ================= DATE FORMAT =================

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



// ================= LOGOUT =================

function logout() {

    localStorage.removeItem("token");

    sessionStorage.removeItem("token");

    window.location.href =
        "login.html";
}

