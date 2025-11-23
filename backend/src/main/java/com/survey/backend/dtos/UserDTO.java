package com.survey.backend.dtos;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.survey.backend.enums.AuthProvider;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("user_email")
    private String email;

    @JsonProperty("auth_provider")
    @Builder.Default
    private AuthProvider authProvider = AuthProvider.LOCAL;

    @JsonProperty("oauth_id")
    private String oauthId;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;
}