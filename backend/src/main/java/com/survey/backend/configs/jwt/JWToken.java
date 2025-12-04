package com.survey.backend.configs.jwt;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.survey.backend.enums.AuthProvider;

import io.jsonwebtoken.Jwts;

@Component
public class JWToken {
    private final SecretKey secretKey;
    private final long expirationMs;

    public JWToken(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration:3600000}") long expirationMs) {
        this.secretKey = new SecretKeySpec(
                secret.getBytes(StandardCharsets.UTF_8),
                Jwts.SIG.HS256.key().build().getAlgorithm());
        this.expirationMs = expirationMs;
    }

    public String createToken(Long userId, String email, AuthProvider provider) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .claim("user_id", userId)
                .claim("user_email", email)
                .claim("auth_provider", provider.name())
                .issuedAt(now)
                .expiration(expiry)
                .signWith(secretKey)
                .compact();
    }

    public String getEmail(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("user_email", String.class);
    }

    public Long getUserId(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("user_id", Long.class);
    }

    public AuthProvider getAuthProvider(String token) {
        String p = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("auth_provider", String.class);

        return AuthProvider.valueOf(p);
    }

    public boolean isExpired(String token) {
        Date exp = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration();

        return exp.before(new Date());
    }
}