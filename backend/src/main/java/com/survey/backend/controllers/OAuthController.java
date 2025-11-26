package com.survey.backend.controllers;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.survey.backend.services.OAuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class OAuthController {
    private final OAuthService oAuthService;

    @GetMapping("/auth/login/google")
    public ResponseEntity<?> googleCallback(@RequestParam String code) {
        Map<String, Object> result = oAuthService.loginWithGoogle(code);
        return ResponseEntity.ok(result);
    }
}