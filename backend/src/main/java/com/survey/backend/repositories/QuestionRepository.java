package com.survey.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.survey.backend.entities.Question;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByForm_FormId(Long formId);

    @Modifying
    @Query("UPDATE Question q SET q.questionOrder = q.questionOrder - 1 WHERE q.form.formId = :formId AND q.questionOrder > :oldOrder AND q.questionOrder <= :newOrder")
    void shiftOrderDown(@Param("formId") Long formId, @Param("oldOrder") Long oldOrder,
            @Param("newOrder") Long newOrder);

    @Modifying
    @Query("UPDATE Question q SET q.questionOrder = q.questionOrder + 1 WHERE q.form.formId = :formId AND q.questionOrder >= :newOrder AND q.questionOrder < :oldOrder")
    void shiftOrderUp(@Param("formId") Long formId, @Param("newOrder") Long newOrder, @Param("oldOrder") Long oldOrder);

    @Modifying
    @Query("UPDATE Question q SET q.questionOrder = q.questionOrder - 1 WHERE q.form.formId = :formId AND q.questionOrder > :deletedOrder")
    void shiftOrderAfterDelete(@Param("formId") Long formId, @Param("deletedOrder") Long deletedOrder);
}