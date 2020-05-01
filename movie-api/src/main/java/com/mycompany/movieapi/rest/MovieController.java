package com.mycompany.movieapi.rest;

import com.mycompany.movieapi.model.Movie;
import com.mycompany.movieapi.rest.dto.CreateMovieRequest;
import com.mycompany.movieapi.service.MovieService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping
    public List<Movie> getMovies() {
        return movieService.getMovies();
    }

    @GetMapping("/{imdb}")
    public Movie getMovie(@PathVariable String imdb) {
        return movieService.validateAndGetMovie(imdb);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public Movie createMovie(@Valid @RequestBody CreateMovieRequest createMovieRequest) {
        return movieService.saveMovie(new Movie(createMovieRequest.getImdb(), createMovieRequest.getTitle()));
    }

    @DeleteMapping("/{imdb}")
    public Movie deleteMovie(@PathVariable String imdb) {
        Movie movie = movieService.validateAndGetMovie(imdb);
        movieService.deleteMovie(movie);
        return movie;
    }

}
