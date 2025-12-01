import { useEffect, useState } from "react";
import { StatisticAPI } from "../../api/api";

export default function QuestionResponseCard({ question, answers, options }) {
    const [stats, setStats] = useState(null);
    const [textList, setTextList] = useState([]);

    useEffect(() => {
        loadStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [question]);

    async function loadStats() {
        if (!question) return;

        const qId = question.question_id;
        const type = question.question_type.toUpperCase();

        if (type === "RADIO") {
            const res = await StatisticAPI.getOptionStats(qId);
            setStats(res.data);
        } else if (type === "CHECKBOX") {
            const res = await StatisticAPI.getCheckboxGroupStats(qId);
            setStats(res.data);
        } else if (type === "SHORT" || type === "LONG") {
            const res = await StatisticAPI.getTextAnswers(qId);
            setTextList(res.data);
        }
    }

    if (!question) return null;

    const type = question.question_type.toUpperCase();

    return (
        <div className="mt-3">
            <div className="res-card mb-3 bg-white">
                <div className="fw-semibold">
                    Q{question.question_order}. {question.question_content}
                </div>
            </div>

            <div className="text-container">
                {type === "RADIO" && <RadioResult stats={stats} options={options} />}

                {type === "CHECKBOX" && <CheckboxResult stats={stats} options={options} />}

                {(type === "SHORT" || type === "LONG") && <TextResult textList={textList} />}
            </div>
        </div>
    );
}

function RadioResult({ stats, options }) {
    if (!stats) return <div className="p-3">로딩중...</div>;

    return (
        <div className="p-3 bg-white border rounded">
            {options.map((o) => {
                const value = stats[o.option_id] || 0;
                const percent = value.toFixed(1);

                return (
                    <div key={o.option_id} className="mb-2">
                        <div className="d-flex justify-content-between">
                            <span>{o.option_content}</span>
                            <span>{percent}%</span>
                        </div>
                        <div className="progress" style={{ height: "6px" }}>
                            <div className="progress-bar" style={{ width: `${percent}%`, backgroundColor: "#607d8b" }}></div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function CheckboxResult({ stats, options }) {
    if (!stats) return <div className="p-3">로딩중...</div>;

    return (
        <div className="d-flex flex-column gap-4">
            {Object.entries(stats).map(([combination, count]) => {
                const selectedIds = combination.split(",").map((id) => Number(id));

                return (
                    <div key={combination} className="text-group">
                        {options.map((opt) => {
                            const checked = selectedIds.includes(opt.option_id);

                            return (
                                <div key={opt.option_id} className="option-column">
                                    <span style={{ marginRight: "6px" }}>{checked ? <input type="checkbox" disabled className="form-check-input" checked /> : <input type="checkbox" disabled className="form-check-input" />}</span>
                                    <span className="form-check-label">{opt.option_content}</span>
                                </div>
                            );
                        })}
                        <div className="mt-2 text-muted small">
                            <div className="border-bottom"></div>
                            <br />
                            응답 {count}개
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function TextResult({ textList }) {
    return (
        <div className="text-wrapper m-0">
            {textList.length === 0 && <div className="text-muted">응답 없음</div>}

            {textList.map((t, idx) => (
                <div key={idx} className="text-content">
                    {t}
                </div>
            ))}
        </div>
    );
}
