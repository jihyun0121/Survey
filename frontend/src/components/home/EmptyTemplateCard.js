import React from "react";
import { FormAPI } from "../../api/api";

export default function EmptyTemplateCard() {
    const handleCreate = async () => {
        try {
            const userId = localStorage.getItem("user_id");

            const dto = {
                title: "제목 없는 설문지",
                description: "",
                user_id: userId ? Number(userId) : null,
            };

            console.log(dto);
            const res = await FormAPI.createForm(dto);

            console.log(res);
            const newForm = res.data;

            if (!newForm?.form_id) throw new Error("form_id 없음");

            window.location.href = `/forms/${newForm.form_id}/edit`;
        } catch (err) {
            console.error(err);
            alert("새 양식을 생성할 수 없습니다.");
        }
    };

    return (
        <div className="empty-temp col-6 col-sm-4 col-md-3" onClick={handleCreate}>
            <img className="temp-image" src="https://ssl.gstatic.com/docs/templates/thumbnails/forms-blank-googlecolors.png" alt="새 양식" />
            <span className="fw-semibold">빈 양식</span>
        </div>
    );
}
