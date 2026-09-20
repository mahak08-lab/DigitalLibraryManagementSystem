const API_BASE_URL = "http://localhost:8080";

document.addEventListener("DOMContentLoaded", function () {
    loadMembers();
});


async function loadMembers() {

    const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

    const loadingState = document.getElementById("loadingState");
    const tableContainer = document.getElementById("membersTableContainer");
    const emptyState = document.getElementById("emptyState");
    const errorMessage = document.getElementById("errorMessage");
    const tableBody = document.getElementById("membersTableBody");
    const memberCount = document.getElementById("memberCount");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // Reset UI
    loadingState.style.display = "block";
    tableContainer.style.display = "none";
    emptyState.style.display = "none";
    errorMessage.style.display = "none";

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/admin/users`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (response.status === 401 || response.status === 403) {

            errorMessage.textContent =
                "You are not authorized to view members.";

            errorMessage.style.display = "block";

            loadingState.style.display = "none";

            return;
        }

        if (!response.ok) {
            throw new Error(
                `Failed to load members. Status: ${response.status}`
            );
        }

        const members = await response.json();

        console.log("Members received:", members);

        loadingState.style.display = "none";

        memberCount.textContent =
            `${members.length} member(s) registered`;

        tableBody.innerHTML = "";

        if (!members || members.length === 0) {

            emptyState.style.display = "block";

            return;
        }

        tableContainer.style.display = "block";

        members.forEach(function (member, index) {

            const row = document.createElement("tr");

            const initial =
                member.name
                    ? member.name.charAt(0).toUpperCase()
                    : "U";

            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    <div class="d-flex align-items-center">

                        <div class="member-avatar">
                            ${escapeHtml(initial)}
                        </div>

                        <strong>
                            ${escapeHtml(member.name)}
                        </strong>

                    </div>
                </td>

                <td>
                    ${escapeHtml(member.email)}
                </td>

                <td>
                    <span class="role-badge">
                        ${escapeHtml(member.role)}
                    </span>
                </td>

                <td>

                    <button
                        class="btn btn-outline-danger btn-sm delete-btn"
                        onclick="deleteMember(${member.id}, '${escapeHtml(member.name)}')">

                        <i class="bi bi-trash"></i>
                        Delete

                    </button>

                </td>
            `;

            tableBody.appendChild(row);
        });

    } catch (error) {

        console.error("Error loading members:", error);

        loadingState.style.display = "none";

        errorMessage.textContent =
            "Unable to load members. Please make sure the backend is running.";

        errorMessage.style.display = "block";
    }
}


async function deleteMember(memberId, memberName) {

    const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const confirmed = confirm(
        `Are you sure you want to delete member "${memberName}"?`
    );

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/admin/users/${memberId}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (response.status === 401 || response.status === 403) {

            alert("You are not authorized to delete this member.");

            return;
        }

		if (!response.ok) {

		    const errorText = await response.text();

		    console.error("Delete error:", errorText);

		    let message = "Unable to delete member.";

		    try {

		        const errorData = JSON.parse(errorText);

		        if (errorData.message) {
		            message = errorData.message;
		        }

		    } catch (error) {

		        console.error("Unable to parse error response:", error);

		    }

		    alert(message);

		    return;
		}

        alert("Member deleted successfully.");

        loadMembers();

    } catch (error) {

        console.error("Delete member error:", error);

        alert(
            "Something went wrong while deleting the member."
        );
    }
}


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