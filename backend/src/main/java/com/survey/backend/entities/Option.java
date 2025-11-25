package com.survey.backend.entities;

import com.fasterxml.jackson.annotation.*;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "\"Option\"")
public class Option {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "option_id")
    @JsonProperty("option_id")
    private Long optionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    @JsonProperty("question_id")
    @JsonIgnore
    private Question question;

    @Column(name = "option_content", nullable = false, length = 100)
    @JsonProperty("option_content")
    private String optionContent;

    @Column(name = "option_order")
    @JsonProperty("option_order")
    private Long optionOrder;
}