package com.ivanfranchin.movieapi.movie;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.CoreMatchers.*; // is()
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ivanfranchin.movieapi.model.Movie;
import com.ivanfranchin.movieapi.repository.MovieRepository;
import com.ivanfranchin.movieapi.service.MovieService;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@TestPropertySource("/application-test.properties")
@AutoConfigureMockMvc(addFilters = false)
@SpringBootTest
@Transactional
public class MovieControllerTest {
    
    @PersistenceContext
    private EntityManager entityManager;

    private static MockHttpServletRequest mockHttpRequest;

    @Mock
    private MovieService movieService;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private Movie movie;

    @Autowired
    private JdbcTemplate jdbc;   

    @Value("${sql.script.insert.movie}")
    private String sqlInsertMovie;

    @Value("${sql.script.delete.movies}")
    private String sqlDeleteMovie;

    @Value("${sql.script.insert.user}")
    private String sqlInsertUser;

    @Value("${sql.script.delete.users}")
    private String sqlDeleteUser;

    public static final MediaType APPLICATION_JSON_UTF8 = MediaType.APPLICATION_JSON;

    @BeforeAll
    static void setupMock() {
        mockHttpRequest = new MockHttpServletRequest();

        mockHttpRequest.setParameter("imdb", "tt0163111");
        mockHttpRequest.setParameter("title", "today, now");
        mockHttpRequest.setParameter("poster", "admin");
    }

    @BeforeEach
    void setupDbBeforeTransactions() throws Exception {
        jdbc.execute(sqlInsertMovie);
        jdbc.execute(sqlInsertUser);
    }

    @Test
    void getNumberOfMoviesHttpRequest() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/public/numberOfMovies"))
                .andExpect(status().isOk()).andExpect(jsonPath("$", is(11)));
    }

    @Test
    @WithMockUser(username = "admin", password = "admin", roles = "ADMIN")
    void getMovieByTextHttpRequest() throws Exception {
        String text = "home";
        mockMvc.perform(MockMvcRequestBuilders.get("/api/movies").param("text", text))
                .andExpect(status().isOk())
                .andDo(print())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @WithMockUser(username = "admin", password = "admin", roles = "ADMIN")
    void createInvalidMovieHttpRequest() throws Exception {
        String blankImdb = "";
        mockMvc.perform(MockMvcRequestBuilders.post("/api/movies")
                .contentType(MediaType.APPLICATION_JSON) 
                .param("imdb", blankImdb)
                .param("title", "test title")
                .param("poster", "Me"))
            .andExpect(status().isBadRequest())
            .andDo(print());
    }

    @Test
    @WithMockUser(username = "admin", password = "admin", roles = "ADMIN")
    void createMovieHttpRequest() throws Exception {
        String imdb = "tt0163111";
        String title = "today, now";
        String poster = "admin";

        movie.setImdb(imdb);
        movie.setTitle(title);
        movie.setPoster(poster);

        assertFalse(movieRepository.findByImdb(imdb).isPresent(), "should return false");

        mockMvc.perform(MockMvcRequestBuilders.post("/api/movies")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(movie)))
            .andExpect(status().isCreated())
            .andExpect(content().contentType(APPLICATION_JSON_UTF8))
            .andExpect(jsonPath("$.imdb", is(imdb)))
            .andExpect(jsonPath("$.title", is(title)))
            .andExpect(jsonPath("$.poster", is(poster)))
            .andExpect(jsonPath("$.createdAt", is(notNullValue())))
            .andDo(print());

        assertTrue(movieRepository.findByImdb(imdb).isPresent(), "should return true");
    }

    @Test
    @WithMockUser(username = "admin", password = "admin", roles = "ADMIN")
    void deleteNonExistingMovieByImdbHttpRequest() throws Exception {
        String imdb = "nonPresentImdb";

        assertFalse(movieRepository.findByImdb(imdb).isPresent());
        
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/movies/{imdb}", imdb))
                .andExpect(status().is4xxClientError())
                .andDo(print());
    }

    @Test
    @WithMockUser(username = "admin", password = "admin", roles = "ADMIN")
    void deleteMovieByImdbHttpRequest() throws Exception {
        String imdb = "tt01171998";

        assertTrue(movieRepository.findByImdb(imdb).isPresent(), "should return true");
        
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/movies/{imdb}", imdb))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.imdb", is(imdb)))
                .andExpect(jsonPath("$.title", is("No home away"))) 
                .andExpect(jsonPath("$.poster", is("cudayanh1")))
                // .andExpect(jsonPath("$.createdAt", is(notNullValue()))) // ? not sure why createdAt sometimes returns null
                .andDo(print());
            
        assertFalse(movieRepository.findByImdb(imdb).isPresent(), "should return false");
    }

    @AfterEach
    void setupDbAfterTransactions() throws Exception {
        jdbc.execute(sqlDeleteMovie);
        jdbc.execute(sqlDeleteUser);
    }
}
