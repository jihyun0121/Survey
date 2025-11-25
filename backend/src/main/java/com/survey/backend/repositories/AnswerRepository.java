package com.survey.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.survey.backend.entities.Answer;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    Answer findByQuestion_QuestionId(Long questionId);
}