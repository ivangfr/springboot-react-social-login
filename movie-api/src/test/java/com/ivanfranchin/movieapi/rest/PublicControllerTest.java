package com.ivanfranchin.movieapi.rest;

import com.ivanfranchin.movieapi.movie.MovieService;
import com.ivanfranchin.movieapi.security.CustomUserDetailsService;
import com.ivanfranchin.movieapi.security.SecurityConfig;
import com.ivanfranchin.movieapi.security.TokenProvider;
import com.ivanfranchin.movieapi.security.oauth2.CustomAuthenticationSuccessHandler;
import com.ivanfranchin.movieapi.security.oauth2.CustomOAuth2UserService;
import com.ivanfranchin.movieapi.user.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PublicController.class)
@Import(SecurityConfig.class)
class PublicControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    UserService userService;

    @MockitoBean
    MovieService movieService;

    @MockitoBean
    CustomOAuth2UserService customOAuth2UserService;

    @MockitoBean
    CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler;

    @MockitoBean
    TokenProvider tokenProvider;

    @MockitoBean
    CustomUserDetailsService customUserDetailsService;

    @Test
    void getNumberOfUsers_noAuth_returns200() throws Exception {
        when(userService.countUsers()).thenReturn(5L);

        mockMvc.perform(get("/public/numberOfUsers"))
                .andExpect(status().isOk())
                .andExpect(content().string("5"));
    }

    @Test
    void getNumberOfMovies_noAuth_returns200() throws Exception {
        when(movieService.countMovies()).thenReturn(10L);

        mockMvc.perform(get("/public/numberOfMovies"))
                .andExpect(status().isOk())
                .andExpect(content().string("10"));
    }
}
