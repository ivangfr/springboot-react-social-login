package com.mycompany.movieapi.rest;

import com.mycompany.movieapi.exception.MovieNotFoundException;
import com.mycompany.movieapi.model.Movie;
import com.mycompany.movieapi.rest.dto.CreateMovieDto;
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
    public Movie getMovie(@PathVariable String imdb) throws MovieNotFoundException {
        return movieService.validateAndGetMovie(imdb);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public Movie createMovie(@Valid @RequestBody CreateMovieDto createMovieDto) {
        return movieService.saveMovie(new Movie(createMovieDto.getImdb(), createMovieDto.getTitle()));
    }

    @DeleteMapping("/{imdb}")
    public Movie deleteMovie(@PathVariable String imdb) throws MovieNotFoundException {
        Movie movie = movieService.validateAndGetMovie(imdb);
        movieService.deleteMovie(movie);
        return movie;
    }

}
