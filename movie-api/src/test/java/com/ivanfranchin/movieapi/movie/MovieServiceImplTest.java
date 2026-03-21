package com.ivanfranchin.movieapi.movie;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MovieServiceImplTest {

    @Mock
    MovieRepository movieRepository;

    @InjectMocks
    MovieServiceImpl movieService;

    @Test
    void getMovies_returnsAllMovies() {
        List<Movie> movies = List.of(createMovie("tt001", "Alpha"), createMovie("tt002", "Beta"));
        when(movieRepository.findAllByOrderByTitle()).thenReturn(movies);

        List<Movie> result = movieService.getMovies();

        assertThat(result).isEqualTo(movies);
        verify(movieRepository).findAllByOrderByTitle();
    }

    @Test
    void getMoviesContainingText_returnsFilteredMovies() {
        List<Movie> movies = List.of(createMovie("tt001", "Rocky"));
        when(movieRepository.findByImdbContainingOrTitleContainingIgnoreCaseOrderByTitle("rocky", "rocky"))
                .thenReturn(movies);

        List<Movie> result = movieService.getMoviesContainingText("rocky");

        assertThat(result).isEqualTo(movies);
        verify(movieRepository).findByImdbContainingOrTitleContainingIgnoreCaseOrderByTitle("rocky", "rocky");
    }

    @Test
    void countMovies_returnsCount() {
        when(movieRepository.count()).thenReturn(5L);

        long count = movieService.countMovies();

        assertThat(count).isEqualTo(5L);
        verify(movieRepository).count();
    }

    @Test
    void validateAndGetMovie_exists_returnsMovie() {
        Movie movie = createMovie("tt001", "Alpha");
        when(movieRepository.findById("tt001")).thenReturn(Optional.of(movie));

        Movie result = movieService.validateAndGetMovie("tt001");

        assertThat(result).isEqualTo(movie);
        verify(movieRepository).findById("tt001");
    }

    @Test
    void validateAndGetMovie_notFound_throwsMovieNotFoundException() {
        when(movieRepository.findById("tt999")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> movieService.validateAndGetMovie("tt999"))
                .isInstanceOf(MovieNotFoundException.class)
                .hasMessageContaining("tt999");
        verify(movieRepository).findById("tt999");
    }

    @Test
    void saveMovie_delegatesToRepository() {
        Movie movie = createMovie("tt001", "Alpha");
        when(movieRepository.save(movie)).thenReturn(movie);

        Movie result = movieService.saveMovie(movie);

        assertThat(result).isEqualTo(movie);
        verify(movieRepository).save(movie);
    }

    @Test
    void deleteMovie_delegatesToRepository() {
        Movie movie = createMovie("tt001", "Alpha");

        movieService.deleteMovie(movie);

        verify(movieRepository).delete(movie);
    }

    private Movie createMovie(String imdb, String title) {
        return new Movie(imdb, title, "http://poster.example.com/" + imdb);
    }
}
