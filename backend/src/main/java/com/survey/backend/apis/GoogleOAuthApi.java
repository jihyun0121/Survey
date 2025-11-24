package com.survey.backend.apis;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import com.survey.backend.dtos.GoogleTokenDTO;

@FeignClient(name = "GoogleOAuth", url = "https://oauth2.googleapis.com")
public interface GoogleOAuthApi {
    @PostMapping(value = "/token", consumes = "application/x-www-form-urlencoded")
    GoogleTokenDTO requestToken(@RequestParam("code") String code, @RequestParam("client_id") String clientId,
            @RequestParam("client_secret") String clientSecret, @RequestParam("redirect_uri") String redirectUri,
            @RequestParam("grant_type") String grantType);
}