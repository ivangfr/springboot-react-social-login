package com.mycompany.movieapi.repository;

import com.mycompany.movieapi.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRepository extends JpaRepository<Movie, String> {
}
