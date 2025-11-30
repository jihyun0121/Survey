export default function QuestionShortText({ questionId, value, onChange }) {
    return <input className="form-input-base" placeholder="답변을 입력하세요" value={value || ""} onChange={(e) => onChange(e.target.value)} />;
}
