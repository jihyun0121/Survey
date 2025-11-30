import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { FormAPI, QuestionAPI, AnswerAPI } from "../api/api";
import AnswerTitle from "../components/answer/AnswerTitle";
import QuestionRenderer from "../components/answer/QuestionRenderer";

export default function AnswerFormPage() {
    const { formId } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [page, setPage] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);

    const STORAGE_KEY = useMemo(() => `form_${formId}_answers`, [formId]);

    const current = questions[page];

    useEffect(() => {
        async function init() {
            try {
                const f = await FormAPI.getForm(formId);
                setForm(f.data);

                const q = await QuestionAPI.getQuestionsByForm(formId);
                setQuestions(q.data || []);

                const saved = sessionStorage.getItem(STORAGE_KEY);
                if (saved) {
                    try {
                        setAnswers(JSON.parse(saved));
                    } catch (e) {
                        console.warn("sessionStorage 파싱 실패, 초기화합니다.", e);
                        sessionStorage.removeItem(STORAGE_KEY);
                    }
                }
            } catch (e) {
                console.error("설문/질문 로드 실패", e);
                alert("설문을 불러오는 중 문제가 발생했습니다.");
            }
        }

        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formId]);

    useEffect(() => {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    }, [answers, STORAGE_KEY]);

    function updateAnswer(answerKey, value) {
        setAnswers((prev) => ({
            ...prev,
            [answerKey]: value,
        }));
    }

    function validateRequired() {
        if (!current?.is_required) return true;

        const qId = current.question_id;
        const type = (current.question_type || "").toUpperCase();

        if (type === "CHECKBOX") {
            const prefix = `${qId}_`;
            const anyChecked = Object.entries(answers).some(([key, val]) => key.startsWith(prefix) && !!val);
            return anyChecked;
        } else {
            const key = String(qId);
            const val = answers[key];

            if (val == null) return false;
            if (Array.isArray(val)) return val.length > 0;

            const s = String(val).trim();
            return s.length > 0;
        }
    }

    function goNext() {
        if (!validateRequired()) {
            alert("필수 질문입니다. 응답해주세요.");
            return;
        }
        if (page < questions.length - 1) setPage((p) => p + 1);
    }

    function goPrev() {
        if (page > 0) setPage((p) => p - 1);
    }

    async function submit() {
        if (!validateRequired()) {
            alert("필수 질문입니다. 응답해주세요.");
            return;
        }

        setLoading(true);

        try {
            const userId = localStorage.getItem("user_id");
            if (!userId) {
                alert("로그인이 필요합니다.");
                navigate("/auth");
                return;
            }

            const payloadAnswers = [];

            for (const q of questions) {
                const qId = q.question_id;
                const type = (q.question_type || "").toUpperCase();
                const qKey = String(qId);

                if (type === "CHECKBOX") {
                    const prefix = `${qId}_`;

                    Object.entries(answers).forEach(([key, val]) => {
                        if (!key.startsWith(prefix)) return;
                        if (!val) return;

                        const [, optIdStr] = key.split("_");
                        if (!optIdStr) return;

                        payloadAnswers.push({
                            question_id: qId,
                            option_id: Number(optIdStr),
                            answer_text: null,
                            answer_long: null,
                        });
                    });
                } else if (type === "RADIO") {
                    const selectedOptionId = answers[qKey];
                    if (selectedOptionId == null || selectedOptionId === "") continue;

                    payloadAnswers.push({
                        question_id: qId,
                        option_id: Number(selectedOptionId),
                        answer_text: null,
                        answer_long: null,
                    });
                } else {
                    const val = answers[qKey];
                    if (val == null || String(val).trim() === "") continue;

                    const text = String(val);

                    if (type === "LONG") {
                        payloadAnswers.push({
                            question_id: qId,
                            option_id: null,
                            answer_text: null,
                            answer_long: text,
                        });
                    } else {
                        payloadAnswers.push({
                            question_id: qId,
                            option_id: null,
                            answer_text: text,
                            answer_long: null,
                        });
                    }
                }

            }

            if (payloadAnswers.length === 0) {
                alert("제출할 응답이 없습니다.");
                setLoading(false);
                return;
            }

            for (const ans of payloadAnswers) {
                await AnswerAPI.createAnswer({
                    question_id: ans.question_id,
                    option_id: ans.option_id,
                    answer_text: ans.answer_text,
                    answer_long: ans.answer_long,
                    user_id: Number(userId),
                });
            }

            sessionStorage.removeItem(STORAGE_KEY);
            // alert("응답이 제출되었습니다!");
            navigate("/forms/answer/complete", {
                state: {
                    title: form?.title
                }
            });
        } catch (e) {
            console.error("제출 실패", e);
            alert("제출 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="answer-container">
            <div className="answer-wrapper">
                <AnswerTitle title={form?.title} description={form?.description} />

                {current && <QuestionRenderer question={current} answers={answers} onChange={updateAnswer} />}

                <div className="d-flex justify-content-between mt-4">
                    <button className="btn btn-outline-secondary" onClick={goPrev} disabled={page === 0}>
                        이전
                    </button>

                    {page === questions.length - 1 ? (
                        <button className="btn btn-primary" onClick={submit} disabled={loading}>
                            {loading ? "제출 중..." : "제출하기"}
                        </button>
                    ) : (
                        <button className="btn btn-primary" onClick={goNext} disabled={questions.length === 0}>
                            다음
                        </button>
                    )}
                </div>

                <div className="text-center mt-3 small text-muted">{questions.length > 0 && `${page + 1} / ${questions.length}`}</div>
            </div>
        </div>
    );
}
