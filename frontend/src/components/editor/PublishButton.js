import React, { useState } from "react";
import { FormAPI } from "../../api/api";

export default function PublishButton({ formId, initialPublic }) {
    const [isPublic, setIsPublic] = useState(initialPublic);

    const togglePublish = async () => {
        const nextState = !isPublic;

        if (!nextState) {
            const ok = window.confirm("정말 게시를 취소할까요?");
            if (!ok) return;
        }

        try {
            await FormAPI.updateForm(formId, { is_public: nextState });

            setIsPublic(nextState);
            alert(nextState ? "게시 완료" : "게시 취소 완료");
        } catch (err) {
            console.error(err);
            alert("처리 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="dropdown">
            <button className="icon-btn" data-bs-toggle="dropdown" data-tooltip={isPublic ? "게시 취소" : "게시하기"}>
                {isPublic ? <i class="bi bi-box-arrow-in-down"></i> : <i class="bi bi-box-arrow-up"></i>}
            </button>

            <div className="dropdown-menu small">
                <button className="dropdown-item" onClick={togglePublish}>
                    {isPublic ? "게시 취소" : "게시하기"}
                </button>
            </div>
        </div>
    );
}
