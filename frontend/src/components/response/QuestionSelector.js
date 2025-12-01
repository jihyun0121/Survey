export default function QuestionSelector({ questions, currentQuestion, onSelect, onPrev, onNext }) {
    return (
        <div className="response-titles">
            <div className="d-flex align-items-center">
                <select className="form-select form-select-sm question-type-select w-auto" value={currentQuestion?.question_id} onChange={(e) => onSelect(e.target.value)}>
                    {questions.map((q) => (
                        <option key={q.question_id} value={q.question_id}>
                            {q.question_content}
                        </option>
                    ))}
                </select>
            </div>

            <div className="prev-btn">
                <button className="btn btn-outline-secondary btn-sm" onClick={onPrev}>
                    <i className="bi bi-chevron-left"></i>
                </button>
                <button className="btn btn-outline-secondary btn-sm" onClick={onNext}>
                    <i className="bi bi-chevron-right"></i>
                </button>
            </div>
        </div>
    );
}
