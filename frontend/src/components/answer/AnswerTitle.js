import React, { useRef } from "react";

export default function AnswerTitle({ title, description }) {
    const descRef = useRef();

    return (
        <section className="title-section">
            <div className="card block-card title-block-card" data-block-type="title">
                <div className="card-body">
                    <div className="editor-wrapper mb-2">
                        <div className="input-wrapper">
                            <span className="form-input-base form-title">{title || ""}</span>
                        </div>
                    </div>

                    <div className="editor-wrapper">
                        <div className="input-wrapper">
                            <span ref={descRef} className="form-input-base">
                                {description || ""}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
