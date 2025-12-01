package com.survey.backend.services;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import java.nio.charset.StandardCharsets;

import org.apache.commons.io.output.ByteArrayOutputStream;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;

import com.survey.backend.entities.Answer;
import com.survey.backend.entities.Option;
import com.survey.backend.entities.Question;
import com.survey.backend.repositories.OptionRepository;
import com.survey.backend.repositories.StatisticRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StatisticService {
        private final StatisticRepository statisticRepository;
        private final OptionRepository optionRepository;

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
                                                                || (a.getAnswerLong() != null
                                                                                && !a.getAnswerLong().isBlank())))
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
                                                Collectors.mapping(a -> a.getOption().getOptionId(),
                                                                Collectors.toList())));

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
                List<Question> questions = answers.stream()
                                .map(Answer::getQuestion)
                                .distinct()
                                .sorted(Comparator.comparingLong(Question::getQuestionOrder))
                                .toList();
                Map<Long, Map<Long, List<Answer>>> byUser = answers.stream()
                                .collect(Collectors.groupingBy(
                                                a -> a.getUser().getUserId(),
                                                Collectors.groupingBy(a -> a.getQuestion().getQuestionId())));
                List<Map<String, Object>> rows = new ArrayList<>();

                for (Map.Entry<Long, Map<Long, List<Answer>>> userEntry : byUser.entrySet()) {
                        Long userId = userEntry.getKey();
                        Map<Long, List<Answer>> answersByQuestion = userEntry.getValue();
                        Map<String, Object> row = new LinkedHashMap<>();
                        row.put("user_id", userId);

                        for (Question q : questions) {
                                Long qId = q.getQuestionId();
                                Long qOrder = q.getQuestionOrder();
                                List<Answer> qAnswers = answersByQuestion.getOrDefault(qId, List.of());
                                String baseKey = "Q_" + qOrder;
                                boolean hasOption = qAnswers.stream().anyMatch(a -> a.getOption() != null);

                                if (hasOption) {
                                        List<Option> options = optionRepository
                                                        .findByQuestion_QuestionIdOrderByOptionOrderAsc(qId);

                                        for (Option opt : options) {
                                                String colKey = baseKey + "_" + opt.getOptionOrder();
                                                boolean selected = qAnswers.stream()
                                                                .anyMatch(a -> a.getOption() != null &&
                                                                                a.getOption().getOptionId().equals(
                                                                                                opt.getOptionId()));
                                                row.put(colKey, selected ? opt.getOptionOrder() : null);
                                        }
                                } else {
                                        String text = qAnswers.stream()
                                                        .map(a -> a.getAnswerText() != null ? a.getAnswerText()
                                                                        : a.getAnswerLong())
                                                        .filter(Objects::nonNull)
                                                        .findFirst()
                                                        .orElse(null);
                                        row.put(baseKey + "_TEXT", text);
                                }
                        }
                        rows.add(row);
                }
                return rows;
        }

        public byte[] downloadExcel(Long formId) {
                List<Map<String, Object>> coded = getCodedData(formId);

                HSSFWorkbook workbook = new HSSFWorkbook();
                Sheet sheet = workbook.createSheet("form_" + formId);

                if (!coded.isEmpty()) {
                        Row header = sheet.createRow(0);
                        int colIdx = 0;
                        for (String key : coded.get(0).keySet()) {
                                Cell cell = header.createCell(colIdx++);
                                cell.setCellValue(key);
                        }

                        int rowIdx = 1;
                        for (Map<String, Object> rowData : coded) {
                                Row row = sheet.createRow(rowIdx++);
                                int c = 0;
                                for (Object value : rowData.values()) {
                                        Cell cell = row.createCell(c++);
                                        cell.setCellValue(value != null ? value.toString() : "");
                                }
                        }
                }

                try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
                        workbook.write(out);
                        workbook.close();
                        return out.toByteArray();
                } catch (Exception e) {
                        throw new RuntimeException("엑셀 생성 중 오류가 발생했습니다.", e);
                }
        }

        public byte[] downloadCSV(Long formId) {
                List<Map<String, Object>> coded = getCodedData(formId);

                if (coded.isEmpty()) {
                        return "".getBytes(StandardCharsets.UTF_8);
                }

                StringBuilder sb = new StringBuilder();

                Map<String, Object> firstRow = coded.get(0);
                String headerLine = String.join(",", firstRow.keySet());
                sb.append(headerLine).append("\n");

                for (Map<String, Object> row : coded) {
                        List<String> values = row.values().stream()
                                        .map(v -> v == null ? "" : escapeCsv(v.toString()))
                                        .toList();
                        sb.append(String.join(",", values)).append("\n");
                }

                return sb.toString().getBytes(StandardCharsets.UTF_8);
        }

        private String escapeCsv(String value) {
                if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
                        return "\"" + value.replace("\"", "\"\"") + "\"";
                }
                return value;
        }

}