package com.ivanfranchin.movieapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Scope;

import com.ivanfranchin.movieapi.model.Movie;
import com.ivanfranchin.movieapi.model.User;
import com.ivanfranchin.movieapi.rest.dto.LoginRequest;
import com.ivanfranchin.movieapi.rest.dto.SignUpRequest;

@SpringBootApplication
public class MovieApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(MovieApiApplication.class, args);
    }

    @Bean
    @Scope(value = "prototype")
    User getUser() {
        return new User();
    }

    @Bean 
    @Scope(value = "prototype")
    Movie getMovie() {
        return new Movie();
    }

    @Bean
    @Scope(value = "prototype")
    LoginRequest getLoginRequest() {
        return new LoginRequest();
    }

    @Bean
    @Scope(value = "prototype")
    SignUpRequest getSignUpRequest() {
        return new SignUpRequest();
    }
}
