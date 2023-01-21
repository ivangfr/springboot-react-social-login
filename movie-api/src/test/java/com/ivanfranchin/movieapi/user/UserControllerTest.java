package com.ivanfranchin.movieapi.user;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.hamcrest.CoreMatchers.*; // is()
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ivanfranchin.movieapi.model.User;
import com.ivanfranchin.movieapi.repository.UserRepository;
import com.ivanfranchin.movieapi.rest.dto.LoginRequest;
import com.ivanfranchin.movieapi.rest.dto.SignUpRequest;
import com.ivanfranchin.movieapi.service.UserService;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;


@TestPropertySource("/application-test.properties")
@AutoConfigureMockMvc(addFilters = false)
@SpringBootTest
@Transactional
public class UserControllerTest {
    
    @PersistenceContext
    private EntityManager entityManager;

    private static MockHttpServletRequest mockHttpRequest;

    @Mock
    UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private LoginRequest loginRequest;

    @Autowired
    private SignUpRequest signUpRequest;

    @Autowired
    private JdbcTemplate jdbc;   

    @Autowired
    private User user;

    @MockBean
    private JwtDecoder jwtDecoder;

    @Value("${sql.script.insert.user}")
    private String sqlInsertUser;

    @Value("${sql.script.delete.users}")
    private String sqlDeleteUser;

    public static final MediaType APPLICATION_JSON_UTF8 = MediaType.APPLICATION_JSON;

    @BeforeAll
    static void setupMock() {
        mockHttpRequest = new MockHttpServletRequest();

        mockHttpRequest.setParameter("username", "Jane");
        mockHttpRequest.setParameter("email", "jane@test.com");
    }

    @BeforeEach
    void setupDbBeforeTransactions() throws Exception {
        jdbc.execute(sqlInsertUser);
    }

    @Test
    void getNumberOfUsersHttpRequest() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/public/numberOfUsers"))
                .andExpect(status().isOk()).andExpect(jsonPath("$", is(3)));
    }

    @Test
    void testAuthenticateUserHttpRequest() throws Exception {
        signUpRequest.setEmail("jane@test.com");       
        signUpRequest.setUsername("jane");
        signUpRequest.setName("Jane");
        signUpRequest.setPassword("jane");

        assertFalse(userRepository.findByUsername("jane").isPresent(), "should return false");

        mockMvc.perform(MockMvcRequestBuilders.post("/auth/signup")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(signUpRequest)))
                .andExpect(status().is2xxSuccessful())
                .andExpect(jsonPath("$.accessToken", is(notNullValue())))
                .andDo(print());

        assertTrue(userRepository.findByUsername("jane").isPresent(), "should return true");
    }

    @Test
    void testSignupAuthenticatedUserHttpRequest() throws Exception {
        String username = "admin";
        String password = "admin";

        loginRequest.setUsername(username);
        loginRequest.setPassword(password);

        assertTrue(userRepository.findByUsername(username).isPresent(), "should return true");

        mockMvc.perform(MockMvcRequestBuilders.post("/auth/authenticate")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(loginRequest))
                    )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken", is(notNullValue())))
                .andDo(print());
    }

    @Test
    @WithMockUser(username = "admin", password = "admin", roles = "ADMIN")
    void getNonExistingUserByUsernameHttpRequest() throws Exception {
        String nonExistingUsername = "Kaneee";

        assertFalse(userRepository.findByUsername(nonExistingUsername).isPresent(), "should return true");

        mockMvc.perform(MockMvcRequestBuilders.get("/api/users/{username}", nonExistingUsername))
                .andExpect(status().is4xxClientError())
                .andDo(print());
    }

    @Test
    @WithMockUser(username = "admin", password = "admin", roles = "ADMIN")
    void getUserByUsernameHttpRequest() throws Exception {
        user.setEmail("jane@test.com");       
        user.setUsername("jane");
        user.setName("Jane");
        user.setPassword("password");
        user.setRole("USER");

        entityManager.persist(user);
        entityManager.flush();

        assertTrue(userRepository.findByUsername("jane").isPresent(), "should return true");

        mockMvc.perform(MockMvcRequestBuilders.get("/api/users/{username}", "jane"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("$.id", is(3)))
                .andExpect(jsonPath("$.username", is("jane")))
                .andExpect(jsonPath("$.name", is( "Jane")))
                .andExpect(jsonPath("$.email", is("jane@test.com")))
                .andExpect(jsonPath("$.role", is("USER")))
                .andDo(print());
    }

    @Test
    @WithMockUser(username = "admin", password = "admin", roles = "ADMIN")
    void deleteNonExistingUserByUsernameHttpRequest() throws Exception {
        String nonExistingUsername = "Kaneeee";

        assertTrue(userRepository.findByUsername("Kane").isPresent(), "should return true for existing username");

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/users/{username}", nonExistingUsername))
                .andExpect(status().is4xxClientError())
                .andDo(print());
    }

    @Test
    @WithMockUser(username = "admin", password = "admin", roles = "ADMIN")
    void deleteUserByUsernameHttpRequest() throws Exception {
        String username = "Kane";

        assertTrue(userRepository.findByUsername(username).isPresent(), "should return true");

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/users/{username}", username))
                .andExpect(status().isOk())
                .andExpect(content().contentType(APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("$.id", is(11)))
                .andExpect(jsonPath("$.username", is("Kane")))
                .andExpect(jsonPath("$.name", is( "kane")))
                .andExpect(jsonPath("$.email", is("kane@test.com")))
                .andExpect(jsonPath("$.role", is("USER")))
                .andDo(print());

        assertFalse(userRepository.findByUsername(username).isPresent(), "should return false");
    }

    @AfterEach
    void setupDbAfterTransactions() throws Exception {
        jdbc.execute(sqlDeleteUser);
    }
}
