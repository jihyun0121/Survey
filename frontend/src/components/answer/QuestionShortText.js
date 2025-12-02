export default function QuestionShortText({ value, onChange }) {
    return (
        <div className="input-wrapper">
            <input className="form-input-base" placeholder="답변을 입력하세요" value={value || ""} onChange={(e) => onChange(e.target.value)} />
        </div>
    );
}
