package com.survey.backend.services;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.survey.backend.entities.Answer;
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

    public long getUnansweredCount(Long questionId) {
        List<Answer> answers = statisticRepository.findByQuestion_QuestionId(questionId);

        if (answers.isEmpty()) {
            return 0L;
        }

        Long formId = answers.get(0).getQuestion().getForm().getFormId();

        long totalrespondent = statisticRepository.countDistinctUserByFormId(formId);
        long answered = statisticRepository.countDistinctUserAnsweredQuestion(questionId);

        return Math.max(totalrespondent - answered, 0L);
    }

    public Map<String, Object> getFormStatistics(Long formId) {
        List<Answer> answers = statisticRepository.findByQuestion_Form_FormId(formId);

        long totalAnswers = answers.size();
        long respondent = statisticRepository.countDistinctUserByFormId(formId);

        long textAnswers = answers.stream()
                .filter(a -> a.getOption() == null &&
                        ((a.getAnswerText() != null && !a.getAnswerText().isBlank())
                                || (a.getAnswerLong() != null && !a.getAnswerLong().isBlank())))
                .count();

        long optionAnswers = answers.stream()
                .filter(a -> a.getOption() != null)
                .count();

        return Map.of(
                "form_id", formId,
                "respondent", respondent,
                "total_answers", totalAnswers,
                "text_answers", textAnswers,
                "option_answers", optionAnswers);
    }

    public Map<Long, Double> getOptionStats(Long questionId) {
        List<Answer> answers = statisticRepository.findByQuestion_QuestionId(questionId);

        List<Answer> optionAnswers = answers.stream()
                .filter(a -> a.getOption() != null)
                .toList();

        long totalOptionAnswers = optionAnswers.size();

        if (totalOptionAnswers == 0) {
            return Collections.emptyMap();
        }

        return optionAnswers.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getOption().getOptionId(),
                        Collectors.collectingAndThen(
                                Collectors.counting(),
                                cnt -> (cnt * 100.0) / totalOptionAnswers)));
    }

    public Map<String, Long> getCheckboxGroupStats(Long questionId) {
        List<Answer> answers = statisticRepository.findByQuestion_QuestionId(questionId);

        Map<Long, List<Long>> byUser = answers.stream()
                .filter(a -> a.getOption() != null && a.getUser() != null)
                .collect(Collectors.groupingBy(
                        a -> a.getUser().getUserId(),
                        Collectors.mapping(a -> a.getOption().getOptionId(), Collectors.toList())));

        List<String> combinationKeys = byUser.values().stream()
                .map(list -> list.stream()
                        .sorted()
                        .map(String::valueOf)
                        .collect(Collectors.joining(",")))
                .toList();

        return combinationKeys.stream()
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));
    }
}