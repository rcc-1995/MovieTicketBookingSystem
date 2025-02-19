
// import java.util.*;
import java.util.Scanner;
import java.util.HashMap;
import java.util.Map;

public class Booking {
  private Customer customer;
  private Showtime showtime;
  private Seat seat;
  private BookingStatus status;

  public Booking(Customer customer, Showtime showtime, Seat seat) {
    this.customer = customer;
    this.showtime = showtime;
    this.seat = seat;
    this.status = BookingStatus.BOOKED;
    seat.bookSeat(); // Book the seat
  }

  public String getBookingDetails() {
    return "Movie: " + showtime.getMovie().getTitle() + "\nSeat: " + seat.getSeatNumber() + "\nStatus: " + status;
  }

  public void cancelBooking() {
    seat.releaseSeat();
    status = BookingStatus.CANCELLED;
  }
}
