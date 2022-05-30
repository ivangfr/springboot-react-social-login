package com.mycompany.movieapi.repository;

import com.mycompany.movieapi.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, String> {

    List<Movie> findAllByOrderByTitle();

    List<Movie> findByImdbContainingOrTitleContainingOrderByTitle(String imdb, String title);
}
