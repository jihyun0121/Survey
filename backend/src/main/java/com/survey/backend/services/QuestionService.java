package com.survey.backend.services;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.survey.backend.dtos.QuestionDTO;
import com.survey.backend.dtos.RequiredQuestionDTO;
import com.survey.backend.entities.Form;
import com.survey.backend.entities.Question;
import com.survey.backend.repositories.FormRepository;
import com.survey.backend.repositories.QuestionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QuestionService {
    private final QuestionRepository questionRepository;
    private final FormRepository formRepository;

    private QuestionDTO qustionDto(Question q) {
        return QuestionDTO.builder()
                .questionId(q.getQuestionId())
                .formId(q.getForm().getFormId())
                .questionName(q.getQuestionName())
                .questionContent(q.getQuestionContent())
                .questionType(q.getQuestionType())
                .isRequired(q.getIsRequired())
                .questionOrder(q.getQuestionOrder())
                .build();
    }

    public QuestionDTO createQuestion(QuestionDTO dto) {
        Form form = formRepository.findById(dto.getFormId())
                .orElseThrow(() -> new IllegalArgumentException("설문을 찾을 수 없습니다"));

        Question question = Question.builder()
                .questionName(dto.getQuestionName())
                .questionContent(dto.getQuestionContent())
                .questionType(dto.getQuestionType())
                .form(form)
                .build();

        Question saved = questionRepository.save(question);
        return qustionDto(saved);
    }

    @Transactional(readOnly = true)
    public QuestionDTO getQuestion(Long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("질문을 찾을 수 없습니다"));
        return qustionDto(question);
    }

    @Transactional(readOnly = true)
    public List<QuestionDTO> getQuestionsByForm(Long formId) {
        return questionRepository.findByForm_FormId(formId).stream()
                .map(this::qustionDto)
                .collect(Collectors.toList());
    }

    public RequiredQuestionDTO setRequired(Long questionId, Boolean isRequired) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("설문을 찾을 수 없습니다"));

        question.setIsRequired(isRequired);

        return RequiredQuestionDTO.builder()
                .isRequired(isRequired)
                .build();
    }
}