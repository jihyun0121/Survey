package com.survey.backend.controllers;

import java.util.*;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.survey.backend.dtos.AnswerDTO;
import com.survey.backend.services.AnswerService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/answers")
public class AnswerController {
    private final AnswerService answerService;

    @PostMapping
    public ResponseEntity<?> saveAnswers(@RequestBody AnswerDTO dto) {
        AnswerDTO save = answerService.saveAnswers(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(save);
    }

    @GetMapping("/{answerId}")
    public ResponseEntity<?> getAnswer(@PathVariable Long answerId) {
        AnswerDTO answer = answerService.getAnswer(answerId);
        return ResponseEntity.ok(answer);
    }

    @GetMapping("/user/{userId}/forms/{formId}")
    public ResponseEntity<?> getUserAnswerForForm(@PathVariable Long userId, @PathVariable Long formId) {
        List<AnswerDTO> answers = answerService.getUserAnswerForForm(userId, formId);
        return ResponseEntity.ok(answers);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteForm(@PathVariable Long userId) {
        answerService.deleteAnswer(userId);
        return ResponseEntity.ok(Map.of("message", "응답 삭제"));
    }

}