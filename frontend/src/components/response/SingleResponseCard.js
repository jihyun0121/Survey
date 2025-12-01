import { useEffect, useState } from "react";
import { QuestionAPI } from "../../api/api";

export default function SingleResponseCard({ answerList, questions }) {
    const [optionsMap, setOptionsMap] = useState({});

    useEffect(() => {
        loadOptions();
        // eslint-disable-next-line
    }, [questions]);

    async function loadOptions() {
        const map = {};
        for (const q of questions) {
            if (q.question_type === "RADIO" || q.question_type === "CHECKBOX") {
                const res = await QuestionAPI.getOptionsByQuestion(q.question_id);
                map[q.question_id] = res.data;
            }
        }
        setOptionsMap(map);
    }

    function renderAnswer(q) {
        const type = q.question_type;
        const options = optionsMap[q.question_id] || [];

        const answersForQ = answerList.filter((a) => a.question_id === q.question_id);

        if (type === "SHORT" || type === "LONG") {
            const a = answersForQ[0];
            const val = a?.answer_text || a?.answer_long;

            return <div className="p-2 bg-light border rounded">{val || "응답 없음"}</div>;
        }

        if (type === "RADIO") {
            const selected = answersForQ[0]?.option_id;

            return (
                <div>
                    {options.length === 0 && <div>(옵션 없음)</div>}
                    {options.map((opt) => (
                        <div key={opt.option_id} className="d-flex align-items-center mb-1">
                            <input type="radio" checked={selected === opt.option_id} disabled readOnly className="form-check-input me-2" />
                            {opt.option_content}
                        </div>
                    ))}

                    {selected == null && <div className="text-muted small mt-1">응답 없음</div>}
                </div>
            );
        }

        if (type === "CHECKBOX") {
            const checkedIds = answersForQ.map((a) => a.option_id).filter(Boolean);

            return (
                <div>
                    {options.map((opt) => (
                        <div key={opt.option_id} className="d-flex align-items-center mb-1">
                            <input type="checkbox" checked={checkedIds.includes(opt.option_id)} disabled readOnly className="form-check-input me-2" />
                            {opt.option_content}
                        </div>
                    ))}

                    {checkedIds.length === 0 && <div className="text-muted small mt-1">응답 없음</div>}
                </div>
            );
        }

        return <div>(응답 없음)</div>;
    }

    return (
        <>
            {questions.map((q) => {
                return (
                    <div key={q.question_id} className="res-card mb-3 bg-white p-3">
                        <div className="fw-semibold mb-2">{q.question_content || "삭제된 질문"}</div>
                        {renderAnswer(q)}
                    </div>
                );
            })}
        </>
    );
}
