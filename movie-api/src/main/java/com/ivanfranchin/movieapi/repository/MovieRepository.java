package com.ivanfranchin.movieapi.repository;

import com.ivanfranchin.movieapi.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovieRepository extends JpaRepository<Movie, String> {

    List<Movie> findAllByOrderByTitle();

    List<Movie> findByImdbContainingOrTitleContainingOrderByTitle(String imdb, String title);

    Optional<Movie> findByImdb(String imdb);
}
