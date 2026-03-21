package com.ivanfranchin.movieapi;

import com.ivanfranchin.movieapi.movie.MovieService;
import com.ivanfranchin.movieapi.security.CustomUserDetailsService;
import com.ivanfranchin.movieapi.security.TokenProvider;
import com.ivanfranchin.movieapi.security.oauth2.CustomAuthenticationSuccessHandler;
import com.ivanfranchin.movieapi.security.oauth2.CustomOAuth2UserService;
import com.ivanfranchin.movieapi.user.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import javax.sql.DataSource;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class MovieApiApplicationTests {

    @MockitoBean
    DataSource dataSource;

    @MockitoBean
    UserService userService;

    @MockitoBean
    MovieService movieService;

    @MockitoBean
    CustomUserDetailsService customUserDetailsService;

    @MockitoBean
    TokenProvider tokenProvider;

    @MockitoBean
    CustomOAuth2UserService customOAuth2UserService;

    @MockitoBean
    CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler;

    @MockitoBean
    AuthenticationManager authenticationManager;

    @MockitoBean
    SecurityFilterChain securityFilterChain;

    @Test
    void contextLoads() {
    }
}
