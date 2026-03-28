package com.ivanfranchin.movieapi.rest.dto;

import com.ivanfranchin.movieapi.security.CustomUserDetails;
import com.ivanfranchin.movieapi.security.Role;
import com.ivanfranchin.movieapi.user.User;

public record UserDto(Long id, String username, String name, String email, Role role) {

    public static UserDto from(User user) {
        return new UserDto(
                user.getId(),
                user.getUsername(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

    public static UserDto from(CustomUserDetails user) {
        return new UserDto(
                user.getId(),
                user.getUsername(),
                user.getName(),
                user.getEmail(),
                user.getAuthorities().stream()
                        .findFirst()
                        .map(a -> Role.valueOf(a.getAuthority()))
                        .orElse(null)
        );
    }
}