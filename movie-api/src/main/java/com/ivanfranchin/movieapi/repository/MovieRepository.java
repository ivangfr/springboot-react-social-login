package com.ivanfranchin.movieapi.repository;

import com.ivanfranchin.movieapi.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, String> {

    List<Movie> findAllByOrderByTitle();

    List<Movie> findByImdbContainingOrTitleContainingIgnoreCaseOrderByTitle(String imdb, String title);
}
