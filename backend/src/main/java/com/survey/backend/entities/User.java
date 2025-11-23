package com.survey.backend.entities;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import lombok.*;

import com.survey.backend.enums.AuthProvider;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "\"Users\"")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    @JsonProperty("user_id")
    private Long userId;

    @Column(name = "user_email", nullable = false, unique = true, length = 100)
    @JsonProperty("user_email")
    private String email;

    @Column(name = "user_password", length = 255)
    @JsonProperty("user_password")
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "auth_provider", nullable = false, length = 20)
    @JsonProperty("auth_provider")
    @Builder.Default
    private AuthProvider authProvider = AuthProvider.LOCAL;

    @Column(name = "oauth_id", unique = true, length = 100)
    @JsonProperty("oauth_id")
    private String oauthId;

    @CreationTimestamp
    @JsonProperty("created_at")
    private LocalDateTime createdAt;
}