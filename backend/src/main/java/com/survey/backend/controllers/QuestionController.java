package com.survey.backend.controllers;

import java.util.Map;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.survey.backend.dtos.QuestionDTO;
import com.survey.backend.dtos.QuestionOrderDTO;
import com.survey.backend.dtos.RequiredQuestionDTO;
import com.survey.backend.services.QuestionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/questions")
public class QuestionController {
    private final QuestionService questionService;

    @PostMapping
    public ResponseEntity<?> createQuestion(@RequestBody QuestionDTO dto) {
        QuestionDTO created = questionService.createQuestion(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{questionId}")
    public ResponseEntity<?> getQuestion(@PathVariable Long questionId) {
        QuestionDTO question = questionService.getQuestion(questionId);
        return ResponseEntity.ok(question);
    }

    @PutMapping("/{questionId}")
    public ResponseEntity<?> updateQuestion(@PathVariable Long questionId, @RequestBody QuestionDTO dto) {
        QuestionDTO question = questionService.updateQuestion(questionId, dto);
        return ResponseEntity.ok(question);
    }

    @PatchMapping("/{questionId}/required")
    public ResponseEntity<?> setRequired(@PathVariable Long questionId, @RequestParam Boolean isRequired) {
        RequiredQuestionDTO state = questionService.setRequired(questionId, isRequired);
        return ResponseEntity.ok(Map.of("message", "질문 필수여부 변경", "상태", state));
    }

    @PatchMapping("/order")
    public ResponseEntity<?> reorderQuestions(@RequestBody QuestionOrderDTO dto) {
        QuestionOrderDTO order = questionService.reorderQuestions(dto);
        return ResponseEntity.ok(Map.of("message", "질문 순서 변경", "순서", order));
    }

    @DeleteMapping("/{questionId}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long questionId) {
        questionService.deleteQuestion(questionId);
        return ResponseEntity.ok(Map.of("message", "질문 삭제"));
    }
}