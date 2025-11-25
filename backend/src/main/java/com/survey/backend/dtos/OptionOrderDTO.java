package com.survey.backend.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OptionOrderDTO {
    @JsonProperty("option_id")
    private Long optionId;

    @JsonProperty("option_order")
    private Long optionOrder;
}