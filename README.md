# Digital Library Management System

A web-based Digital Library Management System developed using Java and Spring Boot.  
The application provides secure role-based access for Admin and User operations such as book management, issuing and returning books, fines, advance bookings, and member management.

---

## 📌 Project Overview

The Digital Library Management System is designed to simplify library operations through a RESTful backend application.

The system provides separate access levels for:

- 👨‍💼 Admin
- 👤 User

Authentication and authorization are implemented using Spring Security and JWT.

---

## ✨ Features

### 👨‍💼 Admin Features

- Admin login
- Add new books
- Update book details
- Delete books
- View all books
- Search books
- View issued books
- View registered members
- Manage member accounts
- View overdue fines
- Mark fines as paid
- View user queries/contact requests
- Resolve user queries

### 👤 User Features

- User registration
- User login
- Browse available books
- Search books by title
- Search books by author
- Search books by category
- Issue books
- View personal issued books
- Return books
- Automatic overdue fine calculation
- Advance booking for unavailable books
- View personal bookings
- Submit contact/query requests

---

## 🛠️ Technology Stack

### Backend
- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Hibernate
- Spring Security
- JWT Authentication
- Lombok
- Bean Validation
- Maven

### Database
- MySQL

### API Testing
- Postman

### Frontend
- HTML
- CSS
- Bootstrap
- JavaScript

---

## 🏗️ Project Architecture

```text
Frontend
   ↓
Controller
   ↓
DTO
   ↓
Service
   ↓
Repository
   ↓
Entity
   ↓
MySQL Database

The project follows a layered architecture to keep business logic, API handling, database operations, and data models separated.

🔐 Authentication & Security

The application uses:

Spring Security
JWT-based authentication
BCrypt password hashing
Role-based authorization
Protected REST APIs
Admin/User access control

Roles:

ROLE_ADMIN
ROLE_USER
📚 Library Operations
Book Management

Admins can:

Create → Read → Update → Delete

book records.

Each book contains information such as:

Book ID
Title
Author
ISBN
Category
Quantity
Book Issue

When a user issues a book:

Available Quantity ↓
Loan Created
Due Date Assigned

The default loan period is 14 days.

Book Return

When a user returns a book:

Book Returned
      ↓
Available Quantity ↑
      ↓
Fine Calculated if Overdue

The overdue fine is calculated at:

₹5 per overdue day
📖 Advance Booking

Users can book a currently unavailable book.

When the book becomes available after a return, the waiting booking can be fulfilled automatically.

💰 Fine Management

The system automatically calculates overdue fines based on the number of overdue days.

Fine = Overdue Days × ₹5

Admins can view and mark fines as paid.

📩 Contact & Query Management

Users can submit queries through the contact functionality.

Admins can:

View submitted queries
Check query details
Resolve queries
🔗 API Modules

The backend contains REST APIs for:

Users
Books
Loans
Bookings
Contact Queries
Admin Management
Authentication

API examples:

POST   /api/users/register
POST   /api/users/login

GET    /api/books
GET    /api/books/search/...

POST   /api/books
PUT    /api/books/{id}
DELETE /api/books/{id}

POST   /api/loans/issue
GET    /api/loans/my
POST   /api/loans/{id}/return

POST   /api/bookings
GET    /api/bookings/my

POST   /api/contact
GET    /api/contact
🗄️ Database

The application uses MySQL for persistent data storage.

Main entities include:

User
Book
Loan
Booking
ContactQuery

Relationships between entities are managed using JPA/Hibernate.

🧪 Testing

The REST APIs were tested using Postman.

Testing includes:

User registration
User login
Admin login
Book CRUD operations
Book search
Book issue
Book return
Fine calculation
Advance booking
Contact queries
Admin operations
Role-based authorization
Validation
Duplicate ISBN handling
Unauthorized access handling
Error handling
⚙️ Configuration

Sensitive configuration values are supplied through environment variables.

Example:

spring.datasource.password=${DB_PASSWORD}
jwt.secret=${JWT_SECRET}
admin.password=${ADMIN_PASSWORD}

Actual passwords and secrets are not stored in the GitHub repository.

▶️ How to Run
1. Clone the repository
git clone https://github.com/mahak08-lab/DigitalLibraryManagementSystem.git
2. Create MySQL database

Create:

CREATE DATABASE digital_library;
3. Configure environment variables

Set:

DB_PASSWORD
JWT_SECRET
ADMIN_PASSWORD
ADMIN_NAME
ADMIN_EMAIL
4. Run the application

Using Maven:

mvn spring-boot:run

Or run:

DigitalLibraryManagementSystemApplication.java

from Eclipse.

The application runs on:

http://localhost:8080
📂 Project Structure
DigitalLibraryManagementSystem
│
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com.mhk
│   │   │       ├── config
│   │   │       ├── controller
│   │   │       ├── dto
│   │   │       ├── entity
│   │   │       ├── exception
│   │   │       ├── repository
│   │   │       └── service
│   │   │
│   │   └── resources
│   │       ├── application.properties
│   │       └── application-example.properties
│   │
│   └── test
│
├── .gitignore
├── pom.xml
├── mvnw
├── mvnw.cmd
└── README.md
🚀 Future Enhancements
Responsive frontend dashboard
Email notifications for due dates
Advanced analytics dashboard
Book cover images
Pagination
Sorting and filtering
Online deployment
Docker support
👩‍💻 Author

Mahak Gupta

GitHub:
https://github.com/mahak08-lab

📄 Internship Project

This project is developed as part of the Oasis Infobyte Java Development Internship – Task 5.


### After pasting

In Eclipse:

**Ctrl + S** → save the README.

Then open PowerShell in your project folder and run:

```powershell
git status

You should see:

modified: README.md

Don't push yet. Send me the git status output, and we'll do the next step.

# Digital Library Management System

A web-based Digital Library Management System developed using Java and Spring Boot.  
The application provides secure role-based access for Admin and User operations such as book management, issuing and returning books, fines, advance bookings, and member management.

---

## 📌 Project Overview

The Digital Library Management System is designed to simplify library operations through a RESTful backend application.

The system provides separate access levels for:

- 👨‍💼 Admin
- 👤 User

Authentication and authorization are implemented using Spring Security and JWT.

---

## ✨ Features

### 👨‍💼 Admin Features

- Admin login
- Add new books
- Update book details
- Delete books
- View all books
- Search books
- View issued books
- View registered members
- Manage member accounts
- View overdue fines
- Mark fines as paid
- View user queries/contact requests
- Resolve user queries

### 👤 User Features

- User registration
- User login
- Browse available books
- Search books by title
- Search books by author
- Search books by category
- Issue books
- View personal issued books
- Return books
- Automatic overdue fine calculation
- Advance booking for unavailable books
- View personal bookings
- Submit contact/query requests

---

## 🛠️ Technology Stack

### Backend
- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Hibernate
- Spring Security
- JWT Authentication
- Lombok
- Bean Validation
- Maven

### Database
- MySQL

### API Testing
- Postman

### Frontend
- HTML
- CSS
- Bootstrap
- JavaScript

---

## 🏗️ Project Architecture

```text
Frontend
   ↓
Controller
   ↓
DTO
   ↓
Service
   ↓
Repository
   ↓
Entity
   ↓
MySQL Database

The project follows a layered architecture to keep business logic, API handling, database operations, and data models separated.

🔐 Authentication & Security

The application uses:

Spring Security
JWT-based authentication
BCrypt password hashing
Role-based authorization
Protected REST APIs
Admin/User access control

Roles:

ROLE_ADMIN
ROLE_USER
📚 Library Operations
Book Management

Admins can:

Create → Read → Update → Delete

book records.

Each book contains information such as:

Book ID
Title
Author
ISBN
Category
Quantity
Book Issue

When a user issues a book:

Available Quantity ↓
Loan Created
Due Date Assigned

The default loan period is 14 days.

Book Return

When a user returns a book:

Book Returned
      ↓
Available Quantity ↑
      ↓
Fine Calculated if Overdue

The overdue fine is calculated at:

₹5 per overdue day
📖 Advance Booking

Users can book a currently unavailable book.

When the book becomes available after a return, the waiting booking can be fulfilled automatically.

💰 Fine Management

The system automatically calculates overdue fines based on the number of overdue days.

Fine = Overdue Days × ₹5

Admins can view and mark fines as paid.

📩 Contact & Query Management

Users can submit queries through the contact functionality.

Admins can:

View submitted queries
Check query details
Resolve queries
🔗 API Modules

The backend contains REST APIs for:

Users
Books
Loans
Bookings
Contact Queries
Admin Management
Authentication

API examples:

POST   /api/users/register
POST   /api/users/login

GET    /api/books
GET    /api/books/search/...

POST   /api/books
PUT    /api/books/{id}
DELETE /api/books/{id}

POST   /api/loans/issue
GET    /api/loans/my
POST   /api/loans/{id}/return

POST   /api/bookings
GET    /api/bookings/my

POST   /api/contact
GET    /api/contact
🗄️ Database

The application uses MySQL for persistent data storage.

Main entities include:

User
Book
Loan
Booking
ContactQuery

Relationships between entities are managed using JPA/Hibernate.

🧪 Testing

The REST APIs were tested using Postman.

Testing includes:

User registration
User login
Admin login
Book CRUD operations
Book search
Book issue
Book return
Fine calculation
Advance booking
Contact queries
Admin operations
Role-based authorization
Validation
Duplicate ISBN handling
Unauthorized access handling
Error handling
⚙️ Configuration

Sensitive configuration values are supplied through environment variables.

Example:

spring.datasource.password=${DB_PASSWORD}
jwt.secret=${JWT_SECRET}
admin.password=${ADMIN_PASSWORD}

Actual passwords and secrets are not stored in the GitHub repository.

▶️ How to Run
1. Clone the repository
git clone https://github.com/mahak08-lab/DigitalLibraryManagementSystem.git
2. Create MySQL database

Create:

CREATE DATABASE digital_library;
3. Configure environment variables

Set:

DB_PASSWORD
JWT_SECRET
ADMIN_PASSWORD
ADMIN_NAME
ADMIN_EMAIL
4. Run the application

Using Maven:

mvn spring-boot:run

Or run:

DigitalLibraryManagementSystemApplication.java

from Eclipse.

The application runs on:

http://localhost:8080
📂 Project Structure
DigitalLibraryManagementSystem
│
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com.mhk
│   │   │       ├── config
│   │   │       ├── controller
│   │   │       ├── dto
│   │   │       ├── entity
│   │   │       ├── exception
│   │   │       ├── repository
│   │   │       └── service
│   │   │
│   │   └── resources
│   │       ├── application.properties
│   │       └── application-example.properties
│   │
│   └── test
│
├── .gitignore
├── pom.xml
├── mvnw
├── mvnw.cmd
└── README.md
🚀 Future Enhancements
Responsive frontend dashboard
Email notifications for due dates
Advanced analytics dashboard
Book cover images
Pagination
Sorting and filtering
Online deployment
Docker support
👩‍💻 Author

Mahak Gupta

GitHub:

https://github.com/mahak08-lab

📄 Internship Project

This project is developed as part of the Oasis Infobyte Java Development Internship – Task 5.


### After pasting

In Eclipse:

**Ctrl + S** → save the README.

Then open PowerShell in your project folder and run:

```powershell
git status

Yes — I can see what happened. 👍

Your README has too many extra ``` and ```` lines because the formatting got copied incorrectly. If you save it like that, GitHub will not display it properly.

Do this
Open README.md in Eclipse.
Press Ctrl + A.
Delete everything.
Paste the clean version below.

Important: I also corrected one thing: since our frontend is not completed yet, we should not present it as already implemented. We'll update the README when we build the frontend.

# Digital Library Management System

A web-based Digital Library Management System developed using Java and Spring Boot. The application provides secure role-based access for Admin and User operations such as book management, issuing and returning books, fines, advance bookings, and member management.

---

## 📌 Project Overview

The Digital Library Management System is designed to simplify library operations through a RESTful backend application.

The system provides separate access levels for:

- 👨‍💼 Admin
- 👤 User

Authentication and authorization are implemented using Spring Security and JWT.

---

## ✨ Features

### 👨‍💼 Admin Features

- Admin login
- Add new books
- Update book details
- Delete books
- View all books
- Search books
- View issued books
- View registered members
- Manage member accounts
- View overdue fines
- Mark fines as paid
- View user queries/contact requests
- Resolve user queries

### 👤 User Features

- User registration
- User login
- Browse available books
- Search books by title
- Search books by author
- Search books by category
- Issue books
- View personal issued books
- Return books
- Automatic overdue fine calculation
- Advance booking for unavailable books
- View personal bookings
- Submit contact/query requests

---

## 🛠️ Technology Stack

### Backend

- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Hibernate
- Spring Security
- JWT Authentication
- Lombok
- Bean Validation
- Maven

### Database

- MySQL

### API Testing

- Postman

### Frontend

- HTML
- CSS
- Bootstrap
- JavaScript

> Frontend development is planned as the next phase of the project.

---

## 🏗️ Project Architecture

```text
Frontend
   ↓
Controller
   ↓
DTO
   ↓
Service
   ↓
Repository
   ↓
Entity
   ↓
MySQL Database

The project follows a layered architecture to separate API handling, business logic, database operations, and data models.

🔐 Authentication & Security

The application uses:

Spring Security
JWT-based authentication
BCrypt password hashing
Role-based authorization
Protected REST APIs
Admin/User access control

Roles:

ROLE_ADMIN
ROLE_USER
📚 Library Operations
Book Management

Admins can perform:

Create → Read → Update → Delete

Book records.

Each book contains:

Book ID
Title
Author
ISBN
Category
Quantity
Book Issue

When a user issues a book:

Available Quantity ↓
Loan Created
Due Date Assigned

The default loan period is 14 days.

Book Return

When a user returns a book:

Book Returned
      ↓
Available Quantity ↑
      ↓
Fine Calculated if Overdue

The overdue fine is calculated at:

₹5 per overdue day
📖 Advance Booking

Users can book a currently unavailable book.

When the book becomes available after a return, the waiting booking can be fulfilled automatically.

💰 Fine Management

The system automatically calculates overdue fines based on the number of overdue days.

Fine = Overdue Days × ₹5

Admins can view and mark fines as paid.

📩 Contact & Query Management

Users can submit queries through the contact functionality.

Admins can:

View submitted queries
Check query details
Resolve queries
🔗 API Modules

The backend contains REST APIs for:

Users
Books
Loans
Bookings
Contact Queries
Admin Management
Authentication
API Examples
POST   /api/users/register
POST   /api/users/login

GET    /api/books
GET    /api/books/search/...

POST   /api/books
PUT    /api/books/{id}
DELETE /api/books/{id}

POST   /api/loans/issue
GET    /api/loans/my
POST   /api/loans/{id}/return

POST   /api/bookings
GET    /api/bookings/my

POST   /api/contact
GET    /api/contact
🗄️ Database

The application uses MySQL for persistent data storage.

Main entities include:

User
Book
Loan
Booking
ContactQuery

Relationships between entities are managed using JPA/Hibernate.

🧪 Testing

The REST APIs were tested using Postman.

Testing includes:

User registration
User login
Admin login
Book CRUD operations
Book search
Book issue
Book return
Fine calculation
Advance booking
Contact queries
Admin operations
Role-based authorization
Validation
Duplicate ISBN handling
Unauthorized access handling
Error handling
⚙️ Configuration

Sensitive configuration values are supplied through environment variables.

Example:

spring.datasource.password=${DB_PASSWORD}
jwt.secret=${JWT_SECRET}
admin.password=${ADMIN_PASSWORD}

Actual passwords and secrets are not stored in the GitHub repository.

▶️ How to Run
1. Clone the repository
git clone https://github.com/mahak08-lab/DigitalLibraryManagementSystem.git
2. Create MySQL database

Create:

CREATE DATABASE digital_library;
3. Configure environment variables

Set:

DB_PASSWORD
JWT_SECRET
ADMIN_PASSWORD
ADMIN_NAME
ADMIN_EMAIL
4. Run the application

Using Maven:

mvn spring-boot:run

Or run:

DigitalLibraryManagementSystemApplication.java

from Eclipse.

The application runs on:

http://localhost:8080
📂 Project Structure
DigitalLibraryManagementSystem
│
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com.mhk
│   │   │       ├── config
│   │   │       ├── controller
│   │   │       ├── dto
│   │   │       ├── entity
│   │   │       ├── exception
│   │   │       ├── repository
│   │   │       └── service
│   │   │
│   │   └── resources
│   │       ├── application.properties
│   │       └── application-example.properties
│   │
│   └── test
│
├── .gitignore
├── pom.xml
├── mvnw
├── mvnw.cmd
└── README.md
🚀 Future Enhancements
Responsive frontend dashboard
Email notifications for due dates
Advanced analytics dashboard
Book cover images
Pagination
Sorting and filtering
Online deployment
Docker support
👩‍💻 Author

Mahak Gupta

GitHub:
https://github.com/mahak08-lab

📄 Internship Project

This project is developed as part of the Oasis Infobyte Java Development Internship – Task 5.