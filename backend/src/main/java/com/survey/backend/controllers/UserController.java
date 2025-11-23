package com.survey.backend.controllers;

import java.util.*;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.survey.backend.dtos.UserAuthDTO;
import com.survey.backend.services.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody UserAuthDTO dto) {
        userService.signUp(dto);
        return ResponseEntity.ok(Map.of("message", "회원가입 성공"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserAuthDTO dto) {
        String token = userService.login(dto);
        return ResponseEntity.ok(Map.of(
                "message", "로그인 성공",
                "token", token
        ));
    }
}