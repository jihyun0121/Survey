package com.survey.backend.controllers;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.survey.backend.dtos.OptionDTO;
import com.survey.backend.services.OptionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/options")
public class OptionController {
    private final OptionService optionService;

    @PostMapping
    public ResponseEntity<?> createOption(@RequestBody OptionDTO dto) {
        OptionDTO created = optionService.createOption(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}