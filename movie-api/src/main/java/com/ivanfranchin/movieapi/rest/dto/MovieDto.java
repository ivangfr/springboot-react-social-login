package com.ivanfranchin.movieapi.rest.dto;

import com.ivanfranchin.movieapi.movie.Movie;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

public record MovieDto(String imdb, String title, String poster, String createdAt) {

    public static MovieDto from(Movie movie) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_OFFSET_DATE_TIME.withZone(ZoneId.systemDefault());
        return new MovieDto(
                movie.getImdb(),
                movie.getTitle(),
                movie.getPoster(),
                formatter.format(movie.getCreatedAt())
        );
    }
}
