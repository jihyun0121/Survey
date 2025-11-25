package com.survey.backend.services;

import org.springframework.stereotype.Service;

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
}