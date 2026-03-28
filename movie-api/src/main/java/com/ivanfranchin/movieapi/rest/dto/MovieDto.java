package com.ivanfranchin.movieapi.rest.dto;

import com.ivanfranchin.movieapi.movie.Movie;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

public record MovieDto(String imdb, String title, String poster, String createdAt) {

    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ISO_OFFSET_DATE_TIME.withZone(ZoneId.systemDefault());

    public static MovieDto from(Movie movie) {
        return new MovieDto(
                movie.getImdb(),
                movie.getTitle(),
                movie.getPoster(),
                movie.getCreatedAt() != null ? FORMATTER.format(movie.getCreatedAt()) : null
        );
    }
}
