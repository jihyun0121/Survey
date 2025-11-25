package com.survey.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.survey.backend.entities.Answer;

@Repository
public interface StatisticRepository extends JpaRepository<Answer, Long> {
    List<Answer> findByUser_UserId(Long userId);

    List<Answer> findByQuestion_QuestionId(Long questionId);
}