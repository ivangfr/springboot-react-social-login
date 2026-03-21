package com.ivanfranchin.movieapi.rest;

import com.ivanfranchin.movieapi.security.CustomUserDetails;
import com.ivanfranchin.movieapi.security.CustomUserDetailsService;
import com.ivanfranchin.movieapi.security.SecurityConfig;
import com.ivanfranchin.movieapi.security.TokenProvider;
import com.ivanfranchin.movieapi.security.oauth2.CustomAuthenticationSuccessHandler;
import com.ivanfranchin.movieapi.security.oauth2.CustomOAuth2UserService;
import com.ivanfranchin.movieapi.user.User;
import com.ivanfranchin.movieapi.user.UserNotFoundException;
import com.ivanfranchin.movieapi.user.UserService;
import com.ivanfranchin.movieapi.security.oauth2.OAuth2Provider;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
@Import(SecurityConfig.class)
class UserControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    UserService userService;

    @MockitoBean
    CustomOAuth2UserService customOAuth2UserService;

    @MockitoBean
    CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler;

    @MockitoBean
    TokenProvider tokenProvider;

    @MockitoBean
    CustomUserDetailsService customUserDetailsService;

    @Test
    void getCurrentUser_asAdmin_returns200() throws Exception {
        CustomUserDetails principal = CustomUserDetails.ofLocalUser(
                1L, "admin", "encoded", "Admin User", "admin@example.com",
                List.of(new SimpleGrantedAuthority("ADMIN")));

        mockMvc.perform(get("/api/users/me")
                        .with(SecurityMockMvcRequestPostProcessors.user(principal)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("admin"))
                .andExpect(jsonPath("$.email").value("admin@example.com"))
                .andExpect(jsonPath("$.role").value("ADMIN"));
    }

    @Test
    void getCurrentUser_asUser_returns200() throws Exception {
        CustomUserDetails principal = CustomUserDetails.ofLocalUser(
                2L, "user", "encoded", "Regular User", "user@example.com",
                List.of(new SimpleGrantedAuthority("USER")));

        mockMvc.perform(get("/api/users/me")
                        .with(SecurityMockMvcRequestPostProcessors.user(principal)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("user"))
                .andExpect(jsonPath("$.role").value("USER"));
    }

    @Test
    void getCurrentUser_unauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void getUsers_asAdmin_returns200() throws Exception {
        User alice = createUser("alice");
        User bob = createUser("bob");
        when(userService.getUsers()).thenReturn(List.of(alice, bob));

        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].username").value("alice"))
                .andExpect(jsonPath("$[1].username").value("bob"));
    }

    @Test
    @WithMockUser(authorities = "USER")
    void getUsers_asUser_returns403() throws Exception {
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isForbidden());
    }

    @Test
    void getUsers_unauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void getUser_asAdmin_exists_returns200() throws Exception {
        User alice = createUser("alice");
        when(userService.validateAndGetUserByUsername("alice")).thenReturn(alice);

        mockMvc.perform(get("/api/users/alice"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("alice"));
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void getUser_asAdmin_notFound_returns404() throws Exception {
        when(userService.validateAndGetUserByUsername("ghost"))
                .thenThrow(new UserNotFoundException("User with username ghost not found"));

        mockMvc.perform(get("/api/users/ghost"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(authorities = "USER")
    void getUser_asUser_returns403() throws Exception {
        mockMvc.perform(get("/api/users/alice"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void deleteUser_asAdmin_exists_returns200() throws Exception {
        User alice = createUser("alice");
        when(userService.validateAndGetUserByUsername("alice")).thenReturn(alice);

        mockMvc.perform(delete("/api/users/alice"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("alice"));
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void deleteUser_asAdmin_notFound_returns404() throws Exception {
        when(userService.validateAndGetUserByUsername("ghost"))
                .thenThrow(new UserNotFoundException("User with username ghost not found"));

        mockMvc.perform(delete("/api/users/ghost"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(authorities = "USER")
    void deleteUser_asUser_returns403() throws Exception {
        mockMvc.perform(delete("/api/users/alice"))
                .andExpect(status().isForbidden());
    }

    @Test
    void deleteUser_unauthenticated_returns401() throws Exception {
        mockMvc.perform(delete("/api/users/alice"))
                .andExpect(status().isUnauthorized());
    }

    private User createUser(String username) {
        return new User(username, "encoded-password", username + " Name",
                username + "@example.com", "USER", null, OAuth2Provider.LOCAL, null);
    }
}
