# Digital Library Management System

A web-based Digital Library Management System developed using Java and Spring Boot.

The application provides secure role-based access for Admin and User operations including book management, issuing and returning books, overdue fine management, advance bookings, member management, and user queries.

---

## Project Overview

The Digital Library Management System is designed to simplify and automate common library operations through a RESTful backend and web-based frontend.

The system provides separate access levels:

- Admin
- User

Authentication and authorization are implemented using Spring Security and JWT.

---

## Features

### Admin Features

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
- View advance bookings

### User Features

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

## Technology Stack

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

### Frontend

- HTML
- CSS
- Bootstrap
- JavaScript

### API Testing

- Postman

### Development Tools

- Eclipse
- MySQL Workbench
- Git & GitHub

---

## Project Architecture

```text
Frontend
    |
Controller
    |
DTO
    |
Service
    |
Repository
    |
Entity
    |
MySQL Database

The project follows a layered architecture that separates API handling, business logic, database operations, data transfer objects, and entity models.

Authentication & Security

The application uses:

Spring Security
JWT-based authentication
BCrypt password hashing
Role-based authorization
Protected REST APIs
Admin/User access control
Bean Validation
Global exception handling
Roles
ROLE_ADMIN
ROLE_USER
Library Operations
Book Management

Admins can perform:

Create -> Read -> Update -> Delete

Book records contain:

Book ID
Title
Author
ISBN
Category
Quantity
Book Issue

When a user issues a book:

Available Quantity decreases
        |
        v
Loan Created
        |
        v
Due Date Assigned

The default loan period is 14 days.

Book Return

When a user returns a book:

Book Returned
      |
      v
Available Quantity increases
      |
      v
Fine Calculated if Overdue

The overdue fine is calculated at:

Rs. 5 per overdue day

Advance Booking

Users can place an advance booking when a book is currently unavailable.

When the book becomes available after a return, the waiting booking can be fulfilled automatically.

Fine Management

The system automatically calculates overdue fines based on the number of overdue days.

Fine = Overdue Days x Rs. 5

Admins can:

View pending fines
Check fine details
Mark fines as paid
Contact & Query Management

Users can submit queries through the contact functionality.

Admins can:

View submitted queries
Check query details
Resolve queries
API Modules

The backend contains REST APIs for:

Authentication
Users
Books
Loans
Bookings
Contact Queries
Admin Management
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
Database

The application uses MySQL for persistent data storage.

Main Entities
User
Book
Loan
Booking
ContactQuery

Relationships between entities are managed using JPA/Hibernate.

Testing

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
Configuration

Sensitive configuration values are supplied through environment variables.

Example:

spring.datasource.password=${DB_PASSWORD}
jwt.secret=${JWT_SECRET}
admin.password=${ADMIN_PASSWORD}

Actual passwords and secrets are not stored in the GitHub repository.

How to Run
1. Clone the Repository
git clone https://github.com/mahak08-lab/DigitalLibraryManagementSystem.git
2. Create MySQL Database

Create the database:

CREATE DATABASE digital_library;
3. Configure Environment Variables

Set the required environment variables:

DB_PASSWORD
JWT_SECRET
ADMIN_PASSWORD
ADMIN_NAME
ADMIN_EMAIL
4. Run the Backend

Using Maven:

mvn spring-boot:run

Or run:

DigitalLibraryManagementSystemApplication.java

from Eclipse.

The Spring Boot backend runs on:

http://localhost:8080
5. Run the Frontend

Open the frontend folder in PowerShell and run:

python -m http.server 5500

Then access the frontend through:

http://localhost:5500
Project Structure
DigitalLibraryManagementSystem
|
|-- frontend
|   |-- css
|   |   `-- style.css
|   |-- js
|   |-- index.html
|   |-- login.html
|   |-- register.html
|   |-- books.html
|   |-- user-dashboard.html
|   |-- admin-dashboard.html
|   |-- admin-books.html
|   |-- admin-users.html
|   |-- admin-issued-books.html
|   |-- admin-fines.html
|   |-- admin-queries.html
|   `-- admin-bookings.html
|
|-- src
|   `-- main
|       |-- java
|       |   `-- com.mhk
|       |       |-- config
|       |       |-- controller
|       |       |-- dto
|       |       |-- entity
|       |       |-- exception
|       |       |-- repository
|       |       `-- service
|       |
|       `-- resources
|           |-- application.properties
|           `-- application-example.properties
|
|-- pom.xml
|-- database.sql
|-- .gitignore
|-- mvnw
|-- mvnw.cmd
`-- README.md
Future Enhancements

Possible future improvements include:

Email notifications for due dates
Advanced analytics dashboard
Book cover images
Pagination
Advanced sorting and filtering
Docker support
Automated testing
Production deployment improvements
Author

Mahak Gupta

GitHub:

https://github.com/mahak08-lab

Internship Project

This project was developed as part of the Oasis Infobyte Java Development Internship - Task 5: Digital Library Management System.