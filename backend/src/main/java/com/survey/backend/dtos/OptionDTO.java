package com.survey.backend.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OptionDTO {
    @JsonProperty("option_id")
    private Long optionId;

    @JsonProperty("question_id")
    private Long questionId;

    @JsonProperty("option_content")
    private String optionContent;

    @JsonProperty("option_order")
    private Long optionOrder;
}