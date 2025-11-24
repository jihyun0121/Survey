package com.survey.backend.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionDTO {
    @JsonProperty("question_id")
    private Long questionId;

    @JsonProperty("form_id")
    private Long formId;

    @JsonProperty("question_name")
    private String questionName;

    @JsonProperty("question_content")
    private String questionContent;

    @JsonProperty("question_type")
    private String questionType;

    @JsonProperty("is_required")
    @Builder.Default
    private Boolean isRequired = false;

    @JsonProperty("question_order")
    private Long questionOrder;
}