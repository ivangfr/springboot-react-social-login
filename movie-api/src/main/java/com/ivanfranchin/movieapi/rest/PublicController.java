package com.ivanfranchin.movieapi.rest;

import com.ivanfranchin.movieapi.service.MovieService;
import com.ivanfranchin.movieapi.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/public")
public class PublicController {

    private final UserService userService;
    private final MovieService movieService;

    @GetMapping("/numberOfUsers")
    public Integer getNumberOfUsers() {
        return userService.getUsers().size();
    }

    @GetMapping("/numberOfMovies")
    public Integer getNumberOfMovies() {
        return movieService.getMovies().size();
    }
}
