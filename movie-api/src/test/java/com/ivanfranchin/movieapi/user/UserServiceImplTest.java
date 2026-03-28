package com.ivanfranchin.movieapi.user;

import com.ivanfranchin.movieapi.security.Role;
import com.ivanfranchin.movieapi.security.oauth2.OAuth2Provider;
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
class UserServiceImplTest {

    @Mock
    UserRepository userRepository;

    @InjectMocks
    UserServiceImpl userService;

    @Test
    void getUsers_returnsAllUsers() {
        List<User> users = List.of(createUser("alice"), createUser("bob"));
        when(userRepository.findAllByOrderByUsername()).thenReturn(users);

        List<User> result = userService.getUsers();

        assertThat(result).isEqualTo(users);
        verify(userRepository).findAllByOrderByUsername();
    }

    @Test
    void countUsers_returnsCount() {
        when(userRepository.count()).thenReturn(3L);

        long count = userService.countUsers();

        assertThat(count).isEqualTo(3L);
        verify(userRepository).count();
    }

    @Test
    void countAdmins_delegatesToRepository() {
        when(userRepository.countByRole(Role.ADMIN)).thenReturn(2L);

        long count = userService.countAdmins();

        assertThat(count).isEqualTo(2L);
        verify(userRepository).countByRole(Role.ADMIN);
    }

    @Test
    void getUserByUsername_exists_returnsOptional() {
        User user = createUser("alice");
        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(user));

        Optional<User> result = userService.getUserByUsername("alice");

        assertThat(result).contains(user);
        verify(userRepository).findByUsername("alice");
    }

    @Test
    void getUserByEmail_exists_returnsOptional() {
        User user = createUser("alice");
        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.of(user));

        Optional<User> result = userService.getUserByEmail("alice@example.com");

        assertThat(result).contains(user);
        verify(userRepository).findByEmail("alice@example.com");
    }

    @Test
    void hasUserWithUsername_returnsTrue() {
        when(userRepository.existsByUsername("alice")).thenReturn(true);

        boolean result = userService.hasUserWithUsername("alice");

        assertThat(result).isTrue();
        verify(userRepository).existsByUsername("alice");
    }

    @Test
    void hasUserWithEmail_returnsFalse() {
        when(userRepository.existsByEmail("nobody@example.com")).thenReturn(false);

        boolean result = userService.hasUserWithEmail("nobody@example.com");

        assertThat(result).isFalse();
        verify(userRepository).existsByEmail("nobody@example.com");
    }

    @Test
    void validateAndGetUserByUsername_exists_returnsUser() {
        User user = createUser("alice");
        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(user));

        User result = userService.validateAndGetUserByUsername("alice");

        assertThat(result).isEqualTo(user);
        verify(userRepository).findByUsername("alice");
    }

    @Test
    void validateAndGetUserByUsername_notFound_throwsUserNotFoundException() {
        when(userRepository.findByUsername("ghost")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.validateAndGetUserByUsername("ghost"))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining("ghost");
        verify(userRepository).findByUsername("ghost");
    }

    @Test
    void saveUser_delegatesToRepository() {
        User user = createUser("alice");
        when(userRepository.save(user)).thenReturn(user);

        User result = userService.saveUser(user);

        assertThat(result).isEqualTo(user);
        verify(userRepository).save(user);
    }

    @Test
    void deleteUser_delegatesToRepository() {
        User user = createUser("alice");

        userService.deleteUser(user);

        verify(userRepository).delete(user);
    }

    private User createUser(String username) {
        return new User(username, "encoded-password", username + " Name",
                username + "@example.com", Role.USER, null, OAuth2Provider.LOCAL);
    }
}
