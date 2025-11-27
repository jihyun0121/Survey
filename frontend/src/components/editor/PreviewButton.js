import React from "react";

export default function PreviewButton({ formId }) {
    const openPreview = () => {
        if (!formId) {
            alert("폼 ID를 찾을 수 없습니다.");
            return;
        }
        window.open(`/preview?formId=${formId}`, "_blank");
    };

    return (
        <button className="icon-btn" id="previewHeaderBtn" data-tooltip="미리보기" onClick={openPreview}>
            <i className="bi bi-eye"></i>
        </button>
    );
}
