package com.mycompany.movieapi.repository;

import com.mycompany.movieapi.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, String> {

    List<Movie> findAllByOrderByTitle();

    // Add @Param as a workaround for https://github.com/spring-projects/spring-data-jpa/issues/2512
    // Remove them when this issue https://github.com/spring-projects/spring-data-jpa/issues/2519 is closed
    List<Movie> findByImdbContainingOrTitleContainingOrderByTitle(@Param("imdb") String imdb, @Param("title") String title);
}
