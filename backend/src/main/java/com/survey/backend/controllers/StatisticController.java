package com.survey.backend.controllers;

import java.nio.charset.StandardCharsets;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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

    @GetMapping("/questions/{questionId}/options")
    public ResponseEntity<?> getOptionStats(@PathVariable Long questionId) {
        return ResponseEntity.ok(statisticService.getOptionStats(questionId));
    }

    @GetMapping("/questions/{questionId}/checkbox")
    public ResponseEntity<?> getCheckboxGroupStats(@PathVariable Long questionId) {
        return ResponseEntity.ok(statisticService.getCheckboxGroupStats(questionId));
    }

    @GetMapping("/questions/{questionId}/text")
    public ResponseEntity<?> getTextAnswers(@PathVariable Long questionId) {
        return ResponseEntity.ok(statisticService.getTextAnswers(questionId));
    }

    @GetMapping("/forms/{formId}/live")
    public ResponseEntity<?> streamLiveStats(@PathVariable Long formId) {
        return ResponseEntity.ok(statisticService.streamLiveStats(formId));
    }

    @GetMapping("/forms/{formId}/coded")
    public ResponseEntity<?> getCodedData(@PathVariable Long formId) {
        return ResponseEntity.ok(statisticService.getCodedData(formId));
    }

    @GetMapping("/forms/{formId}/export/xls")
    public ResponseEntity<byte[]> downloadExcel(@PathVariable Long formId) {
        byte[] fileBytes = statisticService.downloadExcel(formId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);

        ContentDisposition disposition = ContentDisposition.attachment()
                .filename("form_" + formId + ".xls", StandardCharsets.UTF_8)
                .build();
        headers.setContentDisposition(disposition);

        return new ResponseEntity<>(fileBytes, headers, HttpStatus.OK);
    }

    @GetMapping("/forms/{formId}/export/csv")
    public ResponseEntity<byte[]> downloadCSV(@PathVariable Long formId) {
        byte[] fileBytes = statisticService.downloadCSV(formId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("text", "csv", StandardCharsets.UTF_8));

        ContentDisposition disposition = ContentDisposition.attachment()
                .filename("form_" + formId + ".csv", StandardCharsets.UTF_8)
                .build();
        headers.setContentDisposition(disposition);

        return new ResponseEntity<>(fileBytes, headers, HttpStatus.OK);
    }
}