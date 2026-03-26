package com.ivanfranchin.movieapi.movie;

import java.util.List;

public interface MovieService {

    List<Movie> getMovies();

    long countMovies();

    List<Movie> getMoviesContainingText(String text);

    Movie validateAndGetMovie(String imdb);

    Movie saveMovie(Movie movie);

    void deleteMovie(Movie movie);
}
