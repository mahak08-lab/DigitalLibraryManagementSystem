const API_BASE_URL = "http://digitallibrarymanagementsystem-production-a092.up.railway.app";

let books = [];
let selectedBookId = null;

// ================================
// PAGE LOAD
// ================================

document.addEventListener("DOMContentLoaded", function () {

    loadBooks();

    const form = document.getElementById("editBookForm");

    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            updateBook();
        });
    }
});


// ================================
// GET TOKEN
// ================================

function getToken() {

    let token = localStorage.getItem("token");

    if (!token) {
        token = sessionStorage.getItem("token");
    }

    return token;
}


// ================================
// LOAD BOOKS
// ================================

async function loadBooks() {

    const tableBody = document.getElementById("booksTableBody");

    if (!tableBody) {
        console.error("booksTableBody not found.");
        return;
    }

    const token = getToken();

    if (!token) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    tableBody.innerHTML = `
        <tr>
            <td colspan="7" class="text-center">
                <div class="loading-state">
                    <div class="spinner-border text-primary mb-3"></div>
                    <div>Loading books...</div>
                </div>
            </td>
        </tr>
    `;

    try {

        const response = await fetch(
            API_BASE_URL + "/api/books",
            {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        if (!response.ok) {

            if (response.status === 401 ||
                response.status === 403) {

                alert("You are not authorized to manage books.");
                return;
            }

            throw new Error(
                "Failed to load books. Status: " + response.status
            );
        }

        books = await response.json();

        displayBooks();

    } catch (error) {

        console.error("Error loading books:", error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger">
                    Unable to load books.
                </td>
            </tr>
        `;
    }
}


// ================================
// DISPLAY BOOKS
// ================================

function displayBooks() {

    const tableBody = document.getElementById("booksTableBody");

    if (!tableBody) {
        console.error("booksTableBody not found.");
        return;
    }

    tableBody.innerHTML = "";

    if (!books || books.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    No books found.
                </td>
            </tr>
        `;

        return;
    }

    books.forEach(function (book) {

        const row = document.createElement("tr");

        // ID
        const idCell = document.createElement("td");
        idCell.textContent = book.id;

        // TITLE
        const titleCell = document.createElement("td");

        const titleStrong = document.createElement("strong");
        titleStrong.textContent = book.title;

        titleCell.appendChild(titleStrong);

        // AUTHOR
        const authorCell = document.createElement("td");
        authorCell.textContent = book.author;

        // CATEGORY
        const categoryCell = document.createElement("td");

        const categoryBadge = document.createElement("span");

        categoryBadge.className = "badge bg-primary";
        categoryBadge.textContent = book.category;

        categoryCell.appendChild(categoryBadge);

        // ISBN
        const isbnCell = document.createElement("td");
        isbnCell.textContent = book.isbn;

        // QUANTITY
        const quantityCell = document.createElement("td");

        const quantityBadge = document.createElement("span");

        if (book.quantity === 0) {

            quantityBadge.className = "badge bg-danger";
            quantityBadge.textContent = "0 - Unavailable";

        } else {

            quantityBadge.className = "badge bg-success";
            quantityBadge.textContent = book.quantity;
        }

        quantityCell.appendChild(quantityBadge);

        // ACTIONS
        const actionCell = document.createElement("td");

        actionCell.className = "text-center";

        // EDIT BUTTON
        const editButton = document.createElement("button");

        editButton.type = "button";
        editButton.className = "btn btn-sm btn-primary me-1";
        editButton.innerHTML = '<i class="bi bi-pencil"></i> Edit';

        editButton.addEventListener("click", function () {
            editBook(book.id);
        });

        // DELETE BUTTON
        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.className = "btn btn-sm btn-danger";
        deleteButton.innerHTML = '<i class="bi bi-trash"></i> Delete';

        deleteButton.addEventListener("click", function () {
            deleteBook(book.id);
        });

        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        // ADD CELLS TO ROW
        row.appendChild(idCell);
        row.appendChild(titleCell);
        row.appendChild(authorCell);
        row.appendChild(categoryCell);
        row.appendChild(isbnCell);
        row.appendChild(quantityCell);
        row.appendChild(actionCell);

        // ADD ROW TO TABLE
        tableBody.appendChild(row);
    });
}


// ================================
// EDIT BOOK
// ================================

function editBook(id) {

    const book = books.find(function (item) {
        return item.id === id;
    });

    if (!book) {
        alert("Book not found.");
        return;
    }

    selectedBookId = book.id;

    document.getElementById("editBookId").value = book.id;
    document.getElementById("editTitle").value = book.title;
    document.getElementById("editAuthor").value = book.author;
    document.getElementById("editIsbn").value = book.isbn;
    document.getElementById("editCategory").value = book.category;
    document.getElementById("editQuantity").value = book.quantity;

    const errorBox = document.getElementById("editError");
    const successBox = document.getElementById("editSuccess");

    if (errorBox) {
        errorBox.textContent = "";
        errorBox.classList.add("d-none");
    }

    if (successBox) {
        successBox.textContent = "";
        successBox.classList.add("d-none");
    }

    const modalElement = document.getElementById("editBookModal");

    if (!modalElement) {
        console.error("editBookModal not found.");
        return;
    }

    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);

    modal.show();
}


// ================================
// UPDATE BOOK
// ================================

async function updateBook() {

    if (selectedBookId === null) {

        showEditError("Please select a book.");
        return;
    }

    const token = getToken();

    if (!token) {

        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    const title = document.getElementById("editTitle").value.trim();
    const author = document.getElementById("editAuthor").value.trim();
    const isbn = document.getElementById("editIsbn").value.trim();
    const category = document.getElementById("editCategory").value.trim();
    const quantity = document.getElementById("editQuantity").value;

    // Validation

    if (title === "") {
        showEditError("Book title is required.");
        return;
    }

    if (author === "") {
        showEditError("Author is required.");
        return;
    }

    if (isbn === "") {
        showEditError("ISBN is required.");
        return;
    }

    if (category === "") {
        showEditError("Category is required.");
        return;
    }

    if (quantity === "" || Number(quantity) < 0) {
        showEditError("Quantity must be 0 or greater.");
        return;
    }

    const bookData = {
        title: title,
        author: author,
        isbn: isbn,
        category: category,
        quantity: Number(quantity)
    };

    try {

        const response = await fetch(
            API_BASE_URL + "/api/books/" + selectedBookId,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },

                body: JSON.stringify(bookData)
            }
        );

        let result = null;

        try {
            result = await response.json();
        } catch (error) {
            result = null;
        }

        if (!response.ok) {

            let message = "Unable to update book.";

            if (result && result.message) {
                message = result.message;
            }

            showEditError(message);
            return;
        }

        showEditSuccess("Book updated successfully!");

        setTimeout(function () {

            const modalElement =
                document.getElementById("editBookModal");

            const modal =
                bootstrap.Modal.getInstance(modalElement);

            if (modal) {
                modal.hide();
            }

            selectedBookId = null;

            loadBooks();

        }, 800);

    } catch (error) {

        console.error("Update book error:", error);

        showEditError(
            "Something went wrong while updating the book."
        );
    }
}


// ================================
// DELETE BOOK
// ================================

async function deleteBook(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this book?"
    );

    if (!confirmed) {
        return;
    }

    const token = getToken();

    if (!token) {

        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    try {

        const response = await fetch(
            API_BASE_URL + "/api/books/" + id,
            {
                method: "DELETE",

                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        let result = null;

        try {
            result = await response.json();
        } catch (error) {
            result = null;
        }

        if (!response.ok) {

            let message = "Unable to delete book.";

            if (result && result.message) {
                message = result.message;
            }

            alert(message);
            return;
        }

        alert("Book deleted successfully!");

        loadBooks();

    } catch (error) {

        console.error("Delete book error:", error);

        alert(
            "Something went wrong while deleting the book."
        );
    }
}


// ================================
// SHOW ERROR
// ================================

function showEditError(message) {

    const errorBox = document.getElementById("editError");

    if (!errorBox) {
        alert(message);
        return;
    }

    errorBox.textContent = message;

    errorBox.classList.remove("d-none");
}


// ================================
// SHOW SUCCESS
// ================================

function showEditSuccess(message) {

    const successBox = document.getElementById("editSuccess");

    if (!successBox) {
        alert(message);
        return;
    }

    successBox.textContent = message;

    successBox.classList.remove("d-none");
}