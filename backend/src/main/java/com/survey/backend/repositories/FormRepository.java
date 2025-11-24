package com.survey.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.survey.backend.entities.Form;

@Repository
public interface FormRepository extends JpaRepository<Form, Long> {
}