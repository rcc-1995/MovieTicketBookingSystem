import { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-tailwindcss-select';
import Navbar from '../components/Navbar';

const Search = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [filterCinema, setFilterCinema] = useState(null);
  const [filterTheater, setFilterTheater] = useState(null);
  const [filterMovie, setFilterMovie] = useState(null);
  const [filterDate, setFilterDate] = useState(null);

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const response = await axios.get('/showtime');
        setShowtimes(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchShowtimes();
  }, []);

  const filteredShowtimes = showtimes.filter((showtime) => {
    const showtimeDate = new Date(showtime.showtime).toLocaleDateString('en-GB');
    return (
      (!filterCinema || filterCinema.map((cinema) => cinema.value).includes(showtime.theater.cinema._id)) &&
      (!filterTheater || filterTheater.map((theater) => theater.value).includes(showtime.theater.number)) &&
      (!filterMovie || filterMovie.map((movie) => movie.value).includes(showtime.movie._id)) &&
      (!filterDate || filterDate.map((date) => date.value).includes(showtimeDate))
    );
  });

  return (
    <div className="flex flex-col min-h-screen gap-4 p-4 bg-gradient-to-br from-indigo-900 to-blue-500 text-gray-900">
      <Navbar />
      <div className="bg-gradient-to-br from-indigo-200 to-blue-100 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Search Showtimes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            value={filterCinema}
            options={Array.from(new Set(showtimes.map((s) => s.theater.cinema._id)))
              .map((value) => ({ value, label: showtimes.find((s) => s.theater.cinema._id === value).theater.cinema.name }))}
            onChange={setFilterCinema}
            isClearable isMultiple isSearchable
            primaryColor="indigo"
            placeholder="Select Cinema"
          />
          <Select
            value={filterTheater}
            options={Array.from(new Set(showtimes.map((s) => s.theater.number)))
              .map((value) => ({ value, label: value.toString() }))}
            onChange={setFilterTheater}
            isClearable isMultiple isSearchable
            primaryColor="indigo"
            placeholder="Select Theater"
          />
          <Select
            value={filterMovie}
            options={Array.from(new Set(showtimes.map((s) => s.movie._id)))
              .map((value) => ({ value, label: showtimes.find((s) => s.movie._id === value).movie.name }))}
            onChange={setFilterMovie}
            isClearable isMultiple isSearchable
            primaryColor="indigo"
            placeholder="Select Movie"
          />
          <Select
            value={filterDate}
            options={Array.from(new Set(showtimes.map((s) => new Date(s.showtime).toLocaleDateString('en-GB'))))
              .map((value) => ({ value, label: value }))}
            onChange={setFilterDate}
            isClearable isMultiple isSearchable
            primaryColor="indigo"
            placeholder="Select Date"
          />
        </div>
      </div>
      <div className="bg-gradient-to-br from-indigo-100 to-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Results</h3>
        {filteredShowtimes.length > 0 ? (
          <ul className="space-y-2">
            {filteredShowtimes.map((showtime) => (
              <li key={showtime._id} className="p-4 border rounded-lg shadow-sm bg-white text-gray-900">
                {showtime.movie.name} at {showtime.theater.cinema.name}, Theater {showtime.theater.number} on {new Date(showtime.showtime).toLocaleDateString('en-GB')}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700">No showtimes found.</p>
        )}
      </div>
    </div>
  );
};

export default Search;
