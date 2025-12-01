package com.survey.backend.repositories;

import java.util.*;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.survey.backend.entities.Answer;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findByQuestion_QuestionId(Long questionId);

    List<Answer> findByQuestion_Form_FormId(Long formId);

    List<Answer> findByUser_UserIdAndQuestion_Form_FormId(Long userId, Long formId);

    void deleteByUser_UserIdAndQuestion_Form_FormId(Long userId, Long formId);
}
