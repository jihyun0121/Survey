import React from "react";
import { QuestionAPI } from "../../api/api";

export default function Setting({ questionId, isRequired, onToggleRequired, onDelete }) {
    const handleRequiredChange = async (e) => {
        const newValue = e.target.checked;
        onToggleRequired(newValue);

        try {
            await QuestionAPI.setRequired(questionId, newValue);
        } catch (err) {
            console.error("필수 여부 업데이트 실패", err);
        }
    };

    return (
        <div className="question-footer d-flex justify-content-between align-items-center pt-2">
            <div className="form-check form-switch">
                <input type="checkbox" className="form-check-input" checked={isRequired} onChange={handleRequiredChange} />
                <label className="form-check-label small">필수</label>
            </div>

            <button type="button" className="btn btn-outline-danger btn-sm btn-delete" onClick={onDelete}>
                <i className="bi bi-trash"></i>
            </button>
        </div>
    );
}
