package com.survey.backend.services;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.survey.backend.repositories.StatisticRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StatisticService {
    private final StatisticRepository statisticRepository;

    public List<Long> getSurveyHistory(Long userId) {
        return statisticRepository.findByUser_UserId(userId).stream()
                .map(a -> a.getQuestion().getForm().getFormId())
                .distinct()
                .toList();
    }

    public Map<String, Long> getDuplicateCount(Long questionId) {
        return statisticRepository.findByQuestion_QuestionIdAndOptionIsNull(questionId).stream()
                .map(a -> a.getAnswerText() != null ? a.getAnswerText().trim()
                        : a.getAnswerLong() != null ? a.getAnswerLong().trim()
                                : null)
                .filter(text -> text != null && !text.isBlank())
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));
    }

    public long getAnswerCount(Long questionId) {
        return statisticRepository.countDistinctUserAnsweredQuestion(questionId);
    }
}