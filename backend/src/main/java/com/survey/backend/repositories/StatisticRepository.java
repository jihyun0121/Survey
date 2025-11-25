package com.survey.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.survey.backend.entities.Answer;

@Repository
public interface StatisticRepository extends JpaRepository<Answer, Long> {
    List<Answer> findByUser_UserId(Long userId);

    List<Answer> findByQuestion_QuestionId(Long questionId);

    List<Answer> findByQuestion_QuestionIdAndOption_OptionId(Long questionId, Long optionId);

    List<Answer> findByQuestion_QuestionIdAndOptionIsNull(Long questionId);

    List<Answer> findByQuestion_Form_FormId(Long formId);

    List<Answer> findByUser_UserIdAndQuestion_Form_FormId(Long userId, Long formId);

    @Query("select count(distinct a.user.userId) from Answer a where a.question.form.formId = :formId")
    long countDistinctUserByFormId(@Param("formId") Long formId);

    @Query("select count(distinct a.user.userId) from Answer a where a.question.questionId = :questionId and (a.option is not null      or (a.answerText is not null and a.answerText <> '')      or (a.answerLong is not null and a.answerLong <> ''))")
    long countDistinctUserAnsweredQuestion(@Param("questionId") Long questionId);
}