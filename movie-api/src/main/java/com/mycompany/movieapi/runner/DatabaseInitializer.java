package com.mycompany.movieapi.runner;

import com.mycompany.movieapi.model.Movie;
import com.mycompany.movieapi.service.MovieService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Slf4j
@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final MovieService movieService;

    public DatabaseInitializer(MovieService movieService) {
        this.movieService = movieService;
    }

    @Override
    public void run(String... args) {
        movies.forEach(movieService::saveMovie);
        log.info("Database initialized");
    }

    private final List<Movie> movies = Collections.singletonList(
            new Movie("abc", "I Tonia")
    );

}
