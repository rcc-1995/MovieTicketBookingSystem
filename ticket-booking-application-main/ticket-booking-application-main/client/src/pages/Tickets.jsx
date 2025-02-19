import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import ShowtimeDetails from "../components/ShowtimeDetails";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const Tickets = () => {
  const { auth } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [isFetchingticketsDone, setIsFetchingticketsDone] = useState(false);

  const fetchTickets = async () => {
    try {
      setIsFetchingticketsDone(false);
      const response = await axios.get("/auth/tickets", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setTickets(
        response.data.data.tickets?.sort((a, b) => {
          if (a.showtime.showtime > b.showtime.showtime) return 1;
          return -1;
        })
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to load tickets", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
    } finally {
      setIsFetchingticketsDone(true);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCancelTicket = (showtimeId, seats) => {
    const seatNumbers = seats.map((seat) => seat.row + seat.number.toString());

    toast.info(
      <div className="flex flex-col gap-2 p-2">
        <p className="text-lg font-semibold">
          Cancel {seatNumbers.length} seat(s)?
        </p>
        <div className="flex justify-center gap-4">
          <button
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            onClick={() => {
              toast.dismiss();
              processCancellation(showtimeId, seatNumbers);
            }}
          >
            Confirm
          </button>
          <button
            className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
            onClick={() => toast.dismiss()}
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeButton: false,
        closeOnClick: false,
        draggable: false,
        toastId: `cancel-${showtimeId}-${Date.now()}`,
      }
    );
  };

  const processCancellation = async (showtimeId, seats) => {
    try {
      await axios.delete(`/showtime/${showtimeId}/cancel`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        data: { seats },
      });
      await fetchTickets();
      toast.success("Tickets canceled successfully!", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
    } catch (error) {
      console.error("Failed to cancel tickets:", error);
      toast.error(error.response?.data?.message || "Failed to cancel tickets", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col gap-4 bg-gradient-to-br from-indigo-900 to-blue-500 pb-8 text-gray-900 sm:gap-8">
      <Navbar />
      <div className="mx-4 flex h-fit flex-col gap-4 rounded-md bg-gradient-to-br from-indigo-200 to-blue-100 p-4 drop-shadow-xl sm:mx-8 sm:p-6">
        <h2 className="text-3xl font-bold text-gray-900">My Tickets</h2>
        {isFetchingticketsDone ? (
          <>
            {tickets.length === 0 ? (
              <p className="text-center text-gray-700">
                You have not purchased any tickets yet
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 min-[1920px]:grid-cols-3">
                {tickets.map((ticket, index) => {
                  const showtimeDate = new Date(ticket.showtime.showtime);
                  const canCancel = showtimeDate > new Date();

                  return (
                    <div className="flex flex-col gap-2" key={index}>
                      <ShowtimeDetails showtime={ticket.showtime} />
                      <div className="flex flex-col justify-between rounded-b-lg bg-white p-4 shadow-md md:flex-row md:items-center">
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold">Seats:</span>
                            <div className="flex flex-wrap gap-1">
                              {ticket.seats.map((seat, seatIndex) => (
                                <span
                                  key={seatIndex}
                                  className="rounded bg-indigo-100 px-2 py-1 text-sm"
                                >
                                  {seat.row}
                                  {seat.number} (${seat.price})
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <p className="text-sm font-medium text-gray-600">
                              {ticket.seats.length} seat
                              {ticket.seats.length > 1 ? "s" : ""}
                            </p>
                            <p className="text-lg font-bold text-indigo-600">
                              Total: ${ticket.totalPrice}
                            </p>
                          </div>
                        </div>

                        {canCancel && (
                          <div className="mt-4 md:mt-0 md:pl-4">
                            <button
                              onClick={() =>
                                handleCancelTicket(
                                  ticket.showtime._id,
                                  ticket.seats
                                )
                              }
                              className="w-full rounded-lg bg-red-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-600 md:w-auto"
                            >
                              Cancel Ticket
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};

export default Tickets;
