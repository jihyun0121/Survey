package com.survey.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.survey.backend.entities.Form;

@Repository
public interface FormRepository extends JpaRepository<Form, Long> {
    List<Form> findByUser_UserId(Long userId);
}