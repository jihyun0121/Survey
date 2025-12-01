import { useState, useEffect } from "react";
import QuestionSelector from "./QuestionSelector";
import QuestionResponseCard from "./QuestionResponseCard";
import { QuestionAPI } from "../../api/api";

export default function QuestionTab({ questions, answers }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [optionsMap, setOptionsMap] = useState({});

    useEffect(() => {
        loadOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const currentQuestion = questions[currentIndex];

    function move(step) {
        let next = currentIndex + step;
        if (next < 0) next = questions.length - 1;
        if (next >= questions.length) next = 0;
        setCurrentIndex(next);
    }

    function selectById(id) {
        const idx = questions.findIndex((q) => q.question_id === Number(id));
        if (idx !== -1) setCurrentIndex(idx);
    }

    return (
        <div className="question-tab-container">
            <QuestionSelector questions={questions} currentQuestion={currentQuestion} onSelect={selectById} onPrev={() => move(-1)} onNext={() => move(1)} />

            <QuestionResponseCard question={currentQuestion} answers={answers} options={optionsMap[currentQuestion.question_id] || []} />
        </div>
    );
}
