import OptionRenderer from "./OptionRenderer";

export default function QuestionRenderer({ question, answers, onChange }) {
    const isRequired = question.is_required === true;

    return (
        <div className="card block-question-card p-3 mb-3">
            <p className="question-text mb-3">
                {question.question_content || question.question_text}
                {isRequired && <span className="text-danger ms-1">*</span>}
            </p>

            <OptionRenderer question={question} answers={answers} onChange={onChange} />
        </div>
    );
}
