package com.survey.backend.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RequiredQuestionDTO {
    @JsonProperty("is_required")
    @Builder.Default
    private Boolean isRequired = false;
}