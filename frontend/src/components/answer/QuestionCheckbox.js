import { useEffect, useState } from "react";
import { QuestionAPI } from "../../api/api";

export default function QuestionCheckbox({ questionId, answers, onChange }) {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        loadOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [questionId]);

    async function loadOptions() {
        try {
            const res = await QuestionAPI.getOptionsByQuestion(questionId);
            setOptions(res.data || []);
        } catch (e) {
            console.error("옵션 로드 실패", e);
        }
    }

    function toggle(optionId) {
        const key = `${questionId}_${optionId}`;
        const current = !!answers[key];
        onChange(key, !current);
    }

    return (
        <div>
            {options.map((opt) => {
                const key = `${questionId}_${opt.option_id}`;
                const checked = !!answers[key];

                return (
                    <div className="form-check mb-1" key={opt.option_id}>
                        <input className="form-check-input" type="checkbox" checked={checked} onChange={() => toggle(opt.option_id)} />
                        <label className="form-check-label">{opt.option_content}</label>
                    </div>
                );
            })}
        </div>
    );
}
