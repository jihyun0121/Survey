import { useEffect, useRef } from "react";

export default function QuestionLongText({ questionId, value, onChange }) {
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            autoResize(inputRef.current);
        }
    }, [value]);

    function autoResize(el) {
        if (!el) return;
        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
    }

    return (
        <div className="input-wrapper">
            <textarea ref={inputRef} className="form-input-base" value={value || ""} placeholder="답변을 입력하세요" onChange={(e) => onChange(e.target.value)} onInput={(e) => autoResize(e.target)} rows={1} />
        </div>
    );
}
