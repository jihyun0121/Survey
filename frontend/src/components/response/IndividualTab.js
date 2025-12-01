import { useState } from "react";
import SingleResponseCard from "./SingleResponseCard";
import { AnswerAPI } from "../../api/api";

export default function IndividualTab({ responses, setResponses, questions }) {
    const users = [...new Set(responses.map((a) => a.user_id))];
    const [currentIndex, setCurrentIndex] = useState(0);

    const currentUserId = users[currentIndex];
    const thisUserAnswers = responses.filter((a) => a.user_id === currentUserId);

    function move(step) {
        let next = currentIndex + step;
        if (next < 0) next = users.length - 1;
        if (next >= users.length) next = 0;
        setCurrentIndex(next);
    }

    async function deleteAll() {
        if (!window.confirm("이 응답을 모두 삭제할까요?")) return;
        await AnswerAPI.deleteAnswer(currentUserId);
        const newList = responses.filter((a) => a.user_id !== currentUserId);
        setResponses(newList);
        const newUsers = [...new Set(newList.map((a) => a.user_id))];
        if (newUsers.length === 0) return;
        setCurrentIndex(0);
    }

    return (
        <div className="mt-3">
            <div className="response-sub-title response-titles">
                <div className="d-flex align-items-center">
                    <input
                        type="number"
                        min={1}
                        max={users.length}
                        className="form-input-base form-input-border w-auto"
                        value={currentIndex + 1}
                        onChange={(e) => {
                            const v = Number(e.target.value);
                            if (v >= 1 && v <= users.length) setCurrentIndex(v - 1);
                        }}
                    />
                    <span className="small"> / {users.length}</span>
                </div>
                <div>
                    <button className="btn btn-outline-secondary btn-sm me-1" onClick={() => move(-1)}>
                        <i className="bi bi-chevron-left"></i>
                    </button>
                    <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => move(1)}>
                        <i className="bi bi-chevron-right"></i>
                    </button>
                    <button className="btn btn-outline-danger btn-sm me-3" onClick={deleteAll}>
                        <i className="bi bi-trash"></i>
                    </button>
                </div>
            </div>

            <div className="mt-3">
                <SingleResponseCard answerList={thisUserAnswers} questions={questions} />
            </div>
        </div>
    );
}
