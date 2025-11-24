package com.survey.backend.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.survey.backend.dtos.FormDTO;
import com.survey.backend.entities.Form;
import com.survey.backend.entities.User;
import com.survey.backend.repositories.FormRepository;
import com.survey.backend.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class FormService {
    private final FormRepository formRepository;
    private final UserRepository userRepository;

    public FormDTO createForm(FormDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다"));

        Form form = Form.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .isPublic(dto.getIsPublic())
                .user(user)
                .build();

        Form saved = formRepository.save(form);
        return formDto(saved);
    }

    private FormDTO formDto(Form f) {
        return FormDTO.builder()
                .formId(f.getFormId())
                .title(f.getTitle())
                .description(f.getDescription())
                .isPublic(f.getIsPublic())
                .userId(f.getUser().getUserId())
                .createdAt(f.getCreatedAt())
                .updatedAt(f.getUpdatedAt())
                .build();
    }
}