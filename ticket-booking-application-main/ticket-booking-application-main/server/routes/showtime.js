const express = require('express')
const router = express.Router()

const { protect, authorize } = require('../middleware/auth')
const {
    addShowtime,
    getShowtime,
    deleteShowtime,
    purchase,
    deletePreviousShowtime,
    getShowtimes,
    deleteShowtimes,
    getShowtimeWithUser,
    getUnreleasedShowtimes,
    updateShowtime,
    cancelBooking // Added cancellation controller
} = require('../controllers/showtimeController')

// Main routes
router
    .route('/')
    .get(getShowtimes)
    .post(protect, authorize('admin'), addShowtime)
    .delete(protect, authorize('admin'), deleteShowtimes)

// Specialized routes
router.route('/unreleased')
    .get(protect, authorize('admin'), getUnreleasedShowtimes)

router.route('/previous')
    .delete(protect, authorize('admin'), deletePreviousShowtime)

router.route('/user/:id')
    .get(protect, authorize('admin'), getShowtimeWithUser)

// Showtime ID-based routes
router
    .route('/:id')
    .get(getShowtime)
    .post(protect, purchase) // Existing purchase endpoint
    .put(protect, authorize('admin'), updateShowtime)
    .delete(protect, authorize('admin'), deleteShowtime)

// New cancellation endpoint at :8080/api/showtimes/:id/cancel
router.delete('/:id/cancel', 
    protect, 
    cancelBooking // User-facing cancellation
)

module.exports = router