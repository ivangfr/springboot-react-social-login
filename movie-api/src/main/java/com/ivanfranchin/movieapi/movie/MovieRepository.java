package com.ivanfranchin.movieapi.movie;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRepository extends JpaRepository<Movie, String> {

  List<Movie> findAllByOrderByTitle();

  List<Movie> findByImdbContainingOrTitleContainingIgnoreCaseOrderByTitle(
      String imdb, String title);
}
