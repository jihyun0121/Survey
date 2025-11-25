package com.survey.backend.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionOrderDTO {
    @JsonProperty("question_id")
    private Long questionId;

    @JsonProperty("question_order")
    private Long questionOrder;
}