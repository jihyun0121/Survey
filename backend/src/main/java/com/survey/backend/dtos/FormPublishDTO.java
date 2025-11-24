package com.survey.backend.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FormPublishDTO {
    @JsonProperty("is_public")
    @Builder.Default
    private Boolean isPublic = false;
}