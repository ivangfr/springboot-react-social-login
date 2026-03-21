package com.ivanfranchin.movieapi.rest;

import com.ivanfranchin.movieapi.movie.Movie;
import com.ivanfranchin.movieapi.movie.MovieNotFoundException;
import com.ivanfranchin.movieapi.movie.MovieService;
import com.ivanfranchin.movieapi.rest.dto.CreateMovieRequest;
import com.ivanfranchin.movieapi.security.CustomUserDetailsService;
import com.ivanfranchin.movieapi.security.SecurityConfig;
import com.ivanfranchin.movieapi.security.TokenProvider;
import com.ivanfranchin.movieapi.security.oauth2.CustomAuthenticationSuccessHandler;
import com.ivanfranchin.movieapi.security.oauth2.CustomOAuth2UserService;
import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MovieController.class)
@Import(SecurityConfig.class)
class MovieControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

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
    @WithMockUser(authorities = "ADMIN")
    void getMovies_asAdmin_returns200() throws Exception {
        when(movieService.getMovies()).thenReturn(List.of(createMovie("tt001", "Alpha")));

        mockMvc.perform(get("/api/movies"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].imdb").value("tt001"))
                .andExpect(jsonPath("$[0].title").value("Alpha"));
    }

    @Test
    @WithMockUser(authorities = "USER")
    void getMovies_asUser_returns200() throws Exception {
        when(movieService.getMovies()).thenReturn(List.of());

        mockMvc.perform(get("/api/movies"))
                .andExpect(status().isOk());
    }

    @Test
    void getMovies_unauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/movies"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void getMovies_withText_asAdmin_returns200() throws Exception {
        when(movieService.getMoviesContainingText("rocky")).thenReturn(List.of(createMovie("tt001", "Rocky")));

        mockMvc.perform(get("/api/movies").param("text", "rocky"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Rocky"));
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void createMovie_asAdmin_returns201() throws Exception {
        Movie movie = createMovie("tt001", "Alpha");
        when(movieService.saveMovie(any())).thenReturn(movie);

        var request = new CreateMovieRequest("tt001", "Alpha", "http://poster.example.com/tt001");
        mockMvc.perform(post("/api/movies")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.imdb").value("tt001"))
                .andExpect(jsonPath("$.title").value("Alpha"));
    }

    @Test
    @WithMockUser(authorities = "USER")
    void createMovie_asUser_returns403() throws Exception {
        var request = new CreateMovieRequest("tt001", "Alpha", "http://poster.example.com/tt001");
        mockMvc.perform(post("/api/movies")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    void createMovie_unauthenticated_returns401() throws Exception {
        var request = new CreateMovieRequest("tt001", "Alpha", "http://poster.example.com/tt001");
        mockMvc.perform(post("/api/movies")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void createMovie_blankImdb_returns400() throws Exception {
        var request = new CreateMovieRequest("", "Alpha", "http://poster.example.com");
        mockMvc.perform(post("/api/movies")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void createMovie_blankTitle_returns400() throws Exception {
        var request = new CreateMovieRequest("tt001", "", "http://poster.example.com/tt001");
        mockMvc.perform(post("/api/movies")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void deleteMovie_asAdmin_movieExists_returns200() throws Exception {
        Movie movie = createMovie("tt001", "Alpha");
        when(movieService.validateAndGetMovie("tt001")).thenReturn(movie);

        mockMvc.perform(delete("/api/movies/tt001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.imdb").value("tt001"))
                .andExpect(jsonPath("$.title").value("Alpha"));
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void deleteMovie_asAdmin_notFound_returns404() throws Exception {
        when(movieService.validateAndGetMovie("tt999")).thenThrow(new MovieNotFoundException("Movie with imdb tt999 not found"));

        mockMvc.perform(delete("/api/movies/tt999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(authorities = "USER")
    void deleteMovie_asUser_returns403() throws Exception {
        mockMvc.perform(delete("/api/movies/tt001"))
                .andExpect(status().isForbidden());
    }

    @Test
    void deleteMovie_unauthenticated_returns401() throws Exception {
        mockMvc.perform(delete("/api/movies/tt001"))
                .andExpect(status().isUnauthorized());
    }

    private Movie createMovie(String imdb, String title) {
        return new Movie(imdb, title, "http://poster.example.com/" + imdb);
    }
}
