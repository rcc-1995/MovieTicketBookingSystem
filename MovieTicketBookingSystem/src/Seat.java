public class Seat {
  private String seatNumber;
  private boolean isBooked;

  public Seat(String seatNumber) {
    this.seatNumber = seatNumber;
    this.isBooked = false; // Initially available
  }

  public String getSeatNumber() {
    return seatNumber;
  }

  public boolean isBooked() {
    return isBooked;
  }

  public void bookSeat() {
    if (!isBooked) {
      isBooked = true;
    }
  }

  public void releaseSeat() {
    isBooked = false;
  }
}
