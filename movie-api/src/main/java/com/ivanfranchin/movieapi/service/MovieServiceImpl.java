package com.ivanfranchin.movieapi.service;

import com.ivanfranchin.movieapi.exception.MovieNotFoundException;
import com.ivanfranchin.movieapi.model.Movie;
import com.ivanfranchin.movieapi.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class MovieServiceImpl implements MovieService {

    private final MovieRepository movieRepository;

    @Override
    public List<Movie> getMovies() {
        return movieRepository.findAllByOrderByTitle();
    }

    @Override
    public List<Movie> getMoviesContainingText(String text) {
        return movieRepository.findByImdbContainingOrTitleContainingIgnoreCaseOrderByTitle(text, text);
    }

    @Override
    public Movie validateAndGetMovie(String imdb) {
        return movieRepository.findById(imdb)
                .orElseThrow(() -> new MovieNotFoundException(String.format("Movie with imdb %s not found", imdb)));
    }

    @Override
    public Movie saveMovie(Movie movie) {
        return movieRepository.save(movie);
    }

    @Override
    public void deleteMovie(Movie movie) {
        movieRepository.delete(movie);
    }
}
