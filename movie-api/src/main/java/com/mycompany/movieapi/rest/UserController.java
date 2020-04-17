package com.mycompany.movieapi.rest;

import com.mycompany.movieapi.model.User;
import com.mycompany.movieapi.security.CustomUserDetails;
import com.mycompany.movieapi.service.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/user")
    public Map<String, Object> user(@AuthenticationPrincipal OAuth2User principal) {
        return Collections.singletonMap("name", principal.getAttribute("name"));
    }

    @GetMapping("/api/users/me")
    public User getCurrentUser(@AuthenticationPrincipal CustomUserDetails currentUser) {
        return userService.validateAndGetUserByUsername(currentUser.getUsername());
    }

    @GetMapping("/api/users")
    public List<User> getUsers() {
        return userService.getUsers();
    }

    @GetMapping("/api/users/{username}")
    public User getUser(@PathVariable String username) {
        return userService.validateAndGetUserByUsername(username);
    }

    @DeleteMapping("/api/users/{username}")
    public User deleteUser(@PathVariable String username) {
        User user = userService.validateAndGetUserByUsername(username);
        userService.deleteUser(user);
        return user;
    }


}
