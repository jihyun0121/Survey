package com.survey.backend.controllers;

import java.util.*;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.survey.backend.dtos.FormDTO;
import com.survey.backend.dtos.FormPublishDTO;
import com.survey.backend.dtos.QuestionDTO;
import com.survey.backend.services.FormService;
import com.survey.backend.services.QuestionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/forms")
public class FormController {
    private final FormService formService;
    private final QuestionService questionService;

    @PostMapping
    public ResponseEntity<?> createForm(@RequestBody FormDTO dto) {
        FormDTO created = formService.createForm(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{formId}")
    public ResponseEntity<?> getForm(@PathVariable Long formId) {
        FormDTO form = formService.getForm(formId);
        return ResponseEntity.ok(form);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getFormsByUser(@PathVariable Long userId) {
        List<FormDTO> forms = formService.getFormsByUser(userId);
        return ResponseEntity.ok(forms);
    }

    @GetMapping("/{formId}/questions")
    public ResponseEntity<?> getQuestionsByForm(@PathVariable Long formId) {
        List<QuestionDTO> question = questionService.getQuestionsByForm(formId);
        return ResponseEntity.ok(question);
    }

    @PutMapping("/{formId}")
    public ResponseEntity<?> updateForm(@PathVariable Long formId, @RequestBody FormDTO dto) {
        FormDTO form = formService.updateForm(formId, dto);
        return ResponseEntity.ok(form);
    }

    @PatchMapping("/{formId}/publish")
    public ResponseEntity<?> publishForm(@PathVariable Long formId, @RequestParam Boolean isPublic) {
        FormPublishDTO state = formService.publishForm(formId, isPublic);
        return ResponseEntity.ok(Map.of("message", "게시 상태가 변경되었습니다.", "게시됨", state));
    }

    @DeleteMapping("/{formId}")
    public ResponseEntity<?> deleteForm(@PathVariable Long formId) {
        formService.deleteForm(formId);
        return ResponseEntity.ok(Map.of("message", "설문이 삭제되었습니다"));
    }
}