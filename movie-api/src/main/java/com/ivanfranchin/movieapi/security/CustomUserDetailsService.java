package com.ivanfranchin.movieapi.security;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.ivanfranchin.movieapi.user.User;
import com.ivanfranchin.movieapi.user.UserService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class CustomUserDetailsService implements UserDetailsService {

  private final UserService userService;

  @Override
  public UserDetails loadUserByUsername(String username) {
    User user =
        userService
            .getUserByUsername(username)
            .orElseThrow(
                () -> new UsernameNotFoundException("Username %s not found".formatted(username)));
    return CustomUserDetails.ofLocalUser(
        user.getId(),
        user.getUsername(),
        user.getPassword(),
        user.getName(),
        user.getEmail(),
        List.of(new SimpleGrantedAuthority(user.getRole().name())));
  }
}
