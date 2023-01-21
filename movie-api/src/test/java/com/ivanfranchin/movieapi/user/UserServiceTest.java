package com.ivanfranchin.movieapi.user;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.TestPropertySource;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

import com.ivanfranchin.movieapi.model.User;
import com.ivanfranchin.movieapi.repository.UserRepository;
import com.ivanfranchin.movieapi.security.oauth2.OAuth2Provider;
import com.ivanfranchin.movieapi.service.UserService;


@TestPropertySource("/application-test.properties")
@SpringBootTest
public class UserServiceTest {
    
    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    private  UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Value("${sql.script.insert.user}")
    private String sqlInsertUser; 

    @Value("${sql.script.delete.users}")
    private String sqlDeleteUser; 

    @BeforeEach
    public void setupDbBeforeTransactions() {
        jdbc.execute(sqlInsertUser); 
    }

    @Test
    void getUserServiceByUsername() throws Exception {
        assertTrue(userService.hasUserWithUsername("Kane"), "a user named 'Kane' should be created by @setupDbBeforeTransaction");
    }

    @Test
    void getUserServiceByInvalidUsername() throws Exception {
        assertFalse(userService.hasUserWithUsername("nonExistedUsername"), "should return false for a user with email 'nonExists@test.com'");
    }
    
    @Test
    void getUserServiceByEmail() throws Exception {
        Optional<User> user = userService.getUserByEmail("kane@test.com");
        assertTrue(user.isPresent(), "should return true for user with `email: cudayanh1@test.com`");
    }

    @Test
    void getUserServiceByInvalidEmail() throws Exception {
        Optional<User> user = userService.getUserByEmail("kane1111@test.com");
        assertFalse(user.isPresent(), "should return false for user with `email: cudayanh1111@test.com`");
    }

    @Test
    void createUserService() throws Exception {
        User user = new User("Jane", "@kien12a9", "jane", 
                "jane@test.com", "USER", "", OAuth2Provider.LOCAL, "2");

        userService.saveUser(user);

        Optional<User> userToCheck = userRepository.findByUsername("Jane");

        assertTrue(userToCheck.isPresent(), "should return true for a user with `username: Jane`");
    }

    @Test
    void deleteUserService() throws Exception {
        Optional<User> user = userRepository.findByUsername("Kane");
        
        assertTrue(user.isPresent(), "should return true for a user named `Kane`");

        userService.deleteUser(user.get());

        user = userRepository.findByUsername("Kane");

        assertFalse(user.isPresent(), "should return false for deleted user named `Kane`");
    }

    @AfterEach
    public void setupDbAfterTransactions() {
        jdbc.execute(sqlDeleteUser);
    }
}
