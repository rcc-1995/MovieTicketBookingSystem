# Movie Ticket Booking System

## Overview
The **Movie Ticket Booking System** is a simple Java-based application that allows users to search for movies, select theaters, book seats, and make payments. It supports multiple theaters, screens, and seat categories, with different user roles such as Admin and Customer.

## Features
### 1. User Roles & Authentication
- **Customers** can:
  - Search for movies based on title, location, or time.
  - Select a theater and showtime.
  - Choose and book available seats.
  - Make payments for bookings.
  - View past and upcoming bookings.
  - Cancel a booking before the show starts.
- **Admins (Theater Owners)** can:
  - Add new movies.
  - Manage theaters and screens.
  - Set ticket pricing.
  - Manage booking records.

### 2. Movie Management
- Each movie has a **title, genre, duration, and language**.
- A movie can be available in multiple theaters at different times.

### 3. Theater & Screen Management
- A theater can have multiple screens.
- Each screen has a fixed number of seats.
- Showtimes are assigned to screens.

### 4. Booking & Seat Selection
- Users can select seats from available options.
- Once booked, a seat cannot be double-booked.
- Users must complete payment before a seat is confirmed.
- Bookings must be linked to users for retrieval.

### 5. Payment Processing
- Users must pay the ticket price before booking confirmation.
- Payments can be successful or failed.
- If payment fails, seats are released.
- Dummy payment methods are supported.

### 6. Booking Confirmation & Cancellation
- Users receive a ticket confirmation with seat details.
- Users can cancel a booking before the show starts (Refund rules apply).

---

## Installation & Setup
### Prerequisites
Ensure you have the following installed:
- Java Development Kit (JDK) (Ensure `javac` is set in the PATH)
- VS Code (or any Java-supported IDE)

### Steps to Run
1. **Download the Repository**
    https://github.com/rcc-1995/MovieTicketBookingSystem/

  Navigate to the Project Directory:
       cd MovieTicketBookingSystem/src
  Compile the Java Files:****:
2. **Navigate to the Project Directory**
   cd MovieTicketBookingSystem/src
3. **Run the Application**
   java MovieBookingSystem
4. **Login with Admin Credentials (Example)**
   - **Email:** `admin@example.com`
   - **Password:** `admin123`

---

## Usage
### Admin Actions
1. Log in as an Admin.
2. Manage movies, theaters, and ticket pricing.
3. View booking records.

### Customer Actions
1. Log in as a Customer.
2. Search for movies, book seats, and make payments.
3. View booking history or cancel a booking.

---

## Future Enhancements
- Integrate a real payment gateway.
- Develop a GUI-based version for better usability.
- Add email notifications for ticket confirmations.

