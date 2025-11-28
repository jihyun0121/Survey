import React, { useEffect, useRef } from "react";

export default function FormTitleEditor({ title, description, onChangeTitle, onChangeDescription }) {
    const descRef = useRef();

    useEffect(() => {
        if (descRef.current) {
            autoResize(descRef.current);
        }
    }, [description]);

    const handleTitleBlur = () => {
        sessionStorage.setItem("title", title);
        onChangeTitle(title, true);
    };

    const handleDescBlur = () => {
        sessionStorage.setItem("description", description);
        onChangeDescription(description, true);
    };

    function autoResize(e) {
        if (!e) return;
        e.style.height = "auto";
        e.style.height = e.scrollHeight + "px";
    }

    return (
        <section className="title-section">
            <div className="card block-card title-block-card" data-block-type="title">
                <div className="card-body">
                    <div className="input-wrapper mb-2">
                        <input
                            className="form-input-base form-title"
                            placeholder="설문 제목"
                            value={title || ""}
                            onChange={(e) => {
                                onChangeTitle(e.target.value);
                                autoResize(e.target);
                            }}
                            onInput={(e) => autoResize(e.target)}
                            onBlur={handleTitleBlur}
                        />
                    </div>

                    <div className="input-wrapper">
                        <textarea ref={descRef} className="form-input-base" placeholder="설문 설명을 입력하세요" value={description || ""} onChange={(e) => onChangeDescription(e.target.value)} onBlur={handleDescBlur} rows={1}></textarea>
                    </div>
                </div>
            </div>
        </section>
    );
}
