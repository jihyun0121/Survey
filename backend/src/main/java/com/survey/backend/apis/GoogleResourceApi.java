package com.survey.backend.apis;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import com.survey.backend.dtos.GoogleResourceDTO;

@FeignClient(name = "GoogleResource", url = "https://www.googleapis.com")
public interface GoogleResourceApi {
    @GetMapping("/oauth2/v2/userinfo")
    GoogleResourceDTO getUserInfo(@RequestHeader("Authorization") String bearerToken);
}