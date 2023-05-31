package com.ivanfranchin.movieapi.security.oauth2;

import com.ivanfranchin.movieapi.security.CustomUserDetails;
import com.ivanfranchin.movieapi.security.WebSecurityConfig;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class GitHubOAuth2UserInfoExtractor implements OAuth2UserInfoExtractor {

    @Override
    public CustomUserDetails extractUserInfo(OAuth2User oAuth2User) {
        CustomUserDetails customUserDetails = new CustomUserDetails();
        customUserDetails.setUsername(retrieveAttr("login", oAuth2User));
        customUserDetails.setName(retrieveAttr("name", oAuth2User));
        customUserDetails.setEmail(retrieveAttr("email", oAuth2User));
        customUserDetails.setAvatarUrl(retrieveAttr("avatar_url", oAuth2User));
        customUserDetails.setProvider(OAuth2Provider.GITHUB);
        customUserDetails.setAttributes(oAuth2User.getAttributes());
        customUserDetails.setAuthorities(Collections.singletonList(new SimpleGrantedAuthority(WebSecurityConfig.USER)));
        return customUserDetails;
    }

    @Override
    public boolean accepts(OAuth2UserRequest userRequest) {
        return OAuth2Provider.GITHUB.name().equalsIgnoreCase(userRequest.getClientRegistration().getRegistrationId());
    }

    private String retrieveAttr(String attr, OAuth2User oAuth2User) {
        Object attribute = oAuth2User.getAttributes().get(attr);
        return attribute == null ? "" : attribute.toString();
    }
}
