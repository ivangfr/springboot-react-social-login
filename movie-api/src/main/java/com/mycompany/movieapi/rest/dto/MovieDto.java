package com.mycompany.movieapi.rest.dto;

import lombok.Data;

@Data
public class MovieDto {

    private String imdb;
    private String title;
    private String poster;
    private String createdAt;
}
