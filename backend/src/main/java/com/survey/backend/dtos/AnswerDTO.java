package com.survey.backend.dtos;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnswerDTO {
    @JsonProperty("answer_id")
    private Long answerId;

    @JsonProperty("question_id")
    private Long questionId;

    @JsonProperty("option_id")
    private Long optionId;

    @JsonProperty("answer_text")
    private String answerText;

    @JsonProperty("answer_long")
    private String answerLong;

    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;
}