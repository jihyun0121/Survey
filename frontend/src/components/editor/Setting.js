import React from "react";

export default function Setting({ isRequired, onToggleRequired, onDelete }) {
    return (
        <div className="question-footer d-flex justify-content-between align-items-center pt-2">
            <div className="form-check form-switch">
                <input type="checkbox" className="form-check-input" checked={isRequired} onChange={(e) => onToggleRequired(e.target.checked)} />
                <label className="form-check-label small">필수</label>
            </div>

            <button type="button" className="btn btn-outline-danger btn-sm btn-delete" onClick={onDelete}>
                <i className="bi bi-trash"></i>
            </button>
        </div>
    );
}
