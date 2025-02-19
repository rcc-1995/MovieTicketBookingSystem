import { ArrowsRightLeftIcon, ArrowsUpDownIcon, UserIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Select from 'react-tailwindcss-select';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import Loading from './Loading';
import Showtimes from './Showtimes';

const Theater = ({ theaterId, movies, selectedDate }) => {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors }
	} = useForm();

	const { auth } = useContext(AuthContext);

	const [theater, setTheater] = useState({});
	const [isFetchingTheaterDone, setIsFetchingTheaterDone] = useState(false);
	const [isAddingShowtime, SetIsAddingShowtime] = useState(false);
	const [selectedMovie, setSelectedMovie] = useState(null);

	const fetchTheater = async () => {
		try {
			setIsFetchingTheaterDone(false);
			const response = await axios.get(`/theater/${theaterId}`);
			setTheater(response.data.data);
		} catch (error) {
			console.error(error);
		} finally {
			setIsFetchingTheaterDone(true);
		}
	};

	useEffect(() => {
		fetchTheater();
	}, [theaterId]);

	const onAddShowtime = async (data) => {
		try {
			SetIsAddingShowtime(true);
			if (!data.movie || !data.seatPrice) {
				toast.error('Please select a movie and enter seat price');
				return;
			}
			let showtime = new Date(selectedDate);
			const [hours, minutes] = data.showtime.split(':');
			showtime.setHours(hours, minutes, 0);
			await axios.post(
				'/showtime',
				{ movie: data.movie, showtime, theater: theater._id, seatPrice: parseFloat(data.seatPrice), repeat: data.repeat },
				{ headers: { Authorization: `Bearer ${auth.token}` } }
			);
			fetchTheater();
			toast.success('Showtime added successfully!');
		} catch (error) {
			console.error(error);
			toast.error('Error adding showtime');
		} finally {
			SetIsAddingShowtime(false);
		}
	};

	if (!isFetchingTheaterDone) {
		return <Loading />;
	}

	return (
				<div className="flex flex-col p-6 bg-gray-100 ">
			{/* Header Section */}
			<div className="flex flex-col md:flex-row md:justify-between items-center bg-white p-4 shadow-md rounded-lg">
				<h3 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Theater {theater.number}</h3>
				{auth.role === 'admin' && (
					<div className="flex flex-col md:flex-row gap-4 text-gray-800 font-semibold">
						<div className="flex items-center gap-2">
							<ArrowsUpDownIcon className="h-5 w-5 text-indigo-500" />
							<h4>Rows: A - {theater?.seatPlan?.row}</h4>
						</div>
						<div className="flex items-center gap-2">
							<ArrowsRightLeftIcon className="h-5 w-5 text-indigo-500" />
							<h4>Columns: 1 - {theater?.seatPlan?.column}</h4>
						</div>
					</div>
				)}
			</div>

			{/* Admin Form Section */}
			{auth.role === 'admin' && (
				<form
					className="mt-5 bg-white p-4 shadow-md rounded-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
					onSubmit={handleSubmit(onAddShowtime)}
				>
					{/* Movie Select */}
					<div className="flex flex-col gap-1">
						<label className="text-sm font-semibold text-gray-700">Movie:</label>
						<Select
							value={selectedMovie}
							options={movies?.map((movie) => ({ value: movie._id, label: movie.name }))}
							onChange={(value) => {
								setValue('movie', value.value);
								setSelectedMovie(value);
							}}
							isSearchable={true}
							primaryColor="indigo"
						/>
					</div>

					{/* Showtime Input */}
					<div className="flex flex-col gap-1">
						<label className="text-sm font-semibold text-gray-700">Showtime:</label>
						<input
							type="time"
							className="p-2 border rounded focus:ring focus:ring-indigo-200"
							required
							{...register('showtime')}
						/>
					</div>

					{/* Seat Price Input */}
					<div className="flex flex-col gap-1">
						<label className="text-sm font-semibold text-gray-700">Seat Price:</label>
						<input
							type="number"
							className="p-2 border rounded focus:ring focus:ring-indigo-200"
							required
							{...register('seatPrice')}
						/>
					</div>

					{/* Repeat Days Input */}
					<div className="flex flex-col gap-1">
						<label className="text-sm font-semibold text-gray-700">Repeat (Days):</label>
						<input
							type="number"
							className="p-2 border rounded focus:ring focus:ring-indigo-200"
							required
							{...register('repeat', { min: 1, max: 31 })}
						/>
					</div>

					{/* Submit Button */}
					<div className="flex items-end">
						<button
							className="w-full bg-indigo-600 text-white p-2 rounded-lg shadow-md hover:bg-indigo-500 transition-colors"
							type="submit"
							disabled={isAddingShowtime}
						>
							{isAddingShowtime ? 'Adding...' : 'Add Showtime'}
						</button>
					</div>
				</form>
			)}

			{/* Showtimes Section */}
			<div className="mt-5">
				<Showtimes showtimes={theater.showtimes} movies={movies} selectedDate={selectedDate} />
			</div>
		</div>
	);
};

export default Theater;
