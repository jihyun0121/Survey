package com.survey.backend.controllers;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.survey.backend.dtos.FormDTO;
import com.survey.backend.services.FormService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/forms")
public class FormController {
    private final FormService formService;

    @PostMapping
    public ResponseEntity<?> createForm(@RequestBody FormDTO dto) {
        FormDTO created = formService.createForm(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}