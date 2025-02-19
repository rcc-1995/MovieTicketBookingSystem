import java.util.Map;
import java.util.HashMap;

public class Authentication {
  private static Map<String, User> users = new HashMap<>();

  static {
    // Sample Users
    users.put("admin@example.com", new Admin("admin@example.com", "admin123"));
    users.put("user@example.com", new Customer("user@example.com", "user123"));
  }

  public static User authenticate(String email, String password) {
    User user = users.get(email);
    if (user != null && user.getPassword().equals(password)) {
      return user;
    }
    return null; // Invalid credentials
  }
}
