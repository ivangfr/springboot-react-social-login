package com.ivanfranchin.movieapi.service;

import com.ivanfranchin.movieapi.model.Movie;

import java.util.List;

public interface MovieService {

    List<Movie> getMovies();

    List<Movie> getMoviesContainingText(String text);

    Movie validateAndGetMovie(String imdb);

    Movie saveMovie(Movie movie);

    void deleteMovie(Movie movie);
}
