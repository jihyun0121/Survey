package com.survey.backend.services;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.survey.backend.dtos.FormDTO;
import com.survey.backend.dtos.FormPublishDTO;
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

    @Transactional(readOnly = true)
    public FormDTO getForm(Long formId) {
        Form form = formRepository.findById(formId)
                .orElseThrow(() -> new IllegalArgumentException("설문을 찾을 수 없습니다"));
        return formDto(form);
    }

    @Transactional(readOnly = true)
    public List<FormDTO> getFormsByUser(Long userId) {
        return formRepository.findByUser_UserId(userId).stream()
                .map(this::formDto)
                .collect(Collectors.toList());
    }

    public FormDTO updateForm(Long formId, FormDTO dto) {
        Form form = formRepository.findById(formId)
                .orElseThrow(() -> new IllegalArgumentException("설문을 찾을 수 없습니다"));

        form.setTitle(dto.getTitle());
        form.setDescription(dto.getDescription());

        return formDto(form);
    }

    public FormPublishDTO publishForm(Long formId, Boolean isPublic) {
        Form form = formRepository.findById(formId)
                .orElseThrow(() -> new IllegalArgumentException("설문을 찾을 수 없습니다"));

        form.setIsPublic(isPublic);

        return FormPublishDTO.builder()
                .isPublic(isPublic)
                .build();
    }

    public void deleteForm(Long formId) {
        if (!formRepository.existsById(formId)) {
            throw new IllegalArgumentException("설문을 찾을 수 없습니다");
        }
        formRepository.deleteById(formId);
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