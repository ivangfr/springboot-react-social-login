package com.mycompany.movieapi.repository;

import java.util.List;

import com.mycompany.movieapi.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRepository extends JpaRepository<Movie, String> {

  List<Movie> findAllByOrderByCreatedAtDesc();

  List<Movie> findByImdbContainingOrTitleContainingOrderByCreatedAt(String imdb, String title);

}
