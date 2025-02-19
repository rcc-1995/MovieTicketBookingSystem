import java.util.*;

public class Showtime {
  private Movie movie;
  private Theater theater;
  private Screen screen;
  private String time;

  public Showtime(Movie movie, Theater theater, Screen screen, String time) {
    this.movie = movie;
    this.theater = theater;
    this.screen = screen;
    this.time = time;
  }

  public Movie getMovie() {
    return movie;
  }

  public Theater getTheater() {
    return theater;
  }

  public Screen getScreen() {
    return screen;
  }

  public String getTime() {
    return time;
  }

  @Override
  public String toString() {
    return movie.getTitle() + " at " + time + " in " + screen.getScreenName();
  }
}
