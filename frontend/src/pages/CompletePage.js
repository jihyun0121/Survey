import { useLocation } from "react-router-dom";

export default function CompletePage() {
    const location = useLocation();
    const status = location.state?.state;

    return (
        <div className="com-container">
            <div className="com-wrapper">
                <div className="complete-box">
                    {status === "private" && (
                        <>
                            <p className="submitMessage mb-3 text-muted">게시되지않은 설문입니다.</p>
                        </>
                    )}

                    {status === "already" && (
                        <>
                            <p className="submitMessage mb-3 text-muted">이미 참여한 설문입니다.</p>
                        </>
                    )}

                    {status === "complete" && (
                        <>
                            <p className="submitMessage mb-3 text-muted">응답이 제출되었습니다.</p>
                        </>
                    )}

                    <button className="com-btn" onClick={() => (window.location.href = "/")}>
                        홈으로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
}
