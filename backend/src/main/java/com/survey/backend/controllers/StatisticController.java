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
}