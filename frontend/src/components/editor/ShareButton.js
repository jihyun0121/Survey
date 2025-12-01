import React, { useEffect, useState } from "react";

export default function ShareButton({ formId }) {
    const [url, setUrl] = useState("");

    useEffect(() => {
        if (!formId) return;
        const answerUrl = `${window.location.origin}/forms/answer/${formId}`;
        setUrl(answerUrl);
    }, [formId]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            alert("복사되었습니다");
        } catch (err) {
            alert("복사 실패");
        }
    };

    return (
        <div className="dropdown">
            <button className="icon-btn" data-bs-toggle="dropdown" data-tooltip="공유">
                <i className="bi bi-share"></i>
            </button>

            <div className="dropdown-menu p-3 share-menu small">
                <div className="fw-semibold mb-2">응답자 링크</div>

                <input type="text" className="form-input-base form-input-base-sm mb-2" value={url} readOnly />

                <button className="btn btn-secondary btn-sm w-100" onClick={handleCopy}>
                    복사
                </button>
            </div>
        </div>
    );
}
