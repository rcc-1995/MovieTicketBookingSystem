const Movie = require('../models/Movie')
const Showtime = require('../models/Showtime')
const Theater = require('../models/Theater')
const User = require('../models/User')

//@desc     GET showtimes
//@route    GET /showtime
//@access   Public
exports.getShowtimes = async (req, res, next) => {
    try {
        const showtimes = await Showtime.find({ isRelease: true })
            .populate([
                'movie',
                { path: 'theater', populate: { path: 'cinema', select: 'name' }, select: 'number cinema seatPlan' }
            ])
            .select('-seats.user -seats.row -seats.number')
            .lean()

        const enhancedShowtimes = showtimes.map(showtime => ({
            ...showtime,
            seats: showtime.seats.map(seat => ({
                ...seat,
                price: showtime.seatPrice
            }))
        }))

        res.status(200).json({ success: true, count: enhancedShowtimes.length, data: enhancedShowtimes })
    } catch (err) {
        console.log(err)
        res.status(400).json({ success: false, message: err.message })
    }
}

//@desc     GET showtimes with all unreleased showtime
//@route    GET /showtime/unreleased
//@access   Private admin
exports.getUnreleasedShowtimes = async (req, res, next) => {
	try {
		const showtimes = await Showtime.find()
			.populate([
				'movie',
				{ path: 'theater', populate: { path: 'cinema', select: 'name' }, select: 'number cinema seatPlan' }
			])
			.select('-seats.user -seats.row -seats.number')

		res.status(200).json({ success: true, count: showtimes.length, data: showtimes })
	} catch (err) {
		console.log(err)
		res.status(400).json({ success: false, message: err })
	}
}

//@desc     GET single showtime
//@route    GET /showtime/:id
//@access   Public
exports.getShowtime = async (req, res, next) => {
    try {
        const showtime = await Showtime.findById(req.params.id)
            .populate([
                'movie',
                { path: 'theater', populate: { path: 'cinema', select: 'name' }, select: 'number cinema seatPlan' }
            ])
            .select('-seats.user')
            .lean()

        if (!showtime) {
            return res.status(404).json({ success: false, message: `Showtime not found` })
        }

        if (!showtime.isRelease) {
            return res.status(400).json({ success: false, message: `Showtime is not released` })
        }

        const enhancedShowtime = {
            ...showtime,
            seats: showtime.seats.map(seat => ({
                ...seat,
                price: showtime.seatPrice
            }))
        }

        res.status(200).json({ success: true, data: enhancedShowtime })
    } catch (err) {
        console.log(err)
        res.status(400).json({ success: false, message: err.message })
    }
}

//@desc     GET single showtime with user
//@route    GET /showtime/user/:id
//@access   Private Admin
exports.getShowtimeWithUser = async (req, res, next) => {
	try {
		const showtime = await Showtime.findById(req.params.id).populate([
			'movie',
			{ path: 'theater', populate: { path: 'cinema', select: 'name' }, select: 'number cinema seatPlan' },
			{ path: 'seats', populate: { path: 'user', select: 'username email role' } }
		])

		if (!showtime) {
			return res.status(400).json({ success: false, message: `Showtime not found with id of ${req.params.id}` })
		}

		res.status(200).json({ success: true, data: showtime })
	} catch (err) {
		console.log(err)
		res.status(400).json({ success: false, message: err })
	}
}

//@desc     Add Showtime
//@route    POST /showtime
//@access   Private
// exports.addShowtime = async (req, res, next) => {
//     try {
//         const { movie: movieId, showtime: showtimeString, theater: theaterId, seatPrice, repeat = 1, isRelease } = req.body

//         if (repeat > 31 || repeat < 1) {
//             return res.status(400).json({ success: false, message: `Repeat must be between 1 to 31 days` })
//         }

//         if (!seatPrice || seatPrice < 0) {
//             return res.status(400).json({ success: false, message: `Valid seat price required` })
//         }

//         let showtime = new Date(showtimeString)
//         const theater = await Theater.findById(theaterId)
//         const movie = await Movie.findById(movieId)
//         const showtimeIds = []

//         // ... existing validation checks ...

//         for (let i = 0; i < repeat; i++) {
//             const showtimeDoc = await Showtime.create({ 
//                 theater, 
//                 movie: movie._id, 
//                 showtime, 
//                 seatPrice, // Added seatPrice
//                 isRelease 
//             })
//             showtimeIds.push(showtimeDoc._id)
//             showtime.setDate(showtime.getDate() + 1)
//         }

//         // ... rest of the function ...
//     } catch (err) {
//         // ... error handling ...
//     }
// }
exports.addShowtime = async (req, res, next) => {
    try {
        const { movie: movieId, showtime: showtimeString, theater: theaterId, seatPrice, repeat = 1, isRelease } = req.body

        // Validations
        if (repeat < 1 || repeat > 31) {
            return res.status(400).json({ success: false, message: 'Repeat must be between 1-31 days' })
        }
        if (!seatPrice || typeof seatPrice !== 'number' || seatPrice < 0) {
            return res.status(400).json({ success: false, message: 'Valid seat price required' })
        }

        const theater = await Theater.findById(theaterId)
        const movie = await Movie.findById(movieId)
        const baseShowtime = new Date(showtimeString)
        
        if (!theater || !movie) {
            return res.status(404).json({ success: false, message: 'Theater or Movie not found' })
        }

        const showtimes = []
        const showtimeIds = []

        for (let i = 0; i < repeat; i++) {
            const showtimeDoc = await Showtime.create({
                theater: theater._id,
                movie: movie._id,
                showtime: new Date(baseShowtime),
                seatPrice,
                isRelease
            })
            
            showtimeIds.push(showtimeDoc._id)
            showtimes.push(showtimeDoc)
            baseShowtime.setDate(baseShowtime.getDate() + 1)
        }

        theater.showtimes.push(...showtimeIds)
        await theater.save()

        res.status(201).json({
            success: true,
            count: showtimes.length,
            data: showtimes
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({ success: false, message: err.message })
    }
}
exports.cancelBooking = async (req, res, next) => {
    try {
        const { seats } = req.body
        const user = req.user
        const showtimeId = req.params.id

        // Validate input
        if (!seats || !Array.isArray(seats)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid seats data'
            })
        }
	

        const showtime = await Showtime.findById(showtimeId)
        const userDoc = await User.findById(user._id)

        if (!showtime || !userDoc) {
            return res.status(404).json({
                success: false,
                message: 'Showtime or user not found'
            })
        }

        // Check showtime validity
        if (new Date(showtime.startTime) < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel booking after showtime has started'
            })
        }

        // Convert seat strings to objects
        const seatsToRemove = seats.map(seat => {
            const [row, number] = seat.split(/(\d+)/).filter(Boolean)
            return { row, number: parseInt(number, 10) }
        })

        // Remove seats from showtime
        showtime.seats = showtime.seats.filter(seat =>
            !seatsToRemove.some(s => 
                s.row === seat.row && s.number === seat.number
            )
        )

        // Remove seats from user's tickets
        userDoc.tickets = userDoc.tickets.map(ticket => {
            if (ticket.showtime.equals(showtimeId)) {
                ticket.seats = ticket.seats.filter(seat =>
                    !seatsToRemove.some(s =>
                        s.row === seat.row && s.number === seat.number
                    )
                )
            }
            return ticket
        }).filter(ticket => ticket.seats.length > 0)

        // Mark tickets array as modified
        userDoc.markModified('tickets')

        await Promise.all([showtime.save(), userDoc.save()])

        res.status(200).json({
            success: true,
            data: {
                showtime: await Showtime.findById(showtimeId),
                user: await User.findById(user._id).select('-password')
            }
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            success: false,
            message: 'Server error during cancellation'
        })
    }
}

//@desc     Purchase seats
//@route    POST /showtime/:id
//@access   Private


// exports.purchase = async (req, res, next) => {
// 	try {
// 		const { seats } = req.body
// 		const user = req.user

// 		const showtime = await Showtime.findById(req.params.id).populate({ path: 'theater', select: 'seatPlan' })

// 		if (!showtime) {
// 			return res.status(400).json({ success: false, message: `Showtime not found with id of ${req.params.id}` })
// 		}

// 		const isSeatValid = seats.every((seatNumber) => {
// 			const [row, number] = seatNumber.match(/([A-Za-z]+)(\d+)/).slice(1)
// 			const maxRow = showtime.theater.seatPlan.row
// 			const maxCol = showtime.theater.seatPlan.column

// 			if (maxRow.length !== row.length) {
// 				return maxRow.length > row.length
// 			}

// 			return maxRow.localeCompare(row) >= 0 && number <= maxCol
// 		})

// 		if (!isSeatValid) {
// 			return res.status(400).json({ success: false, message: 'Seat is not valid' })
// 		}

// 		const isSeatAvailable = seats.every((seatNumber) => {
// 			const [row, number] = seatNumber.match(/([A-Za-z]+)(\d+)/).slice(1)
// 			return !showtime.seats.some((seat) => seat.row === row && seat.number === parseInt(number, 10))
// 		})

// 		if (!isSeatAvailable) {
// 			return res.status(400).json({ success: false, message: 'Seat not available' })
// 		}

// 		const seatUpdates = seats.map((seatNumber) => {
// 			const [row, number] = seatNumber.match(/([A-Za-z]+)(\d+)/).slice(1)
// 			return { row, number: parseInt(number, 10), user: user._id }
// 		})

// 		showtime.seats.push(...seatUpdates)
// 		const updatedShowtime = await showtime.save()

// 		const updatedUser = await User.findByIdAndUpdate(
// 			user._id,
// 			{
// 				$push: { tickets: { showtime, seats: seatUpdates } }
// 			},
// 			{ new: true }
// 		)

// 		res.status(200).json({ success: true, data: updatedShowtime, updatedUser })
// 	} catch (err) {
// 		console.log(err)
// 		res.status(400).json({ success: false, message: err })
// 	}
// }

exports.purchase = async (req, res, next) => {
    try {
        const { seats } = req.body
        const user = req.user

        const showtime = await Showtime.findById(req.params.id).populate({ path: 'theater', select: 'seatPlan' })

        if (!showtime) {
            return res.status(404).json({ success: false, message: 'Showtime not found' })
        }

        // Validate seats format
        const seatRegex = /^([A-Za-z]+)(\d+)$/
        const invalidSeats = seats.filter(seat => !seatRegex.test(seat))
        if (invalidSeats.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: `Invalid seat format: ${invalidSeats.join(', ')}` 
            })
        }

        // Validate seat availability
        const seatsToBook = seats.map(seat => {
            const [, row, number] = seat.match(seatRegex)
            return { row, number: parseInt(number) }
        })

        const unavailableSeats = seatsToBook.filter(seat => 
            showtime.seats.some(s => 
                s.row === seat.row && s.number === seat.number
            )
        )

        if (unavailableSeats.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Seats already booked: ${unavailableSeats.map(s => `${s.row}${s.number}`).join(', ')}`
            })
        }

        // Calculate total price
        const totalPrice = seats.length * showtime.seatPrice

        // Create seat objects
        const seatUpdates = seatsToBook.map(seat => ({
            ...seat,
            user: user._id,
            price: showtime.seatPrice
        }))

        // Update showtime
        showtime.seats.push(...seatUpdates)
        const updatedShowtime = await showtime.save()

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                $push: {
                    tickets: {
                        showtime: showtime._id,
                        seats: seatUpdates,
                        totalPrice,
                        purchaseDate: new Date()
                    }
                }
            },
            { new: true, runValidators: true }
        )

        res.status(200).json({
            success: true,
            data: {
                showtime: updatedShowtime,
                user: updatedUser,
                totalPrice
            }
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({ success: false, message: err.message })
    }
}

//@desc     Update showtime
//@route    PUT /showtime/:id
//@access   Private Admin
exports.updateShowtime = async (req, res, next) => {
	try {
		const showtime = await Showtime.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true
		})

		if (!showtime) {
			return res.status(400).json({ success: false, message: `Showtime not found with id of ${req.params.id}` })
		}
		res.status(200).json({ success: true, data: showtime })
	} catch (err) {
		res.status(400).json({ success: false, message: err })
	}
}

//@desc     Delete single showtime
//@route    DELETE /showtime/:id
//@access   Private Admin
exports.deleteShowtime = async (req, res, next) => {
	try {
		const showtime = await Showtime.findById(req.params.id)

		if (!showtime) {
			return res.status(400).json({ success: false, message: `Showtime not found with id of ${req.params.id}` })
		}

		await showtime.deleteOne()

		res.status(200).json({ success: true })
	} catch (err) {
		console.log(err)
		res.status(400).json({ success: false, message: err })
	}
}

//@desc     Delete showtimes
//@route    DELETE /showtime
//@access   Private Admin
exports.deleteShowtimes = async (req, res, next) => {
	try {
		const { ids } = req.body

		let showtimesIds

		if (!ids) {
			// Delete all showtimes
			showtimesIds = await Showtime.find({}, '_id')
		} else {
			// Find showtimes based on the provided IDs
			showtimesIds = await Showtime.find({ _id: { $in: ids } }, '_id')
		}

		for (const showtimeId of showtimesIds) {
			await showtimeId.deleteOne()
		}

		res.status(200).json({ success: true, count: showtimesIds.length })
	} catch (err) {
		console.log(err)
		res.status(400).json({ success: false, message: err })
	}
}

//@desc     Delete previous day showtime
//@route    DELETE /showtime/previous
//@access   Private Admin
exports.deletePreviousShowtime = async (req, res, next) => {
	try {
		const currentDate = new Date()
		currentDate.setHours(0, 0, 0, 0)

		const showtimesIds = await Showtime.find({ showtime: { $lt: currentDate } }, '_id')

		for (const showtimeId of showtimesIds) {
			await showtimeId.deleteOne()
		}

		res.status(200).json({ success: true, count: showtimesIds.length })
	} catch (err) {
		console.log(err)
		res.status(400).json({ success: false, message: err })
	}
}
