import React from "react";

export default function FloatingMenu({ handleAddQuestion }) {
    return (
        <aside className="floating-menu bg-white d-md-flex flex-column">
            <button className="icon-btn" data-tooltip="질문 추가" onClick={handleAddQuestion}>
                <i className="bi bi-plus-lg"></i>
            </button>
        </aside>
    );
}
