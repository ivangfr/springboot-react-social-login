package com.ivanfranchin.movieapi.rest;

import com.ivanfranchin.movieapi.movie.MovieService;
import com.ivanfranchin.movieapi.user.UserService;
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
    public long getNumberOfUsers() {
        return userService.countUsers();
    }

    @GetMapping("/numberOfMovies")
    public long getNumberOfMovies() {
        return movieService.countMovies();
    }
}
