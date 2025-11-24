package com.survey.backend.services;

import org.springframework.core.env.Environment;
import org.springframework.stereotype.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.*;

import com.survey.backend.apis.GoogleOAuthApi;
import com.survey.backend.apis.GoogleResourceApi;
import com.survey.backend.configs.jwt.JWToken;
import com.survey.backend.dtos.GoogleResourceDTO;
import com.survey.backend.dtos.GoogleTokenDTO;
import com.survey.backend.entities.User;
import com.survey.backend.enums.AuthProvider;
import com.survey.backend.repositories.UserRepository;

import lombok.*;

@Service
@RequiredArgsConstructor
@Transactional
public class OAuthService {
    private final Environment env;
    private final GoogleOAuthApi googleOAuthApi;
    private final GoogleResourceApi googleResourceApi;
    private final UserRepository userRepository;
    private final JWToken jwToken;

    public String loginWithGoogle(String code) {
        String accessToken = requestAccessToken(code);
        GoogleResourceDTO profile = requestUserInfo(accessToken);
        User user = userRepository.findByEmail(profile.getEmail())
                .orElseGet(() -> registerOAuthUser(profile));

        return jwToken.createToken(
                user.getUserId(),
                user.getEmail(),
                user.getAuthProvider());
    }

    private String requestAccessToken(String code) {
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("code", code);
        params.add("client_id", env.getProperty("oauth2.google.client-id"));
        params.add("client_secret", env.getProperty("oauth2.google.client-secret"));
        params.add("redirect_uri", env.getProperty("oauth2.google.redirect-uri"));
        params.add("grant_type", "authorization_code");

        GoogleTokenDTO tokenDTO = googleOAuthApi.requestToken(
                code,
                env.getProperty("oauth2.google.client-id"),
                env.getProperty("oauth2.google.client-secret"),
                env.getProperty("oauth2.google.redirect-uri"),
                "authorization_code");

        return tokenDTO.getAccessToken();
    }

    private GoogleResourceDTO requestUserInfo(String accessToken) {
        return googleResourceApi.getUserInfo("Bearer " + accessToken);
    }

    private User registerOAuthUser(GoogleResourceDTO p) {
        User user = User.builder()
                .email(p.getEmail())
                .oauthId(p.getId())
                .authProvider(AuthProvider.GOOGLE)
                .password(null)
                .build();

        return userRepository.save(user);
    }
}