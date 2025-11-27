import React, { useState, useEffect } from "react";
import QuestionOptionEditor from "./QuestionOptionEditor";
import Setting from "./Setting";

export default function QuestionItem({ question, onLocalChange, onDelete }) {
    const [local, setLocal] = useState(question);

    useEffect(() => {
        setLocal(question);
    }, [question]);

    function updateField(field, value) {
        const updated = { ...local, [field]: value };
        setLocal(updated);
        onLocalChange(updated.question_id, { [field]: value });
    }

    return (
        <div className="card block-question-card">
            <span className="drag-handle">
                <i className="bi bi-three-dots"></i>
            </span>

            <div className="question-header d-flex align-items-start">
                <div className="question-left flex-grow-1">
                    <div className="editor-wrapper mb-1">
                        <div className="input-wrapper">
                            <input type="text" className="form-input-base" value={local.question_content || ""} placeholder="질문 입력" onChange={(e) => updateField("question_content", e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="question-right">
                    <select className="form-select form-select-sm question-type-select" value={local.question_type} onChange={(e) => updateField("question_type", e.target.value)}>
                        <option value="SHORT">단답형</option>
                        <option value="LONG">장문형</option>
                        <option value="RADIO">객관식</option>
                        <option value="CHECKBOX">체크박스</option>
                    </select>
                </div>
            </div>

            {(local.question_type === "RADIO" || local.question_type === "CHECKBOX") && (
                <div className="question-body mt-3">
                    <QuestionOptionEditor question={local} onChange={(opts) => updateField("options", opts)} />
                </div>
            )}

            <Setting isRequired={local.is_required} onToggleRequired={(value) => updateField("is_required", value)} onDelete={() => onDelete(local.question_id)} />
        </div>
    );
}
