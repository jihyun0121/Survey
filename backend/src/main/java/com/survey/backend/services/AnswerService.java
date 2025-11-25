package com.survey.backend.services;

import org.springframework.stereotype.Service;

import com.survey.backend.dtos.AnswerDTO;
import com.survey.backend.entities.Answer;
import com.survey.backend.entities.Option;
import com.survey.backend.entities.Question;
import com.survey.backend.entities.User;
import com.survey.backend.repositories.AnswerRepository;
import com.survey.backend.repositories.OptionRepository;
import com.survey.backend.repositories.QuestionRepository;
import com.survey.backend.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AnswerService {
    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;
    private final OptionRepository optionRepository;
    private final UserRepository userRepository;

    private AnswerDTO answerDto(Answer a) {
        return AnswerDTO.builder()
                .answerId(a.getAnswerId())
                .questionId(a.getQuestion().getQuestionId())
                .optionId(a.getOption() != null ? a.getOption().getOptionId() : null)
                .answerText(a.getAnswerText())
                .answerLong(a.getAnswerLong())
                .userId(a.getUser().getUserId())
                .createdAt(a.getCreatedAt())
                .build();
    }

    public AnswerDTO saveAnswers(AnswerDTO dto) {
        Question question = questionRepository.findById(dto.getQuestionId())
                .orElseThrow(() -> new IllegalArgumentException("질문을 찾을 수 없습니다"));

        Option option;
        if (dto.getOptionId() != null)
            option = optionRepository.findById(dto.getOptionId())
                    .orElseThrow(() -> new IllegalArgumentException("질문을 찾을 수 없습니다"));
        else
            option = null;

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("질문을 찾을 수 없습니다"));

        Answer answer = Answer.builder()
                .question(question)
                .option(option)
                .answerText(dto.getAnswerText())
                .answerLong(dto.getAnswerLong())
                .user(user)
                .build();

        Answer save = answerRepository.save(answer);
        return answerDto(save);
    }
}