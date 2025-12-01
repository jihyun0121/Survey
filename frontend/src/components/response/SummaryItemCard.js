import React, { useEffect, useMemo, useState } from "react";
import { QuestionAPI } from "../../api/api";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const VIEW_TYPES = ["pie", "bar", "hbar", "list"];

const COLORS = ["#4285f4", "#ff5722", "#ff9800", "#4caf50", "#673ab7", "#03a9f4", "#db4437", "#009688", "#3f51b5", "#607d8b", "#00bcd4", "#9e9e9e"];

export default function SummaryItemCard({ question, allAnswers }) {
    const [viewType, setViewType] = useState("pie");
    const [options, setOptions] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState(false);
    const [optionsError, setOptionsError] = useState(null);

    const type = (question.question_type || "").toUpperCase();
    const isChoice = type === "RADIO" || type === "CHECKBOX";
    const isText = type === "SHORT" || type === "LONG";

    useEffect(() => {
        if (!isChoice) return;
        async function loadOptions() {
            try {
                setLoadingOptions(true);
                setOptionsError(null);
                const res = await QuestionAPI.getOptionsByQuestion(question.question_id);
                const data = res.data || [];
                setOptions(data.slice().sort((a, b) => a.option_order - b.option_order));
            } catch (e) {
                console.error("옵션 로드 실패:", e);
                setOptionsError("옵션을 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoadingOptions(false);
            }
        }
        loadOptions();
    }, [question.question_id, isChoice]);

    const answers = useMemo(() => (allAnswers || []).filter((a) => a.question_id === question.question_id), [allAnswers, question.question_id]);

    const choiceStats = useMemo(() => {
        if (!isChoice || !answers.length) return { labels: [], counts: [] };
        const map = new Map();
        options.forEach((opt) => {
            map.set(opt.option_id, { label: opt.option_content, count: 0 });
        });
        let etcCount = 0;
        answers.forEach((a) => {
            if (a.option_id && map.has(a.option_id)) {
                const obj = map.get(a.option_id);
                obj.count += 1;
            } else {
                etcCount += 1;
            }
        });
        const labels = [];
        const counts = [];
        for (const [, v] of map.entries()) {
            labels.push(v.label);
            counts.push(v.count);
        }
        if (etcCount > 0) {
            labels.push("기타");
            counts.push(etcCount);
        }
        return { labels, counts };
    }, [answers, options, isChoice]);

    const textAnswers = useMemo(() => {
        if (!isText || !answers.length) return [];
        return answers.map((a) => a.answer_text || a.answer_long).filter((v) => v && String(v).trim().length > 0);
    }, [answers, isText]);

    const hasData = useMemo(() => {
        if (isChoice) {
            return choiceStats.counts.some((c) => c > 0);
        }
        if (isText) {
            return textAnswers.length > 0;
        }
        return answers.length > 0;
    }, [isChoice, isText, choiceStats, textAnswers, answers]);

    function renderViewButtons() {
        return (
            <div className="icon-btn-wrapper bg-light">
                {VIEW_TYPES.map((typeKey) => (
                    <button key={typeKey} type="button" className={`icon-btn-sm ${viewType === typeKey ? "btn-primary seleccted-btn" : "btn-outline-secondary"}`} onClick={() => setViewType(typeKey)}>
                        {typeKey === "pie" && <i className="bi bi-pie-chart"></i>}
                        {typeKey === "bar" && <i className="bi bi-bar-chart-line"></i>}
                        {typeKey === "hbar" && <i className="bi bi-bar-chart-line trans"></i>}
                        {typeKey === "list" && <i className="bi bi-list-ul"></i>}
                    </button>
                ))}
            </div>
        );
    }

    function renderChartArea() {
        if (!hasData) {
            return <div className="text-muted-none small mt-3">아직 이 질문에 대한 응답이 없습니다.</div>;
        }

        if (viewType !== "list" && isText) {
            return <div className="text-muted-none small mt-3">텍스트 응답 질문은 리스트 형태로만 표시됩니다.</div>;
        }

        if (viewType === "list") {
            if (isChoice) {
                return (
                    <div className="text-container">
                        {choiceStats.labels.map((label, idx) => (
                            <div className="text-content" key={idx}>
                                {label}: {choiceStats.counts[idx]}
                            </div>
                        ))}
                    </div>
                );
            }
            if (isText) {
                return (
                    <div className="text-container">
                        {textAnswers.map((t, idx) => (
                            <div key={idx} className="text-content">
                                {t}
                            </div>
                        ))}
                    </div>
                );
            }
            return (
                <div className="text-container">
                    {answers.map((a) => (
                        <div key={a.answer_id} className="text-content">
                            {a.answer_text || a.answer_long || "-"}
                        </div>
                    ))}
                </div>
            );
        }

        if (!isChoice) {
            return <div className="text-muted-none small mt-3">이 질문은 그래프로 표시할 수 없습니다.</div>;
        }

        if (!choiceStats.labels.length) {
            return <div className="text-muted-none small mt-3">옵션 통계가 없습니다.</div>;
        }

        const data = {
            labels: choiceStats.labels,
            datasets: [
                {
                    data: choiceStats.counts,
                    backgroundColor: choiceStats.labels.map((_, i) => COLORS[i % COLORS.length]),
                },
            ],
        };

        if (viewType === "pie") {
            return (
                <div className="mt-3">
                    <Pie data={data} />
                </div>
            );
        }

        if (viewType === "bar") {
            const options = {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true },
                },
                scales: {
                    x: { beginAtZero: true, ticks: { precision: 0 } },
                    y: { beginAtZero: true, ticks: { precision: 0 } },
                },
            };
            return (
                <div className="mt-3">
                    <Bar data={data} options={options} />
                </div>
            );
        }

        if (viewType === "hbar") {
            const options = {
                indexAxis: "y",
                responsive: true,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true },
                },
                scales: {
                    x: { beginAtZero: true, ticks: { precision: 0 } },
                    y: { beginAtZero: true, ticks: { precision: 0 } },
                },
            };
            return (
                <div className="mt-3">
                    <Bar data={data} options={options} />
                </div>
            );
        }

        return null;
    }

    return (
        <div className="chart-card">
            <div className="chart-question">
                Q{question.question_order}. {question.question_content}
            </div>

            {isChoice && loadingOptions && <div className="small text-muted mt-1">옵션 불러오는 중...</div>}
            {optionsError && <div className="small text-danger mt-1">{optionsError}</div>}

            {renderViewButtons()}
            {renderChartArea()}
        </div>
    );
}
