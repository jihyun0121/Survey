import { useEffect, useState } from "react";
import { QuestionAPI } from "../../api/api";

export default function QuestionRadio({ questionId, value, onChange }) {
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

    return (
        <div>
            {options.map((opt) => (
                <div className="form-check mb-1" key={opt.option_id}>
                    <input className="form-check-input" type="radio" name={`q_${questionId}`} checked={String(value) === String(opt.option_id)} onChange={() => onChange(opt.option_id)} />
                    <label className="form-check-label">{opt.option_content}</label>
                </div>
            ))}
        </div>
    );
}
