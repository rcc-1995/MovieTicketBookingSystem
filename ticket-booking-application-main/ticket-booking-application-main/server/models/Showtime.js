const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
	theater: { type: mongoose.Schema.ObjectId, ref: 'Theater', required: true },
	movie: { type: mongoose.Schema.ObjectId, ref: 'Movie', required: true },
	showtime: { type: Date, required: true },
	seatPrice: { type: Number, required: true,min:0 }, // Single seat price for all seats
	seats: [
		{
			row: { type: String, required: true },
			number: { type: Number, required: true },
			user: { type: mongoose.Schema.ObjectId, ref: 'User' }
		}
	],
	isRelease: { type: Boolean, default: true }
});

showtimeSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
	const showtimeId = this._id;
	await this.model('User').updateMany(
		{ 'tickets.showtime': showtimeId },
		{ $pull: { tickets: { showtime: showtimeId } } }
	);
	next();
});

module.exports = mongoose.model('Showtime', showtimeSchema);
