package com.ivanfranchin.movieapi.security.oauth2;

import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;

import com.ivanfranchin.movieapi.security.CustomUserDetails;

public interface OAuth2UserInfoExtractor {

  CustomUserDetails extractUserInfo(OAuth2User oAuth2User);

  boolean accepts(OAuth2UserRequest userRequest);
}
