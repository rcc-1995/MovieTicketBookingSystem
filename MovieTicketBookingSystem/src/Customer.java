public class Customer extends User {
  public Customer(String email, String password) {
    super(email, password);
  }

  public void searchMovies() {
    // Logic to search for movies
    System.out.println("Searching for movies...");
  }

  public void bookSeat() {
    // Logic to book a seat
    System.out.println("Booking a seat...");
  }

  public void viewBooking() {
    // Logic to view past bookings
    System.out.println("Viewing past bookings...");
  }

  public void cancelBooking() {
    // Logic to cancel a booking
    System.out.println("Canceling booking...");
  }
}
