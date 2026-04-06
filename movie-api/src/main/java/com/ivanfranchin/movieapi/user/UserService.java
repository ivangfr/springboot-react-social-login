package com.ivanfranchin.movieapi.user;

import com.ivanfranchin.movieapi.security.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;

    public List<User> getUsers() {
        return userRepository.findAllByOrderByUsername();
    }

    public long countUsers() {
        return userRepository.count();
    }

    public long countAdmins() {
        return userRepository.countByRole(Role.ADMIN);
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean hasUserWithUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean hasUserWithEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public User validateAndGetUserByUsername(String username) {
        return getUserByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User with username %s not found".formatted(username)));
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(User user) {
        userRepository.delete(user);
    }
}