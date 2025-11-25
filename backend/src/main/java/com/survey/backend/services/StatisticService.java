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

    public List<String> getTextAnswers(Long questionId) {
        return statisticRepository.findByQuestion_QuestionIdAndOptionIsNull(questionId).stream()
                .map(a -> a.getAnswerText() != null ? a.getAnswerText() : a.getAnswerLong())
                .filter(Objects::nonNull)
                .filter(s -> !s.isBlank())
                .toList();
    }

    public Map<String, Object> streamLiveStats(Long formId) {
        long totalAnswers = statisticRepository.findByQuestion_Form_FormId(formId).size();
        long respondent = statisticRepository.countDistinctUserByFormId(formId);

        return Map.of(
                "form_id", formId,
                "timestamp", System.currentTimeMillis(),
                "respondent", respondent,
                "total_answers", totalAnswers);
    }

    public List<Map<String, Object>> getCodedData(Long formId) {
        List<Answer> answers = statisticRepository.findByQuestion_Form_FormId(formId);

        Map<Long, Map<Long, List<Answer>>> byUserThenQuestion = answers.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getUser().getUserId(),
                        Collectors.groupingBy(a -> a.getQuestion().getQuestionId())));

        List<Map<String, Object>> codedRows = new ArrayList<>();

        for (Map.Entry<Long, Map<Long, List<Answer>>> userEntry : byUserThenQuestion.entrySet()) {
            Long userId = userEntry.getKey();
            Map<Long, List<Answer>> byQuestion = userEntry.getValue();

            Map<String, Object> row = new LinkedHashMap<>();
            row.put("user_id", userId);

            for (Map.Entry<Long, List<Answer>> qEntry : byQuestion.entrySet()) {
                Long questionId = qEntry.getKey();
                List<Answer> qAnswers = qEntry.getValue();

                String columnKey = "Q_" + questionId;

                if (qAnswers.stream().anyMatch(a -> a.getOption() != null)) {
                    List<Long> optionIds = qAnswers.stream()
                            .filter(a -> a.getOption() != null)
                            .map(a -> a.getOption().getOptionId())
                            .sorted()
                            .toList();

                    String coded = optionIds.stream()
                            .map(id -> "OPT_" + id)
                            .collect(Collectors.joining(","));
                    row.put(columnKey, coded);
                } else {
                    Optional<String> text = qAnswers.stream()
                            .map(a -> a.getAnswerText() != null ? a.getAnswerText() : a.getAnswerLong())
                            .filter(Objects::nonNull)
                            .filter(s -> !s.isBlank())
                            .findFirst();

                    row.put(columnKey, text.orElse(null));
                }
            }

            codedRows.add(row);
        }

        return codedRows;
    }

    // 미구현
    public String downloadExcel(Long formId) {
        return "EXCEL FILE GENERATED FOR FORM " + formId;
    }

    public String downloadCSV(Long formId) {
        return "CSV FILE GENERATED FOR FORM " + formId;
    }
}