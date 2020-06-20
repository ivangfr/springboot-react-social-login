package com.mycompany.movieapi.security.oauth2;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class GithubOAuth2User {

    private String id;
    private String login;
    private String name;
    private String email;

    @JsonProperty("avatar_url")
    private String avatarUrl;

}
