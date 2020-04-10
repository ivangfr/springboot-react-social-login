package com.mycompany.movieapi.service;

import com.mycompany.movieapi.exception.MovieNotFoundException;
import com.mycompany.movieapi.model.Movie;

import java.util.List;

public interface MovieService {

    List<Movie> getMovies();

    Movie validateAndGetMovie(String imdb) throws MovieNotFoundException;

    Movie saveMovie(Movie movie);

    void deleteMovie(Movie movie);

}
