package com.survey.backend.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GoogleTokenDTO {
    @JsonProperty("access_token")
    private String accessToken;
}