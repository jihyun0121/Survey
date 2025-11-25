package com.survey.backend.repositories;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import com.survey.backend.entities.Option;

@Repository
public interface OptionRepository extends JpaRepository<Option, Long> {
}