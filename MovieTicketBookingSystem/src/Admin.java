public class Admin extends User {
  public Admin(String email, String password) {
    super(email, password);
  }

  public void addMovie() {
    // Logic to add a new movie
    System.out.println("Adding a new movie...");
  }

  public void manageTheater() {
    // Logic to manage theaters
    System.out.println("Managing theaters...");
  }

  public void setTicketPrice() {
    // Logic to set ticket price
    System.out.println("Setting ticket price...");
  }
}
