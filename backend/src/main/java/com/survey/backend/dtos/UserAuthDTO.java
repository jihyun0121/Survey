package com.survey.backend.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAuthDTO {
    @JsonProperty("user_email")
    private String email;

    @JsonProperty("user_password")
    private String password;
}