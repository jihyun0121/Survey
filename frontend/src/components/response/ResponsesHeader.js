import { useEffect, useRef, useState } from "react";
import { StatisticAPI } from "../../api/api";

export default function ResponsesHeader({ Respondent, activeTab, onChangeTab, formId }) {
    const underlineRef = useRef(null);
    const tabsRef = useRef([]);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        moveUnderline();
        window.addEventListener("resize", moveUnderline);
        return () => window.removeEventListener("resize", moveUnderline);
    });

    function moveUnderline() {
        const index = ["summary", "question", "individual"].indexOf(activeTab);
        const btn = tabsRef.current[index];
        const ul = underlineRef.current;
        if (!btn || !ul) return;
        const { left, width } = btn.getBoundingClientRect();
        const parentLeft = btn.parentElement.getBoundingClientRect().left;
        ul.style.width = width + "px";
        ul.style.left = left - parentLeft + "px";
    }

    async function handleDownload(type) {
        if (!formId) return;
        try {
            setDownloading(true);

            const apiCall = type === "xls" ? StatisticAPI.downloadExcel : StatisticAPI.downloadCSV;
            const res = await apiCall(formId);

            const blob = res.data instanceof Blob ? res.data : new Blob([res.data]);
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = type === "xls" ? `form_${formId}.xls` : `form_${formId}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);
        } catch (e) {
            console.error("다운로드 실패:", e);
            alert("다운로드 중 오류가 발생했습니다.");
        } finally {
            setDownloading(false);
        }
    }

    return (
        <div className="responses-header">
            <div className="responses-header-title">
                <div className="response-title">응답 수 {Respondent}명</div>

                <div className="d-flex gap-2">
                    <button className="icon-btn-sm" onClick={() => handleDownload("xls")} disabled={downloading} data-tooltip={"엑셀 다운로드"}>
                        <i className="bi bi-file-earmark-spreadsheet-fill"></i>
                    </button>

                    <button className="icon-btn-sm" onClick={() => handleDownload("csv")} disabled={downloading} data-tooltip={"CSV 다운로드"}>
                        <i className="bi bi-filetype-csv"></i>
                    </button>
                </div>
            </div>

            <div className="response-page bg-white">
                <nav className="tab-page position-relative">
                    {["summary", "question", "individual"].map((t, i) => (
                        <button key={t} ref={(el) => (tabsRef.current[i] = el)} className={`page-btn fw-semibold ${activeTab === t ? "active" : ""}`} onClick={() => onChangeTab(t)}>
                            {t === "summary" && "요약"}
                            {t === "question" && "질문별 보기"}
                            {t === "individual" && "응답별 보기"}
                        </button>
                    ))}

                    <div className="page-underline" ref={underlineRef} />
                </nav>
            </div>
        </div>
    );
}
