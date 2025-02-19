public class Payment {
  private double amount;
  private boolean isPaid;

  public Payment(double amount) {
    this.amount = amount;
    this.isPaid = false;
  }

  public boolean processPayment() {
    // Simulate payment processing
    System.out.println("Processing payment of $" + amount);
    isPaid = true; // Assume the payment is successful
    return isPaid;
  }

  public void cancelPayment() {
    isPaid = false;
    System.out.println("Payment has been canceled.");
  }

  public boolean isPaid() {
    return isPaid;
  }
}
