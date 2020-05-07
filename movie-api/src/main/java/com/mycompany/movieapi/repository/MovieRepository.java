package com.mycompany.movieapi.repository;

import java.util.List;

import com.mycompany.movieapi.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRepository extends JpaRepository<Movie, String> {

  List<Movie> findAllByOrderByTitle();

  List<Movie> findByImdbContainingOrTitleContainingOrderByTitle(String imdb, String title);

}
