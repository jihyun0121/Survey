import React, { useState, useEffect } from "react";
import { QuestionAPI } from "../../api/api";
import QuestionOptionEditor from "./QuestionOptionEditor";
import Setting from "./Setting";

export default function QuestionItem({ question, onLocalChange, onDelete }) {
    const [local, setLocal] = useState(question);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        setLocal(question);
        loadOptions();
    }, [question]);

    async function loadOptions() {
        if (question.question_type === "RADIO" || question.question_type === "CHECKBOX") {
            const res = await QuestionAPI.getOptionsByQuestion(question.question_id);
            setOptions(res.data);
        }
    }

    function handleQuestionChange(value) {
        const updated = { ...local, question_content: value };
        setLocal(updated);
        onLocalChange(local.question_id, { question_content: value });
    }

    async function handleQuestionBlur() {
        try {
            await QuestionAPI.updateQuestion(local.question_id, {
                question_content: local.question_content,
            });
        } catch (e) {
            alert("질문 저장 실패");
        }
    }

    function updateField(field, value) {
        const updated = { ...local, [field]: value };
        setLocal(updated);
        onLocalChange(updated.question_id, { [field]: value });
    }

    function updateOptionList(newList) {
        setOptions(newList);
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
                            <input type="text" className="form-input-base bg-gr" value={local.question_content || ""} placeholder="질문 입력" onChange={(e) => handleQuestionChange(e.target.value)} onBlur={handleQuestionBlur} />
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

            {(local.question_type === "RADIO" || local.question_type === "CHECKBOX") && <QuestionOptionEditor options={options} questionId={local.question_id} type={local.question_type} onOptionsChange={updateOptionList} />}

            <Setting isRequired={local.is_required} onToggleRequired={(value) => updateField("is_required", value)} onDelete={() => onDelete(local.question_id)} />
        </div>
    );
}
