package com.ivanfranchin.movieapi.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.util.ReflectionTestUtils;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class TokenProviderTest {

    // 64-byte key (512 bits) required for HS512
    private static final String SECRET =
            "v9y$B&E)H@MbQeThWmZq4t7w!z%C*F-JaNdRfUjXn2r5u8x/A?D(G+KbPeShVkYp";
    private static final long EXPIRATION_MINUTES = 10L;

    private TokenProvider tokenProvider;

    @BeforeEach
    void setUp() {
        tokenProvider = new TokenProvider();
        ReflectionTestUtils.setField(tokenProvider, "jwtSecret", SECRET);
        ReflectionTestUtils.setField(tokenProvider, "jwtExpirationMinutes", EXPIRATION_MINUTES);
    }

    @Test
    void generate_returnsValidJwt_withExpectedSubject() {
        CustomUserDetails userDetails = CustomUserDetails.ofLocalUser(
                1L, "alice", "pw", "Alice", "alice@example.com",
                List.of(new SimpleGrantedAuthority("USER")));
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        String token = tokenProvider.generate(auth);

        assertThat(token).isNotBlank();
        Optional<Jws<Claims>> jws = tokenProvider.validateTokenAndGetJws(token);
        assertThat(jws).isPresent();
        assertThat(jws.get().getPayload().getSubject()).isEqualTo("alice");
    }

    @Test
    void validateTokenAndGetJws_withValidToken_returnsJws() {
        CustomUserDetails userDetails = CustomUserDetails.ofLocalUser(
                2L, "bob", "pw", "Bob", "bob@example.com",
                List.of(new SimpleGrantedAuthority("ADMIN")));
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        String token = tokenProvider.generate(auth);
        Optional<Jws<Claims>> result = tokenProvider.validateTokenAndGetJws(token);

        assertThat(result).isPresent();
        assertThat(result.get().getPayload().getSubject()).isEqualTo("bob");
    }

    @Test
    void validateTokenAndGetJws_withExpiredToken_returnsEmpty() {
        byte[] key = SECRET.getBytes(StandardCharsets.UTF_8);
        Instant past = Instant.now().minusSeconds(3600);
        String expiredToken = Jwts.builder()
                .subject("charlie")
                .issuedAt(Date.from(past))
                .expiration(Date.from(past.plusSeconds(1)))
                .id(UUID.randomUUID().toString())
                .signWith(Keys.hmacShaKeyFor(key), Jwts.SIG.HS512)
                .compact();

        Optional<Jws<Claims>> result = tokenProvider.validateTokenAndGetJws(expiredToken);

        assertThat(result).isEmpty();
    }

    @Test
    void validateTokenAndGetJws_withMalformedToken_returnsEmpty() {
        Optional<Jws<Claims>> result = tokenProvider.validateTokenAndGetJws("this.is.not.a.valid.jwt");

        assertThat(result).isEmpty();
    }

    @Test
    void validateTokenAndGetJws_withWrongKeyToken_returnsEmpty() {
        String differentSecret = "AnotherSecretKey1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmn";
        byte[] wrongKey = differentSecret.getBytes(StandardCharsets.UTF_8);
        String tokenSignedWithWrongKey = Jwts.builder()
                .subject("dave")
                .issuedAt(Date.from(Instant.now()))
                .expiration(Date.from(Instant.now().plusSeconds(600)))
                .id(UUID.randomUUID().toString())
                .signWith(Keys.hmacShaKeyFor(wrongKey), Jwts.SIG.HS512)
                .compact();

        Optional<Jws<Claims>> result = tokenProvider.validateTokenAndGetJws(tokenSignedWithWrongKey);

        assertThat(result).isEmpty();
    }
}
