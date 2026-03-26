package com.ivanfranchin.movieapi.rest;

import com.ivanfranchin.movieapi.rest.dto.LoginRequest;
import com.ivanfranchin.movieapi.rest.dto.SignUpRequest;
import com.ivanfranchin.movieapi.security.SecurityConfig;
import com.ivanfranchin.movieapi.security.TokenProvider;
import com.ivanfranchin.movieapi.security.oauth2.CustomAuthenticationSuccessHandler;
import com.ivanfranchin.movieapi.security.oauth2.CustomOAuth2UserService;
import com.ivanfranchin.movieapi.user.UserService;
import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@Import(SecurityConfig.class)
class AuthControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockitoBean
    UserService userService;

    @MockitoBean
    AuthenticationManager authenticationManager;

    @MockitoBean
    TokenProvider tokenProvider;

    @MockitoBean
    PasswordEncoder passwordEncoder;

    @MockitoBean
    CustomOAuth2UserService customOAuth2UserService;

    @MockitoBean
    CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler;

    @MockitoBean
    UserDetailsService userDetailsService;

    @Test
    void login_validCredentials_returns200WithToken() throws Exception {
        var auth = new UsernamePasswordAuthenticationToken("admin", null,
                List.of(new SimpleGrantedAuthority("ADMIN")));
        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(tokenProvider.generate(auth)).thenReturn("test-jwt-token");

        mockMvc.perform(post("/auth/authenticate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new LoginRequest("admin", "admin"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("test-jwt-token"));
    }

    @Test
    void login_blankUsername_returns400() throws Exception {
        mockMvc.perform(post("/auth/authenticate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new LoginRequest("", "admin"))))
                .andExpect(status().isBadRequest());
    }

    @Test
    void login_blankPassword_returns400() throws Exception {
        mockMvc.perform(post("/auth/authenticate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new LoginRequest("admin", ""))))
                .andExpect(status().isBadRequest());
    }

    @Test
    void signUp_newUser_returns201WithToken() throws Exception {
        when(userService.hasUserWithUsername("newuser")).thenReturn(false);
        when(userService.hasUserWithEmail("new@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("encoded-password");

        var auth = new UsernamePasswordAuthenticationToken("newuser", null,
                List.of(new SimpleGrantedAuthority("USER")));
        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(tokenProvider.generate(auth)).thenReturn("signup-jwt-token");

        var request = new SignUpRequest("newuser", "password", "New User", "new@example.com");
        mockMvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accessToken").value("signup-jwt-token"));
    }

    @Test
    void signUp_duplicateUsername_returns409() throws Exception {
        when(userService.hasUserWithUsername("existing")).thenReturn(true);

        var request = new SignUpRequest("existing", "password", "Existing User", "existing@example.com");
        mockMvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
    }

    @Test
    void signUp_duplicateEmail_returns409() throws Exception {
        when(userService.hasUserWithUsername("newuser")).thenReturn(false);
        when(userService.hasUserWithEmail("taken@example.com")).thenReturn(true);

        var request = new SignUpRequest("newuser", "password", "New User", "taken@example.com");
        mockMvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
    }

    @Test
    void signUp_invalidEmail_returns400() throws Exception {
        var request = new SignUpRequest("newuser", "password", "New User", "not-an-email");
        mockMvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void signUp_blankFields_returns400() throws Exception {
        var request = new SignUpRequest("", "", "", "");
        mockMvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void signUp_concurrentDuplicate_returns409() throws Exception {
        when(userService.hasUserWithUsername("newuser")).thenReturn(false);
        when(userService.hasUserWithEmail("new@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("encoded-password");
        when(userService.saveUser(any())).thenThrow(new DataIntegrityViolationException("duplicate key"));

        var request = new SignUpRequest("newuser", "password", "New User", "new@example.com");
        mockMvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
    }
}
