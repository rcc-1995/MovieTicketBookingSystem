# Cinema - Movie Ticket Booking System

## Overview
Cinema is a full-stack movie ticket booking system that allows users to search for movies, select theaters, book seats, and make payments. The system supports multiple theaters, screens, and seat categories.

## Deployment
- [live project link](<https://ticket-booking-application-phi.vercel.app>)

- for admin : username : sahil , password : 123456
- for user : username : user1 , password : 123456
            

## Features
### User Features:
- Search for movies by title, location, or time.
- Select a theater and showtime.
- Choose and book available seats.
- Make payments for bookings (dummy payment system).
- View past and upcoming bookings.
- Cancel a booking before the show starts (subject to rules).

### Admin Features:
- Add new movies.
- Manage theaters and screens.
- Set ticket pricing.
- Manage booking records.

### System Features:
- Authentication using JWT.
- Role-based access control (Admin and User).
- Real-time seat availability updates.
- Responsive UI with TailwindCSS.
- RESTful API integration using Axios.
- MongoDB for storing movies, theaters, showtimes, and user data.

## Technologies Used
### Backend:
- Node.js
- Express.js
- Mongoose
- MongoDB
- JSON Web Tokens (JWT) for authentication

### Frontend:
- React.js
- TailwindCSS
- Axios for API requests
- Vite for development

## Directory Structure
### Backend (`server/`)
```
server/
├── package-lock.json
├── package.json
├── server.js
├── vercel.json
├── .gitignore
├── controllers/
│   ├── authController.js
│   ├── cinemaController.js
│   ├── movieController.js
│   ├── showtimeController.js
│   └── theaterController.js
├── middleware/
│   └── auth.js
├── models/
│   ├── Cinema.js
│   ├── Movie.js
│   ├── Showtime.js
│   ├── Theater.js
│   └── User.js
└── routes/
    ├── auth.js
    ├── cinema.js
    ├── movie.js
    ├── showtime.js
    └── theater.js
```

### Frontend (`client/`)
```
client/
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.cjs
├── tailwind.config.cjs
├── vercel.json
├── vite.config.js
├── .gitignore
└── src/
    ├── AdminRoute.jsx
    ├── App.jsx
    ├── index.css
    ├── main.jsx
    ├── components/
    │   ├── CinemaLists.jsx
    │   ├── DateSelector.jsx
    │   ├── Loading.jsx
    │   ├── MovieLists.jsx
    │   ├── Navbar.jsx
    │   ├── NowShowing.jsx
    │   ├── ScheduleTable.jsx
    │   ├── Seat.jsx
    │   ├── ShowtimeDetails.jsx
    │   ├── Showtimes.jsx
    │   ├── Theater.jsx
    │   ├── TheaterListsByCinema.jsx
    │   ├── TheaterListsByMovie.jsx
    │   └── TheaterShort.jsx
    ├── context/
    │   └── AuthContext.jsx
    └── pages/
        ├── Cinema.jsx
        ├── Home.jsx
        ├── Login.jsx
        ├── Movie.jsx
        ├── Purchase.jsx
        ├── Register.jsx
        ├── Schedule.jsx
        ├── Search.jsx
        ├── Showtime.jsx
        ├── Tickets.jsx
        └── User.jsx
```

## Database Models
### User Model (`models/User.js`)
- Fields: `name`, `email`, `password`, `role`
- Methods: Password hashing, JWT token generation

### Movie Model (`models/Movie.js`)
- Fields: `title`, `genre`, `duration`, `language`
- Relations: Linked to theaters and showtimes

### Theater Model (`models/Theater.js`)
- Fields: `name`, `location`, `screens`
- Relations: Has multiple screens

### Showtime Model (`models/Showtime.js`)
- Fields: `movie`, `theater`, `time`, `availableSeats`
- Relations: Links movies with theaters and manages seat availability

### Cinema Model (`models/Cinema.js`)
- Fields: `name`, `location`
- Relations: Manages cinema chains and locations

## Controllers
### Authentication Controller (`controllers/authController.js`)
- Handles user registration and login
- Generates JWT tokens

### Movie Controller (`controllers/movieController.js`)
- Fetches movies from the database
- Allows admin to add new movies

### Theater Controller (`controllers/theaterController.js`)
- Fetches available theaters
- Allows admin to add new theaters

### Showtime Controller (`controllers/showtimeController.js`)
- Fetches showtimes for a movie
- Manages seat availability

### Cinema Controller (`controllers/cinemaController.js`)
- Manages cinema locations

## API Endpoints
### Authentication (`/api/auth`)
- `POST /register` - Register a new user.
- `POST /login` - User login.

### Movies (`/api/movie`)
- `GET /` - Fetch all movies.
- `POST /` - Add a new movie (Admin only).

### Theaters (`/api/theater`)
- `GET /` - Fetch all theaters.
- `POST /` - Add a new theater (Admin only).

### Showtimes (`/api/showtime`)
- `GET /` - Fetch showtimes.
- `POST /` - Add a new showtime (Admin only).

## Installation & Setup
### Backend Setup
1. Navigate to the `server` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add:
   ```env
   PORT=8080
   DATABASE=<MongoDB_URI>
   JWT_SECRET=<your_jwt_secret>
   JWT_EXPIRE=7d
   JWT_COOKIE_EXPIRE=1
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the `client` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add:
   ```env
   VITE_SERVER_URL=http://localhost:8080
   ```
4. Start the frontend:
   ```bash
   npm run dev
   ```
