package com.survey.backend.services;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.survey.backend.dtos.OptionDTO;
import com.survey.backend.dtos.OptionOrderDTO;
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

    private OptionDTO optionDto(Option q) {
        return OptionDTO.builder()
                .optionId(q.getOptionId())
                .questionId(q.getQuestion().getQuestionId())
                .optionContent(q.getOptionContent())
                .optionOrder(q.getOptionOrder())
                .build();
    }

    public OptionDTO createOption(OptionDTO dto) {
        Question question = questionRepository.findById(dto.getQuestionId())
                .orElseThrow(() -> new IllegalArgumentException("질문을 찾을 수 없습니다"));

        Option option = Option.builder()
                .optionContent(dto.getOptionContent())
                .question(question)
                .optionOrder(dto.getOptionOrder())
                .build();

        Option saved = optionRepository.save(option);
        return optionDto(saved);
    }

    @Transactional(readOnly = true)
    public OptionDTO getOption(Long optionId) {
        Option option = optionRepository.findById(optionId)
                .orElseThrow(() -> new IllegalArgumentException("질문을 찾을 수 없습니다"));
        return optionDto(option);
    }

    @Transactional(readOnly = true)
    public List<OptionDTO> getOptionsByQuestion(Long questionId) {
        return optionRepository.findByQuestion_QuestionIdOrderByOptionOrderAsc(questionId).stream()
                .map(this::optionDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public OptionDTO updateOption(Long optionId, OptionDTO dto) {
        Option option = optionRepository.findById(optionId)
                .orElseThrow(() -> new IllegalArgumentException("질문을 찾을 수 없습니다"));

        if (dto.getOptionContent() != null)
            option.setOptionContent(dto.getOptionContent());

        return optionDto(option);
    }

    @Transactional
    public OptionOrderDTO reorderOptions(OptionOrderDTO dto) {
        Option option = optionRepository.findById(dto.getOptionId())
                .orElseThrow(() -> new IllegalArgumentException("해당 질문을 찾을 수 없습니다."));

        Long questionId = option.getQuestion().getQuestionId();

        if (dto.getOptionOrder() != null && !dto.getOptionOrder().equals(option.getOptionOrder())) {
            Long oldOrder = option.getOptionOrder();
            Long newOrder = dto.getOptionOrder();

            if (newOrder > oldOrder) {
                optionRepository.shiftOrderDown(questionId, oldOrder, newOrder);
            } else {
                optionRepository.shiftOrderUp(questionId, newOrder, oldOrder);
            }
            option.setOptionOrder(newOrder);
        }

        return OptionOrderDTO.builder()
                .optionId(option.getOptionId())
                .optionOrder(option.getOptionOrder())
                .build();
    }

    @Transactional
    public void deleteOption(Long optionId) {
        Option option = optionRepository.findById(optionId)
                .orElseThrow(() -> new IllegalArgumentException("해당 질문을 찾을 수 없습니다."));

        Long questionId = option.getQuestion().getQuestionId();
        Long deletedOrder = option.getOptionOrder();
        optionRepository.delete(option);
        optionRepository.shiftOrderAfterDelete(questionId, deletedOrder);
    }
}