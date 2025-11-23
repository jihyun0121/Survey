package com.survey.backend.services;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.survey.backend.configs.jwt.JWToken;
import com.survey.backend.dtos.UserAuthDTO;
import com.survey.backend.entities.User;
import com.survey.backend.enums.AuthProvider;
import com.survey.backend.repositories.UserRepository;

import lombok.*;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWToken jwToken;

    @Transactional
    public void signUp(UserAuthDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("이미 가입된 이메일입니다.");
        }

        User user = User.builder()
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .authProvider(AuthProvider.LOCAL)
                .build();

        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public String login(UserAuthDTO dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 이메일입니다."));

        if (user.getPassword() == null) {
            throw new IllegalArgumentException("비밀번호 로그인 불가능한 계정입니다.");
        }

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }
        return jwToken.createToken(
                user.getUserId(),
                user.getEmail(),
                user.getAuthProvider()
        );
    }
}