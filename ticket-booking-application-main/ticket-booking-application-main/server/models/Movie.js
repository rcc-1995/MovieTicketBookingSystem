const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please add a movie name'],
			trim: true
		},
		length: {
			type: Number,
			required: [true, 'Please add a movie length']
		},
		img: {
			type: String,
			required: [true, 'Please add a movie img'],
			trim: true
		},
		language: {  
			type: String,
			required: [true, 'Please add a movie language']
		},
		genre: {
			type: String,
			required: [true, 'Please add a movie genre']
		}
	},
	{ timestamps: true }
);

movieSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
	try {
		await this.model('Showtime').deleteMany({ movie: this._id });
		next();
	} catch (error) {
		next(error);
	}
});

module.exports = mongoose.model('Movie', movieSchema);
