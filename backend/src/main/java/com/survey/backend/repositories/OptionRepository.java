package com.survey.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.survey.backend.entities.Option;

@Repository
public interface OptionRepository extends JpaRepository<Option, Long> {
        List<Option> findByQuestion_QuestionIdOrderByOptionOrderAsc(Long questionId);

        @Modifying
        @Query("UPDATE Option q SET q.optionOrder = q.optionOrder - 1 WHERE q.question.questionId = :questionId AND q.optionOrder > :oldOrder AND q.optionOrder <= :newOrder")
        void shiftOrderDown(@Param("questionId") Long questionId, @Param("oldOrder") Long oldOrder,
                        @Param("newOrder") Long newOrder);

        @Modifying
        @Query("UPDATE Option q SET q.optionOrder = q.optionOrder + 1 WHERE q.question.questionId = :questionId AND q.optionOrder >= :newOrder AND q.optionOrder < :oldOrder")
        void shiftOrderUp(@Param("questionId") Long questionId, @Param("newOrder") Long newOrder,
                        @Param("oldOrder") Long oldOrder);

        @Modifying
        @Query("UPDATE Option q SET q.optionOrder = q.optionOrder - 1 WHERE q.question.questionId = :questionId AND q.optionOrder > :deletedOrder")
        void shiftOrderAfterDelete(@Param("questionId") Long questionId, @Param("deletedOrder") Long deletedOrder);
}