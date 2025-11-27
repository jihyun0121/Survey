import React, { useEffect, useRef } from "react";
import Sortable from "sortablejs";
import { QuestionAPI } from "../../api/api";

export default function QuestionOptionEditor({ options = [], questionId, type, onOptionsChange }) {
    const listRef = useRef(null);

    const getIcon = () => {
        if (type === "RADIO") return <input type="radio" disabled className="fake-option-input" />;
        if (type === "CHECKBOX") return <input type="checkbox" disabled className="fake-option-input" />;
        return null;
    };

    useEffect(() => {
        if (!listRef.current) return;

        const sortable = Sortable.create(listRef.current, {
            animation: 150,
            handle: ".opt-drag",
            draggable: ".option-row",

            onEnd: async (evt) => {
                const items = [...listRef.current.children];

                const newOrder = items
                    .map((el) => Number(el.dataset.id))
                    .map((id) => options.find((opt) => opt.option_id === id))
                    .filter(Boolean);

                onOptionsChange(newOrder);

                newOrder.forEach((opt, index) => {
                    QuestionAPI.reorderOptions({
                        option_id: opt.option_id,
                        option_order: index + 1,
                    }).catch((err) => console.warn("reorder 실패", err));
                });
            },
        });

        return () => sortable.destroy();
    }, [options, onOptionsChange]);

    const addOption = async () => {
        const res = await QuestionAPI.createOption({
            question_id: questionId,
            option_content: `옵션 ${options.length + 1}`,
            option_order: options.length + 1,
        });

        onOptionsChange([...options, res.data]);
    };

    const removeOption = async (index) => {
        const opt = options[index];
        await QuestionAPI.deleteOption(opt.option_id);

        const filtered = options.filter((_, i) => i !== index);
        onOptionsChange(filtered);
    };

    return (
        <div className="question-option-editor">
            <div ref={listRef}>
                {options.map((opt, index) => (
                    <div key={opt.option_id} className="option-row d-flex align-items-center" data-id={opt.option_id}>
                        <span className="opt-drag text-muted" style={{ cursor: "grab" }}>
                            <i className="bi bi-three-dots-vertical" />
                        </span>

                        <span className="me-2">{getIcon()}</span>

                        <div className="option-wrapper flex-grow-1">
                            <input
                                type="text"
                                className="form-input-option"
                                value={opt.option_content}
                                placeholder={`옵션 ${index + 1}`}
                                onChange={(e) => {
                                    const newList = [...options];
                                    newList[index].option_content = e.target.value;
                                    onOptionsChange(newList);
                                }}
                                onBlur={(e) => {
                                    QuestionAPI.updateOption(opt.option_id, {
                                        option_content: e.target.value,
                                    }).catch(() => alert("옵션 저장 실패"));
                                }}
                            />
                        </div>

                        <button type="button" className="icon-btn-sm" onClick={() => removeOption(index)}>
                            <i className="bi bi-x"></i>
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-1">
                <button type="button" className="btn btn-link btn-sm p-0 text-decoration-none" onClick={addOption}>
                    <span className="me-1">+</span>옵션 추가
                </button>
            </div>
        </div>
    );
}
