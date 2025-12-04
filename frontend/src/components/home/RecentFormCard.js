import React from "react";
import { FormAPI } from "../../api/api";

export default function RecentFormCard({ form, onDelete }) {
    const formattedDate = form.updatedAt ? new Date(form.updatedAt).toLocaleDateString("ko-KR") : "-";

    const handleDelete = async (e) => {
        e.stopPropagation();

        try {
            await FormAPI.deleteForm(form.id);
            onDelete(form.id);
        } catch (err) {
            console.error(err);
            alert("삭제 실패: 서버 오류");
        }
    };

    const handleResponse = async (e) => {
        e.stopPropagation();

        window.location.href = `/forms/responses/${form.id}`;
    };

    return (
        <div className="col-12 col-md-6 col-lg-4" onClick={() => (window.location.href = `/forms/edit/${form.id}`)}>
            <div className="recent-card position-relative">
                <div className="card-body">
                    <div className="dropdown position-absolute recent-menu-btn" style={{ top: 6, right: 6 }}>
                        <button className="icon-btn no-propagation" data-bs-toggle="dropdown" onClick={(e) => e.stopPropagation()}>
                            <i className="bi bi-three-dots-vertical"></i>
                        </button>

                        <div className="dropdown-menu small dropdown-menu-end">
                            <button className="dropdown-item" onClick={handleResponse}>
                                응답 결과
                            </button>
                            <button className="dropdown-item text-danger" onClick={handleDelete}>
                                삭제
                            </button>
                        </div>
                    </div>

                    <div className="recent-title">{form.title}</div>
                    <div className="muted-text mt-1">
                        <i class="bi bi-clock-history me-1"></i>
                        {formattedDate}
                    </div>
                </div>
            </div>
        </div>
    );
}
