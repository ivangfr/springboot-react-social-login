package com.mycompany.movieapi.rest;

import com.mycompany.movieapi.service.MovieService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/public")
public class PublicController {

    private final MovieService movieService;

    public PublicController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping("/numberOfMovies")
    public Integer getNumberOfMovies() {
        return movieService.getMovies().size();
    }

}
