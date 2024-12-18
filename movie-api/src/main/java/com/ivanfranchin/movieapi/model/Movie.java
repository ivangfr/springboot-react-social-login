package com.ivanfranchin.movieapi.model;

import com.ivanfranchin.movieapi.rest.dto.CreateMovieRequest;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@Entity
@Table(name = "movies")
public class Movie {

    @Id
    private String imdb;

    private String title;
    private String poster;

    private Instant createdAt;

    public Movie(String imdb, String title, String poster) {
        this.imdb = imdb;
        this.title = title;
        this.poster = poster;
    }

    @PrePersist
    public void onPrePersist() {
        createdAt = Instant.now();
    }

    public static Movie from(CreateMovieRequest createMovieRequest) {
        return new Movie(createMovieRequest.imdb(), createMovieRequest.title(), createMovieRequest.poster());
    }
}
