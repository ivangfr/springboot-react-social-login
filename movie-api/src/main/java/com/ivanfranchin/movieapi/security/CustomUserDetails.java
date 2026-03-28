package com.ivanfranchin.movieapi.security;

import com.ivanfranchin.movieapi.security.oauth2.OAuth2Provider;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class CustomUserDetails implements OAuth2User, UserDetails {

    private final Long id;
    private final String username;
    private final String password;
    private final String name;
    private final String email;
    private final String avatarUrl;
    private final OAuth2Provider provider;
    private final Collection<? extends GrantedAuthority> authorities;
    private final Map<String, Object> attributes;

    public static CustomUserDetails ofLocalUser(Long id, String username, String password,
            String name, String email,
            Collection<? extends GrantedAuthority> authorities) {
        return new CustomUserDetails(id, username, password, name, email, null, null, authorities, Collections.emptyMap());
    }

    public static CustomUserDetails ofOAuth2User(String username, String name, String email,
            String avatarUrl, OAuth2Provider provider,
            Collection<? extends GrantedAuthority> authorities,
            Map<String, Object> attributes) {
        return new CustomUserDetails(null, username, null, name, email, avatarUrl, provider, authorities, attributes);
    }

    public CustomUserDetails withId(Long id) {
        return new CustomUserDetails(id, username, password, name, email, avatarUrl, provider, authorities, attributes);
    }
}
