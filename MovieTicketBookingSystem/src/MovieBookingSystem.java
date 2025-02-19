
import java.util.Scanner;

public class MovieBookingSystem {
  private static Scanner scanner = new Scanner(System.in); // Ensure Scanner is initialized

  public static void main(String[] args) {
    Movie movie = new Movie("Avengers", "Action", 150, "English");
    Theater theater = new Theater("Cinema Hall 1", "New York");
    Screen screen = new Screen("Screen 1", 100);
    Showtime showtime = new Showtime(movie, theater, screen, "6:00 PM");

    System.out.print("Enter email: ");
    String email = scanner.nextLine();

    System.out.print("Enter password: ");
    String password = scanner.nextLine();

    User user = Authentication.authenticate(email, password);

    if (user instanceof Admin admin) {
      System.out.println("\nWelcome Admin!");
      showAdminMenu(admin);
    } else if (user instanceof Customer customer) {
      System.out.println("\nWelcome Customer!");
      showCustomerMenu(customer, showtime);
    } else {
      System.out.println("Invalid credentials.");
    }
  }

  public static void showAdminMenu(Admin admin) {
    while (true) { // Loop to keep showing menu
      System.out.println("\nAdmin Menu:");
      System.out.println("1. Add Movie");
      System.out.println("2. Manage Theater");
      System.out.println("3. Set Ticket Price");
      System.out.println("4. Logout");
      System.out.print("Enter your choice: ");

      if (!scanner.hasNextInt()) {
        System.out.println("Invalid input. Please enter a number.");
        scanner.next(); // Clear invalid input
        continue;
      }

      int choice = scanner.nextInt();
      scanner.nextLine(); // Fix input buffer issue

      switch (choice) {
        case 1:
          System.out.print("Enter movie name: ");
          String movieName = scanner.nextLine();
          admin.addMovie(movieName);
          break;
        case 2:
          admin.manageTheater();
          break;
        case 3:
          admin.setTicketPrice();
          break;
        case 4:
          System.out.println("Logging out...\n");
          return;
        default:
          System.out.println("Invalid choice. Please try again.");
      }
    }
  }

  public static void showCustomerMenu(Customer customer, Showtime showtime) {
    while (true) { // Loop to keep showing menu
      System.out.println("\nCustomer Menu:");
      System.out.println("1. Search Movies");
      System.out.println("2. Book Seat");
      System.out.println("3. View Bookings");
      System.out.println("4. Logout");
      System.out.print("Enter your choice: ");

      if (!scanner.hasNextInt()) {
        System.out.println("Invalid input. Please enter a number.");
        scanner.next(); // Clear invalid input
        continue;
      }

      int choice = scanner.nextInt();
      scanner.nextLine(); // Fix input buffer issue

      switch (choice) {
        case 1:
          customer.searchMovies();
          break;
        case 2:
          bookSeat(customer, showtime);
          break;
        case 3:
          customer.viewBooking();
          break;
        case 4:
          System.out.println("Logging out...\n");
          return;
        default:
          System.out.println("Invalid choice. Please try again.");
      }
    }
  }

  public static void bookSeat(Customer customer, Showtime showtime) {
    System.out.println("\nAvailable Seats: A1, A2, A3, A4, A5");
    System.out.print("Enter seat number to book: ");

    String seatNumber = scanner.nextLine().trim(); // Ensure proper input handling

    if (seatNumber.isEmpty()) {
      System.out.println("Seat number cannot be empty.");
      return;
    }

    Seat seat = new Seat(seatNumber);
    Booking booking = new Booking(customer, showtime, seat);
    Payment payment = new Payment(10.0);

    if (payment.processPayment()) {
      Ticket ticket = new Ticket(booking, payment);
      ticket.printTicket();
    } else {
      System.out.println("Payment failed.");
    }
  }
}
