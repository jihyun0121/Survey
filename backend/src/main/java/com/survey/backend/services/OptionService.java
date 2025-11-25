package com.survey.backend.services;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.survey.backend.dtos.OptionDTO;
import com.survey.backend.entities.Question;
import com.survey.backend.entities.Option;
import com.survey.backend.repositories.QuestionRepository;
import com.survey.backend.repositories.OptionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OptionService {
    private final OptionRepository optionRepository;
    private final QuestionRepository questionRepository;

    private OptionDTO qustionDto(Option q) {
        return OptionDTO.builder()
                .optionId(q.getOptionId())
                .questionId(q.getQuestion().getQuestionId())
                .optionContent(q.getOptionContent())
                .optionOrder(q.getOptionOrder())
                .build();
    }

    public OptionDTO createOption(OptionDTO dto) {
        Question question = questionRepository.findById(dto.getQuestionId())
                .orElseThrow(() -> new IllegalArgumentException("설문을 찾을 수 없습니다"));

        Option option = Option.builder()
                .optionContent(dto.getOptionContent())
                .question(question)
                .optionOrder(dto.getOptionOrder())
                .build();

        Option saved = optionRepository.save(option);
        return qustionDto(saved);
    }

    @Transactional(readOnly = true)
    public OptionDTO getOption(Long optionId) {
        Option option = optionRepository.findById(optionId)
                .orElseThrow(() -> new IllegalArgumentException("질문을 찾을 수 없습니다"));
        return qustionDto(option);
    }

    @Transactional(readOnly = true)
    public List<OptionDTO> getOptionsByQuestion(Long questionId) {
        return optionRepository.findByQuestion_QuestionId(questionId).stream()
                .map(this::qustionDto)
                .collect(Collectors.toList());
    }
}