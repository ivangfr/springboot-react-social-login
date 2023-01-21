package com.ivanfranchin.movieapi.movie;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.TestPropertySource;

import com.ivanfranchin.movieapi.model.Movie;
import com.ivanfranchin.movieapi.repository.MovieRepository;
import com.ivanfranchin.movieapi.service.MovieService;

@TestPropertySource("/application-test.properties")
@SpringBootTest
public class MovieServiceTest {

    @Autowired
    private JdbcTemplate jdbc;   

    @Autowired
    private MovieService movieService;

    @Autowired
    private MovieRepository movieRepository;

    @Value("${sql.script.insert.movie}")
    private String sqlInsertMovie;

    @Value("${sql.script.delete.movies}")
    private String sqlDeleteMovie;

    @BeforeEach
    void setupDbBeforeTransactions() throws Exception {
        jdbc.execute(sqlInsertMovie); 
    }

    @Test
    void isMovieNullCheck() throws Exception {
        Movie movie = movieService.validateAndGetMovie("tt01171998");
        assertEquals("tt01171998", movie.getImdb() ,"should return true for movie has `imdb: tt01171998`");
    }

    @Test
    void createMovieService() throws Exception {
        Movie movie = new Movie("tt01171999", "be strong", "Jane");

        movieService.saveMovie(movie);

        Movie movieToCheck = movieService.validateAndGetMovie("tt01171999");

        assertEquals("tt01171999", movieToCheck.getImdb());
    }

    @Test
    void getMoviesService() throws Exception {
        List<Movie> movies = movieService.getMovies();
        // there are 10 movies already persisted in db 
        // NOTE: TRUE if run for just this single case, otherwise FALSE
        // assertEquals(11, movies.size(), "should return movies.size() == 11");

        // NOTE: TRUE if run concurrently with other test cases, otherwise FALSE
        assertEquals(1, movies.size(), "should return movies.size() == 11");
    }

    @Test
    void getMoviesServiceContainGivenText() throws Exception {
        List<Movie> movies = movieService.getMoviesContainingText("home");
        assertTrue(movies.size() > 0, "should return true for movies.size() > 0");
        assertFalse(movies.size() > 1, "should return for movies.size() > 1");
        assertTrue(movies.size() == 1, "should return for movies.size() == 1");
    }

    @Test
    void deleteMovieService() throws Exception {
        Optional<Movie> movie = movieRepository.findByImdb("tt01171998");

        assertTrue(Optional.of(movie).isPresent(), "should return true");

        movieService.deleteMovie(movie.get());

        movie = movieRepository.findByImdb("tt01171998");

        assertFalse(movie.isPresent(), "should return false");
    }

    @AfterEach
    void setupDbAfterTransactions() throws Exception {
        jdbc.execute(sqlDeleteMovie); 
    }
}
