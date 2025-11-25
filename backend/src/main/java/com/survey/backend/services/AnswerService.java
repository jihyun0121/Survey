package com.survey.backend.services;

import java.util.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

        @Transactional(readOnly = true)
        public AnswerDTO getAnswer(Long answerId) {
                Answer answer = answerRepository.findById(answerId)
                                .orElseThrow(() -> new IllegalArgumentException("응답을 찾을 수 없습니다"));
                return answerDto(answer);
        }

        @Transactional(readOnly = true)
        public List<AnswerDTO> getAnswersByQuestion(Long questionId) {
                List<Answer> answers = answerRepository.findByQuestion_QuestionId(questionId);
                return answers.stream()
                                .map(this::answerDto)
                                .toList();
        }

        @Transactional(readOnly = true)
        public List<AnswerDTO> getAnswersByForm(Long formId) {
                List<Answer> answers = answerRepository.findByQuestion_Form_FormId(formId);
                return answers.stream()
                                .map(this::answerDto)
                                .toList();
        }

        @Transactional(readOnly = true)
        public List<AnswerDTO> getUserAnswerForForm(Long userId, Long formId) {
                List<Answer> answers = answerRepository.findByUser_UserIdAndQuestion_Form_FormId(userId, formId);
                return answers.stream()
                                .map(this::answerDto)
                                .toList();
        }
}