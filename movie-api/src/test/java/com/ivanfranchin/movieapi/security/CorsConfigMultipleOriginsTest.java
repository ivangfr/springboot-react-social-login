package com.ivanfranchin.movieapi.security;

import com.ivanfranchin.movieapi.movie.MovieService;
import com.ivanfranchin.movieapi.rest.PublicController;
import com.ivanfranchin.movieapi.security.oauth2.CustomAuthenticationSuccessHandler;
import com.ivanfranchin.movieapi.security.oauth2.CustomOAuth2UserService;
import com.ivanfranchin.movieapi.user.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpMethod;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

@WebMvcTest(PublicController.class)
@Import({SecurityConfig.class, CorsConfig.class})
@TestPropertySource(properties = "app.cors.allowed-origins=http://localhost:3000,http://localhost:4000")
class CorsConfigMultipleOriginsTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private MovieService movieService;

    @MockitoBean
    private CustomOAuth2UserService customOAuth2UserService;

    @MockitoBean
    private CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler;

    @MockitoBean
    private TokenProvider tokenProvider;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;

    private MockMvc mockMvc() {
        return webAppContextSetup(webApplicationContext)
                .apply(springSecurity())
                .build();
    }

    @Test
    void preflight_firstAllowedOrigin_receivesCorsHeaders() throws Exception {
        mockMvc().perform(options("/public/numberOfUsers")
                        .header("Origin", "http://localhost:3000")
                        .header("Access-Control-Request-Method", HttpMethod.GET.name()))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:3000"));
    }

    @Test
    void preflight_secondAllowedOrigin_receivesCorsHeaders() throws Exception {
        mockMvc().perform(options("/public/numberOfUsers")
                        .header("Origin", "http://localhost:4000")
                        .header("Access-Control-Request-Method", HttpMethod.GET.name()))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:4000"));
    }
}
