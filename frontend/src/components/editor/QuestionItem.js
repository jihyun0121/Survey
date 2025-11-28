// src/components/editor/QuestionItem.js
import React, { useState, useEffect, useRef } from "react";
import { QuestionAPI } from "../../api/api";
import QuestionOptionEditor from "./QuestionOptionEditor";
import Setting from "./Setting";

export default function QuestionItem({ question, onLocalChange, onDelete, autoFocus }) {
    const [local, setLocal] = useState(question);
    const [options, setOptions] = useState([]);

    const inputRef = useRef(null);

    useEffect(() => {
        setLocal(question);
        loadOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [question.question_id]);

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    async function loadOptions() {
        if (question.question_type === "RADIO" || question.question_type === "CHECKBOX") {
            try {
                const res = await QuestionAPI.getOptionsByQuestion(question.question_id);
                setOptions(res.data);
            } catch (e) {
                console.error("옵션 로드 실패", e);
            }
        } else {
            setOptions([]);
        }
    }

    function handleQuestionChange(value) {
        const updated = { ...local, question_content: value };
        setLocal(updated);
        onLocalChange(updated.question_id, { question_content: value });
    }

    async function handleQuestionBlur() {
        try {
            await QuestionAPI.updateQuestion(local.question_id, {
                question_content: local.question_content,
            });
        } catch (e) {
            console.error(e);
            alert("질문 저장 실패");
        }
    }

    async function updateField(field, value) {
        const updated = { ...local, [field]: value };
        setLocal(updated);
        onLocalChange(updated.question_id, { [field]: value });

        try {
            await QuestionAPI.updateQuestion(updated.question_id, {
                [field]: value,
            });
        } catch (e) {
            console.error(e);
            alert("질문 업데이트 실패");
        }
    }

    async function handleTypeChange(e) {
        const newType = e.target.value;
        const prevType = local.question_type;

        const updated = { ...local, question_type: newType };
        setLocal(updated);
        onLocalChange(updated.question_id, { question_type: newType });

        try {
            await QuestionAPI.updateQuestion(updated.question_id, {
                question_type: newType,
            });
        } catch (err) {
            console.error(err);
            alert("질문 타입 변경 실패");
        }

        if ((newType === "RADIO" || newType === "CHECKBOX") && !(prevType === "RADIO" || prevType === "CHECKBOX")) {
            try {
                const baseLabels = ["옵션 1", "옵션 2"];
                const created = [];

                for (let i = 0; i < baseLabels.length; i++) {
                    const res = await QuestionAPI.createOption({
                        question_id: updated.question_id,
                        option_content: baseLabels[i],
                        option_order: i + 1,
                    });
                    created.push(res.data);
                }

                setOptions(created);
            } catch (err) {
                console.error(err);
                alert("옵션 생성 실패");
            }
        } else if (!(newType === "RADIO" || newType === "CHECKBOX") && (prevType === "RADIO" || prevType === "CHECKBOX")) {
            try {
                await Promise.all(options.map((opt) => QuestionAPI.deleteOption(opt.option_id)));
            } catch (err) {
                console.error(err);
                alert("옵션 삭제 실패");
            } finally {
                setOptions([]);
            }
        }
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
                            <input ref={inputRef} type="text" className="form-input-base bg-gr" value={local.question_content || ""} placeholder="질문 입력" onChange={(e) => handleQuestionChange(e.target.value)} onBlur={handleQuestionBlur} />
                        </div>
                    </div>
                </div>

                <div className="question-right">
                    <select className="form-select form-select-sm question-type-select" value={local.question_type} onChange={handleTypeChange}>
                        <option value="SHORT">단답형</option>
                        <option value="LONG">장문형</option>
                        <option value="RADIO">객관식</option>
                        <option value="CHECKBOX">체크박스</option>
                    </select>
                </div>
            </div>

            {(local.question_type === "RADIO" || local.question_type === "CHECKBOX") && <QuestionOptionEditor options={options} questionId={local.question_id} type={local.question_type} onOptionsChange={updateOptionList} />}

            <Setting questionId={local.question_id} isRequired={local.is_required} onToggleRequired={(value) => updateField("is_required", value)} onDelete={() => onDelete(local.question_id)} />
        </div>
    );
}
