package com.survey.backend.services;

import java.util.*;

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
}