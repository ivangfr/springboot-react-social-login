package com.ivanfranchin.movieapi.security.oauth2;

import com.fasterxml.jackson.annotation.JsonProperty;

public record GithubOAuth2User(String id, String login, String name, String email,
                               @JsonProperty("avatar_url") String avatarUrl) {
}
