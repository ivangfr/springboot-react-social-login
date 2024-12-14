package com.ivanfranchin.movieapi.rest;

import com.ivanfranchin.movieapi.model.Movie;
import com.ivanfranchin.movieapi.rest.dto.CreateMovieRequest;
import com.ivanfranchin.movieapi.rest.dto.MovieDto;
import com.ivanfranchin.movieapi.service.MovieService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import static com.ivanfranchin.movieapi.config.SwaggerConfig.BEARER_KEY_SECURITY_SCHEME;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService movieService;

    @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
    @GetMapping
    public List<MovieDto> getMovies(@RequestParam(value = "text", required = false) String text) {
        List<Movie> movies = (text == null) ? movieService.getMovies() : movieService.getMoviesContainingText(text);
        return movies.stream()
                .map(this::toMovieDto)
                .collect(Collectors.toList());
    }

    @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public MovieDto createMovie(@Valid @RequestBody CreateMovieRequest createMovieRequest) {
        Movie movie = toMovie(createMovieRequest);
        return toMovieDto(movieService.saveMovie(movie));
    }

    @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
    @DeleteMapping("/{imdb}")
    public MovieDto deleteMovie(@PathVariable String imdb) {
        Movie movie = movieService.validateAndGetMovie(imdb);
        movieService.deleteMovie(movie);
        return toMovieDto(movie);
    }

    public Movie toMovie(CreateMovieRequest createMovieRequest) {
        return new Movie(createMovieRequest.imdb(), createMovieRequest.title(), createMovieRequest.poster());
    }

    public MovieDto toMovieDto(Movie movie) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_OFFSET_DATE_TIME.withZone(ZoneId.systemDefault());
        return new MovieDto(movie.getImdb(), movie.getTitle(), movie.getPoster(), formatter.format(movie.getCreatedAt()));
    }
}
