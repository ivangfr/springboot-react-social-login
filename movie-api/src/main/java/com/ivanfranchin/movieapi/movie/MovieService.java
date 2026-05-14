package com.ivanfranchin.movieapi.movie;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class MovieService {

  private final MovieRepository movieRepository;

  public List<Movie> getMovies() {
    return movieRepository.findAllByOrderByTitle();
  }

  public long countMovies() {
    return movieRepository.count();
  }

  public List<Movie> getMoviesContainingText(String text) {
    return movieRepository.findByImdbContainingOrTitleContainingIgnoreCaseOrderByTitle(text, text);
  }

  public Movie validateAndGetMovie(String imdb) {
    return movieRepository
        .findById(imdb)
        .orElseThrow(
            () -> new MovieNotFoundException("Movie with imdb %s not found".formatted(imdb)));
  }

  public Movie saveMovie(Movie movie) {
    return movieRepository.save(movie);
  }

  public void deleteMovie(Movie movie) {
    movieRepository.delete(movie);
  }
}
