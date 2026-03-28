package com.ivanfranchin.movieapi.security.oauth2;

import com.ivanfranchin.movieapi.user.User;
import com.ivanfranchin.movieapi.security.CustomUserDetails;
import com.ivanfranchin.movieapi.security.Role;
import com.ivanfranchin.movieapi.user.UserService;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserService userService;
    private final List<OAuth2UserInfoExtractor> oAuth2UserInfoExtractors;

    public CustomOAuth2UserService(UserService userService, List<OAuth2UserInfoExtractor> oAuth2UserInfoExtractors) {
        this.userService = userService;
        this.oAuth2UserInfoExtractors = oAuth2UserInfoExtractors;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        CustomUserDetails customUserDetails = oAuth2UserInfoExtractors.stream()
                .filter(extractor -> extractor.accepts(userRequest))
                .findFirst()
                .orElseThrow(() -> new InternalAuthenticationServiceException("The OAuth2 provider is not supported yet"))
                .extractUserInfo(oAuth2User);

        User user = upsertUser(customUserDetails);
        return customUserDetails.withId(user.getId());
    }

    private User upsertUser(CustomUserDetails customUserDetails) {
        User user = userService.getUserByUsername(customUserDetails.getUsername())
                .map(existing -> {
                    existing.setEmail(customUserDetails.getEmail());
                    existing.setImageUrl(customUserDetails.getAvatarUrl());
                    return existing;
                })
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setUsername(customUserDetails.getUsername());
                    newUser.setName(customUserDetails.getName());
                    newUser.setEmail(customUserDetails.getEmail());
                    newUser.setImageUrl(customUserDetails.getAvatarUrl());
                    newUser.setProvider(customUserDetails.getProvider());
                    newUser.setRole(Role.USER);                    return newUser;
                });
        return userService.saveUser(user);
    }
}
