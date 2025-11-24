package com.survey.backend.entities;

import java.time.LocalDateTime;

import org.hibernate.annotations.*;

import com.fasterxml.jackson.annotation.*;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "\"Forms\"")
public class Form {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "form_id")
    @JsonProperty("form_id")
    private Long formId;

    @Column(name = "form_title", nullable = false, length = 50)
    @JsonProperty("form_title")
    private String title;

    @Column(name = "form_description")
    @JsonProperty("form_description")
    private String description;

    @Column(name = "is_public", nullable = false)
    @JsonProperty("is_public")
    @Builder.Default
    private Boolean isPublic = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonProperty("user_id")
    @JsonIgnore
    private User user;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    @JsonProperty("updated_at")
    private LocalDateTime updatedAt;
}