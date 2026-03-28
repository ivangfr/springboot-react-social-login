package com.ivanfranchin.movieapi.security.oauth2;

import com.ivanfranchin.movieapi.security.CustomUserDetails;
import com.ivanfranchin.movieapi.security.Role;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GitHubOAuth2UserInfoExtractor implements OAuth2UserInfoExtractor {

    @Override
    public CustomUserDetails extractUserInfo(OAuth2User oAuth2User) {
        return CustomUserDetails.ofOAuth2User(
                retrieveAttr("login", oAuth2User),
                retrieveAttr("name", oAuth2User),
                retrieveAttr("email", oAuth2User),
                retrieveAttr("avatar_url", oAuth2User),
                OAuth2Provider.GITHUB,
                List.of(new SimpleGrantedAuthority(Role.USER.name())),
                oAuth2User.getAttributes()
        );
    }

    @Override
    public boolean accepts(OAuth2UserRequest userRequest) {
        return OAuth2Provider.GITHUB.name().equalsIgnoreCase(userRequest.getClientRegistration().getRegistrationId());
    }

    private String retrieveAttr(String attr, OAuth2User oAuth2User) {
        Object attribute = oAuth2User.getAttributes().get(attr);
        return attribute == null ? null : attribute.toString();
    }
}
