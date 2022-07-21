package com.ivanfranchin.movieapi.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import java.time.ZonedDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "movies")
public class Movie {

    @Id
    private String imdb;

    private String title;
    private String poster;

    private ZonedDateTime createdAt;

    public Movie(String imdb, String title, String poster) {
        this.imdb = imdb;
        this.title = title;
        this.poster = poster;
    }

    @PrePersist
    public void onPrePersist() {
        createdAt = ZonedDateTime.now();
    }
}
