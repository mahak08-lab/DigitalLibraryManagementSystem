// ============================================================
// ADMIN BOOKS JAVASCRIPT
// ============================================================


// Railway Backend URL

const API_BASE_URL = "http://localhost:8080";


// Books array

let books = [];


// Currently selected book ID for editing

let selectedBookId = null;


// Bootstrap modal

let addBookModal = null;

let editBookModal = null;


// ============================================================
// GET TOKEN
// ============================================================

function getToken() {

    let token = localStorage.getItem("token");

    if (!token) {
        token = sessionStorage.getItem("token");
    }

    return token;
}


// ============================================================
// PAGE LOAD
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Admin books page loaded.");

    // ----------------------------------------
    // ADD BOOK MODAL
    // ----------------------------------------

    const addBookModalElement =
        document.getElementById("addBookModal");

    if (addBookModalElement) {

        addBookModal =
            new bootstrap.Modal(addBookModalElement);
    }


    // ----------------------------------------
    // EDIT BOOK MODAL
    // ----------------------------------------

    const editBookModalElement =
        document.getElementById("editBookModal");

    if (editBookModalElement) {

        editBookModal =
            new bootstrap.Modal(editBookModalElement);
    }


    // ----------------------------------------
    // ADD BOOK FORM
    // ----------------------------------------

    const addBookForm =
        document.getElementById("addBookForm");

    if (addBookForm) {

        addBookForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                addBook();
            }
        );
    }


    // ----------------------------------------
    // EDIT BOOK FORM
    // ----------------------------------------

    const editBookForm =
        document.getElementById("editBookForm");

    if (editBookForm) {

        editBookForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                updateBook();
            }
        );
    }


    // ----------------------------------------
    // LOAD BOOKS
    // ----------------------------------------

    loadBooks();

});


// ============================================================
// LOAD ALL BOOKS
// ============================================================

async function loadBooks() {

    const tableBody =
        document.getElementById("booksTableBody");

    try {

        console.log(
            "Loading books from:",
            API_BASE_URL + "/api/books"
        );


        const token = getToken();


        if (!token) {

            console.error("No authentication token found.");

            tableBody.innerHTML = `
                <tr>
                    <td colspan="7"
                        class="text-center text-danger py-4">

                        <i class="bi bi-shield-exclamation"></i>
                        Admin login session expired.

                    </td>
                </tr>
            `;

            return;
        }


        const response =
            await fetch(
                API_BASE_URL + "/api/books",
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            "Bearer " + token,

                        "Content-Type":
                            "application/json"
                    }

                }
            );


        // ----------------------------------------
        // UNAUTHORIZED
        // ----------------------------------------

        if (response.status === 401) {

            console.error(
                "401 Unauthorized"
            );

            tableBody.innerHTML = `
                <tr>
                    <td colspan="7"
                        class="text-center text-danger py-4">

                        <i class="bi bi-shield-x"></i>
                        Session expired. Please login again.

                    </td>
                </tr>
            `;

            return;
        }


        // ----------------------------------------
        // FORBIDDEN
        // ----------------------------------------

        if (response.status === 403) {

            console.error(
                "403 Forbidden"
            );

            tableBody.innerHTML = `
                <tr>
                    <td colspan="7"
                        class="text-center text-danger py-4">

                        <i class="bi bi-lock"></i>
                        You are not authorized to access this page.

                    </td>
                </tr>
            `;

            return;
        }


        // ----------------------------------------
        // OTHER ERRORS
        // ----------------------------------------

        if (!response.ok) {

            throw new Error(
                "HTTP error: " + response.status
            );
        }


        // ----------------------------------------
        // RESPONSE
        // ----------------------------------------

        books =
            await response.json();


        console.log(
            "Books received from backend:",
            books
        );


        displayBooks();

    }

    catch (error) {

        console.error(
            "Error loading books:",
            error
        );


        tableBody.innerHTML = `
            <tr>
                <td colspan="7"
                    class="text-center text-danger py-4">

                    <i class="bi bi-exclamation-triangle"></i>
                    Unable to load books.

                </td>
            </tr>
        `;
    }

}


// ============================================================
// DISPLAY BOOKS
// ============================================================

function displayBooks() {

    const tableBody =
        document.getElementById("booksTableBody");


    // ----------------------------------------
    // NO BOOKS
    // ----------------------------------------

    if (!books || books.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="7"
                    class="text-center text-muted py-5">

                    <i class="bi bi-book fs-2 d-block mb-2"></i>

                    No books found.

                    <div class="mt-2">
                        Click <strong>Add Book</strong>
                        to add the first book.
                    </div>

                </td>
            </tr>
        `;

        return;
    }


    // ----------------------------------------
    // CREATE ROWS
    // ----------------------------------------

    tableBody.innerHTML = "";


    books.forEach(function (book) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${book.id ?? ""}
            </td>


            <td>
                <strong>
                    ${escapeHtml(book.title ?? "")}
                </strong>
            </td>


            <td>
                ${escapeHtml(book.author ?? "")}
            </td>


            <td>
                <span class="badge bg-light text-dark">
                    ${escapeHtml(book.category ?? "")}
                </span>
            </td>


            <td>
                ${escapeHtml(book.isbn ?? "")}
            </td>


            <td>
                <span class="badge
                    ${Number(book.quantity) > 0
                        ? "bg-success"
                        : "bg-danger"}">

                    ${book.quantity ?? 0}

                </span>
            </td>


            <td>

                <div class="d-flex gap-2">

                    <button
                        type="button"
                        class="btn btn-sm btn-outline-primary"
                        onclick="editBook(${book.id})">

                        <i class="bi bi-pencil"></i>
                        Edit

                    </button>


                    <button
                        type="button"
                        class="btn btn-sm btn-outline-danger"
                        onclick="deleteBook(${book.id})">

                        <i class="bi bi-trash"></i>
                        Delete

                    </button>

                </div>

            </td>

        `;


        tableBody.appendChild(row);

    });

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


// ============================================================
// OPEN ADD BOOK MODAL
// ============================================================

function openAddBookModal() {

    const form =
        document.getElementById("addBookForm");


    if (form) {
        form.reset();
    }


    // Default quantity

    document.getElementById(
        "addQuantity"
    ).value = 1;


    // Clear error

    const errorBox =
        document.getElementById("addError");

    errorBox.textContent = "";

    errorBox.classList.add("d-none");


    // Clear success

    const successBox =
        document.getElementById("addSuccess");

    successBox.textContent = "";

    successBox.classList.add("d-none");


    // Show modal

    if (addBookModal) {

        addBookModal.show();

    } else {

        console.error(
            "Add Book modal not initialized."
        );
    }

}


// ============================================================
// ADD BOOK
// ============================================================

async function addBook() {

    const title =
        document
            .getElementById("addTitle")
            .value
            .trim();


    const author =
        document
            .getElementById("addAuthor")
            .value
            .trim();


    const isbn =
        document
            .getElementById("addIsbn")
            .value
            .trim();


    const category =
        document
            .getElementById("addCategory")
            .value
            .trim();


    const quantityValue =
        document
            .getElementById("addQuantity")
            .value;


    const quantity =
        Number(quantityValue);


    const errorBox =
        document.getElementById("addError");


    const successBox =
        document.getElementById("addSuccess");


    const addButton =
        document.getElementById("addBookButton");


    // ----------------------------------------
    // CLEAR MESSAGES
    // ----------------------------------------

    errorBox.textContent = "";

    errorBox.classList.add("d-none");

    successBox.textContent = "";

    successBox.classList.add("d-none");


    // ----------------------------------------
    // VALIDATION
    // ----------------------------------------

    if (
        !title ||
        !author ||
        !isbn ||
        !category
    ) {

        errorBox.textContent =
            "Please fill all required fields.";

        errorBox.classList.remove("d-none");

        return;
    }


    if (
        quantityValue === "" ||
        !Number.isInteger(quantity) ||
        quantity < 0
    ) {

        errorBox.textContent =
            "Quantity must be a whole number greater than or equal to 0.";

        errorBox.classList.remove("d-none");

        return;
    }


    // ----------------------------------------
    // TOKEN
    // ----------------------------------------

    const token =
        getToken();


    if (!token) {

        errorBox.textContent =
            "Admin login session expired. Please login again.";

        errorBox.classList.remove("d-none");

        return;
    }


    // ----------------------------------------
    // BOOK DATA
    // ----------------------------------------

    const bookData = {

        title: title,

        author: author,

        isbn: isbn,

        category: category,

        quantity: quantity

    };


    console.log(
        "Adding book:",
        bookData
    );


    try {

        // Disable button

        addButton.disabled = true;

        addButton.innerHTML = `
            <span
                class="spinner-border spinner-border-sm me-1">
            </span>
            Adding...
        `;


        // ----------------------------------------
        // POST REQUEST
        // ----------------------------------------

        const response =
            await fetch(
                API_BASE_URL + "/api/books",
                {

                    method: "POST",

                    headers: {

                        "Authorization":
                            "Bearer " + token,

                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(bookData)

                }
            );


        // ----------------------------------------
        // UNAUTHORIZED
        // ----------------------------------------

        if (response.status === 401) {

            errorBox.textContent =
                "Your login session has expired. Please login again.";

            errorBox.classList.remove("d-none");

            return;
        }


        // ----------------------------------------
        // FORBIDDEN
        // ----------------------------------------

        if (response.status === 403) {

            errorBox.textContent =
                "You are not authorized to add books. Please login as Admin.";

            errorBox.classList.remove("d-none");

            return;
        }


        // ----------------------------------------
        // OTHER ERROR
        // ----------------------------------------

        if (!response.ok) {

            let message =
                "Failed to add book.";


            try {

                const errorData =
                    await response.json();


                if (errorData.message) {

                    message =
                        errorData.message;

                }

            }

            catch (error) {

                console.log(
                    "Could not parse error response."
                );
            }


            errorBox.textContent =
                message;

            errorBox.classList.remove("d-none");

            return;
        }


        // ----------------------------------------
        // SUCCESS
        // ----------------------------------------

        const addedBook =
            await response.json();


        console.log(
            "Book added successfully:",
            addedBook
        );


        successBox.textContent =
            "Book added successfully!";


        successBox.classList.remove(
            "d-none"
        );


        // Reset form

        document
            .getElementById("addBookForm")
            .reset();


        document.getElementById(
            "addQuantity"
        ).value = 1;


        // Reload books

        await loadBooks();


        // Close modal after short delay

        setTimeout(function () {

            if (addBookModal) {

                addBookModal.hide();

            }

        }, 800);

    }


    catch (error) {

        console.error(
            "Error adding book:",
            error
        );


        errorBox.textContent =
            "Unable to connect to the server.";

        errorBox.classList.remove(
            "d-none"
        );

    }


    finally {

        // Enable button

        addButton.disabled = false;

        addButton.innerHTML = `
            <i class="bi bi-plus-circle"></i>
            Add Book
        `;

    }

}


// ============================================================
// EDIT BOOK
// ============================================================

function editBook(id) {

    const book =
        books.find(
            function (item) {
                return item.id === id;
            }
        );


    if (!book) {

        console.error(
            "Book not found:",
            id
        );

        return;
    }


    selectedBookId =
        id;


    // Fill form

    document.getElementById(
        "editBookId"
    ).value = book.id;


    document.getElementById(
        "editTitle"
    ).value = book.title ?? "";


    document.getElementById(
        "editAuthor"
    ).value = book.author ?? "";


    document.getElementById(
        "editIsbn"
    ).value = book.isbn ?? "";


    document.getElementById(
        "editCategory"
    ).value = book.category ?? "";


    document.getElementById(
        "editQuantity"
    ).value = book.quantity ?? 0;


    // Clear messages

    document
        .getElementById("editError")
        .classList.add("d-none");


    document
        .getElementById("editSuccess")
        .classList.add("d-none");


    // Show modal

    if (editBookModal) {

        editBookModal.show();

    }

}


// ============================================================
// UPDATE BOOK
// ============================================================

async function updateBook() {

    if (!selectedBookId) {

        console.error(
            "No book selected."
        );

        return;
    }


    const title =
        document
            .getElementById("editTitle")
            .value
            .trim();


    const author =
        document
            .getElementById("editAuthor")
            .value
            .trim();


    const isbn =
        document
            .getElementById("editIsbn")
            .value
            .trim();


    const category =
        document
            .getElementById("editCategory")
            .value
            .trim();


    const quantityValue =
        document
            .getElementById("editQuantity")
            .value;


    const quantity =
        Number(quantityValue);


    const errorBox =
        document.getElementById("editError");


    const successBox =
        document.getElementById("editSuccess");


    const saveButton =
        document.getElementById("saveBookButton");


    // Clear messages

    errorBox.textContent = "";

    errorBox.classList.add("d-none");

    successBox.textContent = "";

    successBox.classList.add("d-none");


    // ----------------------------------------
    // VALIDATION
    // ----------------------------------------

    if (
        !title ||
        !author ||
        !isbn ||
        !category
    ) {

        errorBox.textContent =
            "Please fill all required fields.";

        errorBox.classList.remove(
            "d-none"
        );

        return;
    }


    if (
        quantityValue === "" ||
        !Number.isInteger(quantity) ||
        quantity < 0
    ) {

        errorBox.textContent =
            "Quantity must be a whole number greater than or equal to 0.";

        errorBox.classList.remove(
            "d-none"
        );

        return;
    }


    const token =
        getToken();


    if (!token) {

        errorBox.textContent =
            "Admin login session expired. Please login again.";

        errorBox.classList.remove(
            "d-none"
        );

        return;
    }


    // ----------------------------------------
    // BOOK DATA
    // ----------------------------------------

    const bookData = {

        title: title,

        author: author,

        isbn: isbn,

        category: category,

        quantity: quantity

    };


    try {

        saveButton.disabled = true;

        saveButton.innerHTML = `
            <span
                class="spinner-border spinner-border-sm me-1">
            </span>
            Saving...
        `;


        // ----------------------------------------
        // PUT REQUEST
        // ----------------------------------------

        const response =
            await fetch(
                API_BASE_URL +
                "/api/books/" +
                selectedBookId,
                {

                    method: "PUT",

                    headers: {

                        "Authorization":
                            "Bearer " + token,

                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(bookData)

                }
            );


        // ----------------------------------------
        // UNAUTHORIZED
        // ----------------------------------------

        if (response.status === 401) {

            errorBox.textContent =
                "Your login session has expired. Please login again.";

            errorBox.classList.remove(
                "d-none"
            );

            return;
        }


        // ----------------------------------------
        // FORBIDDEN
        // ----------------------------------------

        if (response.status === 403) {

            errorBox.textContent =
                "You are not authorized to update books.";

            errorBox.classList.remove(
                "d-none"
            );

            return;
        }


        // ----------------------------------------
        // OTHER ERROR
        // ----------------------------------------

        if (!response.ok) {

            let message =
                "Failed to update book.";


            try {

                const errorData =
                    await response.json();


                if (errorData.message) {

                    message =
                        errorData.message;
                }

            }

            catch (error) {

                console.log(
                    "Could not parse error response."
                );
            }


            errorBox.textContent =
                message;

            errorBox.classList.remove(
                "d-none"
            );

            return;
        }


        // ----------------------------------------
        // SUCCESS
        // ----------------------------------------

        await response.json();


        successBox.textContent =
            "Book updated successfully!";


        successBox.classList.remove(
            "d-none"
        );


        // Reload books

        await loadBooks();


        // Close modal

        setTimeout(function () {

            if (editBookModal) {

                editBookModal.hide();

            }

        }, 800);

    }


    catch (error) {

        console.error(
            "Error updating book:",
            error
        );


        errorBox.textContent =
            "Unable to connect to the server.";

        errorBox.classList.remove(
            "d-none"
        );

    }


    finally {

        saveButton.disabled = false;

        saveButton.innerHTML = `
            <i class="bi bi-check-circle"></i>
            Save Changes
        `;

    }

}


// ============================================================
// DELETE BOOK
// ============================================================

async function deleteBook(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this book?"
        );


    if (!confirmed) {

        return;
    }


    const token =
        getToken();


    if (!token) {

        alert(
            "Admin login session expired. Please login again."
        );

        return;
    }


    try {

        console.log(
            "Deleting book:",
            id
        );


        const response =
            await fetch(
                API_BASE_URL +
                "/api/books/" +
                id,
                {

                    method: "DELETE",

                    headers: {

                        "Authorization":
                            "Bearer " + token

                    }

                }
            );


        // ----------------------------------------
        // UNAUTHORIZED
        // ----------------------------------------

        if (response.status === 401) {

            alert(
                "Your login session has expired. Please login again."
            );

            return;
        }


        // ----------------------------------------
        // FORBIDDEN
        // ----------------------------------------

        if (response.status === 403) {

            alert(
                "You are not authorized to delete books."
            );

            return;
        }


        // ----------------------------------------
        // ERROR
        // ----------------------------------------

        if (!response.ok) {

            throw new Error(
                "HTTP error: " +
                response.status
            );
        }


        // ----------------------------------------
        // SUCCESS
        // ----------------------------------------

        console.log(
            "Book deleted successfully."
        );


        // Reload books

        await loadBooks();


        alert(
            "Book deleted successfully."
        );

    }


    catch (error) {

        console.error(
            "Error deleting book:",
            error
        );


        alert(
            "Unable to delete the book."
        );

    }

}