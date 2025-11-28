import React, { useRef } from "react";

export default function FormTitleEditor({ title, description, onChangeTitle, onChangeDescription }) {
    const descRef = useRef();

    const handleTitleBlur = () => {
        sessionStorage.setItem("title", title);
        onChangeTitle(title, true);
    };

    const handleDescBlur = () => {
        sessionStorage.setItem("description", description);
        onChangeDescription(description, true);
    };

    return (
        <section className="title-section">
            <div className="card block-card title-block-card" data-block-type="title">
                <div className="card-body">
                    <div className="editor-wrapper mb-2">
                        <div className="input-wrapper">
                            <input className="form-input-base form-title" placeholder="설문 제목" value={title || ""} onChange={(e) => onChangeTitle(e.target.value)} onBlur={handleTitleBlur} />
                        </div>
                    </div>

                    <div className="editor-wrapper">
                        <div className="input-wrapper">
                            <input ref={descRef} className="form-input-base" placeholder="설문 설명을 입력하세요" value={description || ""} onChange={(e) => onChangeDescription(e.target.value)} onBlur={handleDescBlur} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
