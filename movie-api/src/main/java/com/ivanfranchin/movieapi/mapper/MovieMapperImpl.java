package com.ivanfranchin.movieapi.mapper;

import com.ivanfranchin.movieapi.model.Movie;
import com.ivanfranchin.movieapi.rest.dto.CreateMovieRequest;
import com.ivanfranchin.movieapi.rest.dto.MovieDto;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
public class MovieMapperImpl implements MovieMapper {

    @Override
    public Movie toMovie(CreateMovieRequest createMovieRequest) {
        if (createMovieRequest == null) {
            return null;
        }
        return new Movie(createMovieRequest.getImdb(), createMovieRequest.getTitle(), createMovieRequest.getPoster());
    }

    @Override
    public MovieDto toMovieDto(Movie movie) {
        if (movie == null) {
            return null;
        }
        return new MovieDto(movie.getImdb(), movie.getTitle(), movie.getPoster(), DateTimeFormatter.ISO_OFFSET_DATE_TIME.format(movie.getCreatedAt()));
    }
}
