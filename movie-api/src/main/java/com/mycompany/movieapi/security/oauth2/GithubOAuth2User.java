package com.mycompany.movieapi.security.oauth2;

import lombok.Data;

@Data
public class GithubOAuth2User {

    private String id;
    private String login;
    private String name;
    private String email;
    private String avatar_url;

}
