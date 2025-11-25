package com.survey.backend.controllers;

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
}