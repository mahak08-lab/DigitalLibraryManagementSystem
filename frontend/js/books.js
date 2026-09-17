const API_BASE_URL = "https://digitallibrarymanagementsystem-production-a092.up.railway.app";

let allBooks = [];
let selectedBook = null;


// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    loadBooks();

    const searchButton = document.getElementById("searchButton");
    const searchInput = document.getElementById("searchInput");
    const categorySelect = document.getElementById("categorySelect");

    if (searchButton) {
        searchButton.addEventListener("click", searchBooks);
    }

    if (searchInput) {
        searchInput.addEventListener("keyup", function (event) {

            if (event.key === "Enter") {
                searchBooks();
            }

        });
    }

    if (categorySelect) {
        categorySelect.addEventListener("change", searchBooks);
    }

});


// ======================================================
// LOAD ALL BOOKS
// ======================================================

async function loadBooks() {

    const container = document.getElementById("booksContainer");

    try {

        hideLoading();

        const response = await fetch(
            `${API_BASE_URL}/api/books`
        );

        if (!response.ok) {

            throw new Error(
                `Failed to load books. Status: ${response.status}`
            );

        }

        const books = await response.json();

        console.log(
            "Books received from backend:",
            books
        );

        allBooks = books;

        populateCategories(books);

        displayBooks(books);

    } catch (error) {

        console.error(
            "Error loading books:",
            error
        );

        hideLoading();

        if (container) {

            container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger text-center">
                        <strong>Unable to load books.</strong>
                        <br>
                        Please make sure the Spring Boot backend is running.
                    </div>
                </div>
            `;

        }

        updateBookCount(0);

    }

}


// ======================================================
// DISPLAY BOOKS
// ======================================================

function displayBooks(books) {

    hideLoading();

    const container =
        document.getElementById("booksContainer");

    if (!container) {

        console.error(
            "booksContainer not found."
        );

        return;
    }

    updateBookCount(books.length);


    // No books found

    if (!books || books.length === 0) {

        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info text-center">
                    No books found.
                </div>
            </div>
        `;

        return;
    }


    // Clear previous books

    container.innerHTML = "";


    // Create book cards

    books.forEach(function (book) {

        const bookCard =
            document.createElement("div");

        bookCard.className =
            "col-md-6 col-lg-4 mb-4";


        const available =
            book.quantity > 0;


        bookCard.innerHTML = `

            <div class="card h-100 shadow-sm border-0">

                <div class="card-body">

                    <div class="d-flex justify-content-between align-items-start mb-3">

                        <div>

                            <span class="badge bg-primary">
                                ${escapeHtml(book.category)}
                            </span>

                        </div>


                        <div>

                            ${
                                available

                                ? `
                                    <span class="badge bg-success">
                                        Available
                                    </span>
                                  `

                                : `
                                    <span class="badge bg-danger">
                                        Unavailable
                                    </span>
                                  `
                            }

                        </div>

                    </div>


                    <h5 class="card-title fw-bold">

                        ${escapeHtml(book.title)}

                    </h5>


                    <p class="card-text mb-2">

                        <strong>Author:</strong>
                        ${escapeHtml(book.author)}

                    </p>


                    <p class="card-text mb-2">

                        <strong>ISBN:</strong>
                        ${escapeHtml(book.isbn)}

                    </p>


                    <p class="card-text mb-3">

                        <strong>Available:</strong>
                        ${book.quantity}

                    </p>


                    <button
                        class="btn btn-outline-primary w-100"
                        onclick="openBookDetails(${book.id})"
                    >

                        View Details

                    </button>

                </div>

            </div>

        `;


        container.appendChild(bookCard);

    });

}


// ======================================================
// POPULATE CATEGORY DROPDOWN
// ======================================================

function populateCategories(books) {

    const categorySelect =
        document.getElementById("categorySelect");

    if (!categorySelect) {
        return;
    }


    const categories = new Set();


    books.forEach(function (book) {

        if (book.category) {

            categories.add(book.category);

        }

    });


    categorySelect.innerHTML = `
        <option value="">
            All Categories
        </option>
    `;


    categories.forEach(function (category) {

        const option =
            document.createElement("option");

        option.value = category;

        option.textContent = category;

        categorySelect.appendChild(option);

    });

}


// ======================================================
// SEARCH BOOKS
// ======================================================

async function searchBooks() {

    const searchInput =
        document.getElementById("searchInput");

    const categorySelect =
        document.getElementById("categorySelect");


    const keyword =
        searchInput
            ? searchInput.value.trim()
            : "";


    const category =
        categorySelect
            ? categorySelect.value
            : "";


    // If nothing is selected,
    // show all books

    if (!keyword && !category) {

        displayBooks(allBooks);

        return;
    }


    try {

        let results = [];


        // ==================================================
        // CATEGORY SEARCH
        // ==================================================

        if (category && !keyword) {

            const response = await fetch(

                `${API_BASE_URL}/api/books/search/category?category=${encodeURIComponent(category)}`

            );


            if (!response.ok) {

                throw new Error(
                    "Category search failed."
                );

            }


            results = await response.json();

        }


        // ==================================================
        // TITLE / AUTHOR SEARCH
        // ==================================================

        else if (keyword) {


            const titleResponse = await fetch(

                `${API_BASE_URL}/api/books/search/title?title=${encodeURIComponent(keyword)}`

            );


            const authorResponse = await fetch(

                `${API_BASE_URL}/api/books/search/author?author=${encodeURIComponent(keyword)}`

            );


            if (
                !titleResponse.ok ||
                !authorResponse.ok
            ) {

                throw new Error(
                    "Search request failed."
                );

            }


            const titleBooks =
                await titleResponse.json();


            const authorBooks =
                await authorResponse.json();


            // Combine title + author results

            results = [
                ...titleBooks,
                ...authorBooks
            ];


            // Remove duplicate books

            const uniqueBooks = [];


            results.forEach(function (book) {

                const alreadyExists =
                    uniqueBooks.some(
                        function (existingBook) {

                            return (
                                existingBook.id === book.id
                            );

                        }
                    );


                if (!alreadyExists) {

                    uniqueBooks.push(book);

                }

            });


            results = uniqueBooks;


            // Apply category filter

            if (category) {

                results = results.filter(
                    function (book) {

                        return (
                            book.category === category
                        );

                    }
                );

            }

        }


        displayBooks(results);


    } catch (error) {

        console.error(
            "Search error:",
            error
        );


        const container =
            document.getElementById(
                "booksContainer"
            );


        if (container) {

            container.innerHTML = `

                <div class="col-12">

                    <div class="alert alert-danger text-center">

                        Search failed.
                        Please try again.

                    </div>

                </div>

            `;

        }


        updateBookCount(0);

    }

}


// ======================================================
// OPEN BOOK DETAILS MODAL
// ======================================================

function openBookDetails(bookId) {

    selectedBook =
        allBooks.find(
            function (book) {

                return book.id === bookId;

            }
        );


    if (!selectedBook) {

        console.error(
            "Book not found:",
            bookId
        );

        return;
    }


    // Get modal elements

    const title =
        document.getElementById(
            "modalBookTitle"
        );


    const author =
        document.getElementById(
            "modalBookAuthor"
        );


    const isbn =
        document.getElementById(
            "modalBookIsbn"
        );


    const category =
        document.getElementById(
            "modalBookCategory"
        );


    const quantity =
        document.getElementById(
            "modalBookQuantity"
        );


    const issueButton =
        document.getElementById(
            "issueBookButton"
        );


    const bookingButton =
        document.getElementById(
            "bookingButton"
        );


    // Fill modal information

    if (title) {

        title.textContent =
            selectedBook.title;

    }


    if (author) {

        author.textContent =
            selectedBook.author;

    }


    if (isbn) {

        isbn.textContent =
            selectedBook.isbn;

    }


    if (category) {

        category.textContent =
            selectedBook.category;

    }


    if (quantity) {

        quantity.textContent =
            selectedBook.quantity;

    }


    // ==================================================
    // ISSUE BUTTON
    // ==================================================

    if (issueButton) {

        if (selectedBook.quantity > 0) {

            issueButton.style.display =
                "inline-block";

        } else {

            issueButton.style.display =
                "none";

        }

    }


    // ==================================================
    // BOOKING BUTTON
    // ==================================================

    if (bookingButton) {

        if (selectedBook.quantity === 0) {

            bookingButton.style.display =
                "inline-block";

        } else {

            bookingButton.style.display =
                "none";

        }

    }


    // Show modal

    const modalElement =
        document.getElementById(
            "bookDetailsModal"
        );


    if (modalElement) {

        const modal =
            new bootstrap.Modal(
                modalElement
            );

        modal.show();

    }

}


// ======================================================
// ISSUE BOOK
// ======================================================

async function issueBook() {

    if (!selectedBook) {

        alert(
            "Please select a book first."
        );

        return;
    }


    // ==================================================
    // GET JWT TOKEN
    // Check BOTH localStorage and sessionStorage
    // ==================================================

    const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");


    // User is not logged in

    if (!token) {

        alert(
            "Please login first."
        );

        window.location.href =
            "login.html";

        return;
    }


    try {

        const response =
            await fetch(

                `${API_BASE_URL}/api/loans/issue`,

                {
                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body: JSON.stringify({

                        bookId:
                            selectedBook.id

                    })

                }

            );


        const result =
            await response.json();


        // Backend returned error

        if (!response.ok) {

            alert(
                result.message ||
                "Unable to issue book."
            );

            return;
        }


        // Success

        alert(
            "Book issued successfully!"
        );


        closeBookModal();


        // Reload books so quantity updates

        loadBooks();


    } catch (error) {

        console.error(
            "Issue book error:",
            error
        );


        alert(
            "Something went wrong while issuing the book."
        );

    }

}


// ======================================================
// ADVANCE BOOKING
// ======================================================

async function bookBook() {

    if (!selectedBook) {

        alert(
            "Please select a book first."
        );

        return;
    }


    // ==================================================
    // GET JWT TOKEN
    // Check BOTH localStorage and sessionStorage
    // ==================================================

    const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");


    // User is not logged in

    if (!token) {

        alert(
            "Please login first."
        );

        window.location.href =
            "login.html";

        return;
    }


    try {

        const response =
            await fetch(

                `${API_BASE_URL}/api/bookings`,

                {
                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body: JSON.stringify({

                        bookId:
                            selectedBook.id

                    })

                }

            );


        const result =
            await response.json();


        // Backend error

        if (!response.ok) {

            alert(
                result.message ||
                "Unable to book the book."
            );

            return;
        }


        // Success

        alert(
            "Book booked successfully! You will be notified when it becomes available."
        );


        closeBookModal();


    } catch (error) {

        console.error(
            "Booking error:",
            error
        );


        alert(
            "Something went wrong while booking the book."
        );

    }

}


// ======================================================
// CLOSE BOOK DETAILS MODAL
// ======================================================

function closeBookModal() {

    const modalElement =
        document.getElementById(
            "bookDetailsModal"
        );


    if (modalElement) {

        const modal =
            bootstrap.Modal.getInstance(
                modalElement
            );


        if (modal) {

            modal.hide();

        }

    }

}


// ======================================================
// HIDE LOADING / BUFFERING
// ======================================================

function hideLoading() {

    const loading =
        document.getElementById(
            "loading"
        );


    if (loading) {

        loading.style.display =
            "none";

    }


    const loadingState =
        document.getElementById(
            "loadingState"
        );


    if (loadingState) {

        loadingState.style.display =
            "none";

    }


    // Hide any leftover
    // "Loading books..." text

    const elements =
        document.querySelectorAll("*");


    elements.forEach(
        function (element) {

            const text =
                element.textContent.trim();


            if (
                text === "Loading books..." &&
                element.children.length === 0
            ) {

                element.style.display =
                    "none";

            }

        }
    );

}


// ======================================================
// UPDATE BOOK COUNT
// ======================================================

function updateBookCount(count) {

    const bookCount =
        document.getElementById(
            "bookCount"
        );


    if (!bookCount) {

        return;

    }


    bookCount.textContent =
        `${count} book(s) found`;

}


// ======================================================
// ESCAPE HTML
// Prevents HTML injection in book information
// ======================================================

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


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