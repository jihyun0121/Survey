package com.survey.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.survey.backend.entities.Question;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

}
