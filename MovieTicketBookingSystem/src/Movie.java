public class Movie {
  private String title;
  private String genre;
  private int duration; // in minutes
  private String language;

  public Movie(String title, String genre, int duration, String language) {
    this.title = title;
    this.genre = genre;
    this.duration = duration;
    this.language = language;
  }

  public String getTitle() {
    return title;
  }

  public String getGenre() {
    return genre;
  }

  public int getDuration() {
    return duration;
  }

  public String getLanguage() {
    return language;
  }

  @Override
  public String toString() {
    return title + " (" + genre + ")";
  }
}
