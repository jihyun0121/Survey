package com.survey.backend.controllers;

import java.util.*;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.survey.backend.dtos.UserAuthDTO;
import com.survey.backend.dtos.UserDTO;
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
                "token", token));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable("userId") Long userId) {
        try {
            UserDTO user = userService.getProfile(userId);
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "사용자 조회 실패"));
        }
    }
}