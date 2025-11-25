package com.survey.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.survey.backend.services.StatisticService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/statistics")
public class StatisticController {
    private final StatisticService statisticService;

    @GetMapping("/questions/{questionId}/duplicate")
    public ResponseEntity<?> getDuplicateCount(@PathVariable Long questionId) {
        return ResponseEntity.ok(statisticService.getDuplicateCount(questionId));
    }

    @GetMapping("/questions/{questionId}/count")
    public ResponseEntity<?> getAnswerCount(@PathVariable Long questionId) {
        return ResponseEntity.ok(statisticService.getAnswerCount(questionId));
    }

    @GetMapping("/questions/{questionId}/unanswered")
    public ResponseEntity<?> getUnansweredCount(@PathVariable Long questionId) {
        return ResponseEntity.ok(statisticService.getUnansweredCount(questionId));
    }

    @GetMapping("/forms/{formId}")
    public ResponseEntity<?> getFormStatistics(@PathVariable Long formId) {
        return ResponseEntity.ok(statisticService.getFormStatistics(formId));
    }
}