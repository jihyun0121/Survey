import React, { useEffect, useState } from "react";
import { StatisticAPI } from "../../api/api";
import SummaryItemCard from "./SummaryItemCard";

export default function SummaryTab({ formId, questions, answers }) {
    const [setFormStats] = useState(null);

    useEffect(() => {
        if (!formId) return;
        async function loadStats() {
            try {
                const res = await StatisticAPI.getFormStatistics(formId);
                setFormStats(res.data);
            } catch (e) {
                console.error("폼 통계 로드 실패:", e);
            }
        }
        loadStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formId]);

    if (!questions || questions.length === 0) {
        return (
            <section className="summary-section text-center text-muted-none mt-3">
                <span>질문이 없습니다</span>
            </section>
        );
    }

    return (
        <div className="summary-tab-container">
            {questions.map((q) => (
                <SummaryItemCard key={q.question_id} question={q} allAnswers={answers || []} />
            ))}
        </div>
    );
}
