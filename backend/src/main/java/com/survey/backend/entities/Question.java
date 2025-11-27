package com.survey.backend.entities;

import com.fasterxml.jackson.annotation.*;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "\"Question\"")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_id")
    @JsonProperty("question_id")
    private Long questionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "form_id", nullable = false)
    @JsonProperty("form_id")
    @JsonIgnore
    private Form form;

    @Column(name = "question_content", nullable = false)
    @JsonProperty("question_content")
    private String questionContent;

    @Column(name = "question_type")
    @JsonProperty("question_type")
    private String questionType;

    @Column(name = "is_required")
    @JsonProperty("is_required")
    @Builder.Default
    private Boolean isRequired = false;

    @Column(name = "question_order")
    @JsonProperty("question_order")
    private Long questionOrder;
}