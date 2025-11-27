package com.survey.backend.services;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.survey.backend.dtos.QuestionDTO;
import com.survey.backend.dtos.QuestionOrderDTO;
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
                .questionContent(dto.getQuestionContent())
                .questionType(dto.getQuestionType())
                .form(form)
                .questionOrder(dto.getQuestionOrder())
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
        return questionRepository.findByForm_FormIdOrderByQuestionOrderAsc(formId).stream()
                .map(this::qustionDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public QuestionDTO updateQuestion(Long questionId, QuestionDTO dto) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("질문을 찾을 수 없습니다"));

        if (dto.getQuestionContent() != null)
            question.setQuestionContent(dto.getQuestionContent());
        if (dto.getQuestionType() != null)
            question.setQuestionType(dto.getQuestionType());

        return qustionDto(question);
    }

    @Transactional
    public RequiredQuestionDTO setRequired(Long questionId, Boolean isRequired) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("설문을 찾을 수 없습니다"));

        question.setIsRequired(isRequired);

        return RequiredQuestionDTO.builder()
                .isRequired(isRequired)
                .build();
    }

    @Transactional
    public QuestionOrderDTO reorderQuestions(QuestionOrderDTO dto) {
        Question question = questionRepository.findById(dto.getQuestionId())
                .orElseThrow(() -> new IllegalArgumentException("해당 질문을 찾을 수 없습니다."));

        Long formId = question.getForm().getFormId();

        if (dto.getQuestionOrder() != null && !dto.getQuestionOrder().equals(question.getQuestionOrder())) {
            Long oldOrder = question.getQuestionOrder();
            Long newOrder = dto.getQuestionOrder();

            if (newOrder > oldOrder) {
                questionRepository.shiftOrderDown(formId, oldOrder, newOrder);
            } else {
                questionRepository.shiftOrderUp(formId, newOrder, oldOrder);
            }
            question.setQuestionOrder(newOrder);
        }

        return QuestionOrderDTO.builder()
                .questionId(question.getQuestionId())
                .questionOrder(question.getQuestionOrder())
                .build();
    }

    @Transactional
    public void deleteQuestion(Long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("해당 질문을 찾을 수 없습니다."));

        Long formId = question.getForm().getFormId();
        Long deletedOrder = question.getQuestionOrder();
        questionRepository.delete(question);
        questionRepository.shiftOrderAfterDelete(formId, deletedOrder);
    }
}