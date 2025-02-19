public class Ticket {
  private Booking booking;
  private Payment payment;

  public Ticket(Booking booking, Payment payment) {
    this.booking = booking;
    this.payment = payment;
  }

  public void printTicket() {
    if (payment.isPaid()) {
      System.out.println("Ticket confirmed!");
      System.out.println("Booking Details: \n" + booking.getBookingDetails());
    } else {
      System.out.println("Payment failed! Ticket not confirmed.");
    }
  }
}
