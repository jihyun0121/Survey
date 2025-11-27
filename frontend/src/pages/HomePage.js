import React, { useEffect, useState } from "react";
import Navbar from "../components/home/Navbar";
import EmptyTemplateCard from "../components/home/EmptyTemplateCard";
import RecentFormCard from "../components/home/RecentFormCard";
import { FormAPI } from "../api/api";

export default function Home() {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        loadForms();
    }, []);

    const loadForms = async () => {
        try {
            setLoading(true);
            const userId = localStorage.getItem("user_id");

            let result;
            if (userId) {
                result = await FormAPI.getFormsByUser(userId);
                setForms(result.data || []);
            } else {
                const publicRes = await FormAPI.getAllForms?.();
                setForms(publicRes?.data || []);
            }
            setErrorMsg("");
        } catch (err) {
            console.error("폼 목록 로드 실패:", err);
            setErrorMsg("폼 목록을 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        setForms(forms.filter((f) => f.form_id !== id));
    };

    return (
        <>
            <Navbar showBack={false} />

            <main className="main-wrapper">
                <section className="template-container">
                    <div style={{ maxWidth: 960, margin: "0 auto" }}>
                        <div className="section-title">새 양식 시작하기</div>
                        <div className="g-3">
                            <EmptyTemplateCard />
                        </div>
                    </div>
                </section>

                <section className="recent-container">
                    <div style={{ maxWidth: 960, margin: "0 auto" }}>
                        <h3 className="section-title">최근 설문지</h3>

                        {loading ? (
                            <div>로딩 중...</div>
                        ) : errorMsg ? (
                            <div className="no-result">{errorMsg}</div>
                        ) : forms.length === 0 ? (
                            <div className="no-result">최근에 만든 설문이 없습니다</div>
                        ) : (
                            <div className="row g-3">
                                {forms.map((f) => (
                                    <RecentFormCard
                                        key={f.form_id}
                                        form={{
                                            id: f.form_id,
                                            title: f.title || "제목 없는 설문지",
                                            updatedAt: f.updated_at || f.created_at,
                                        }}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
}
