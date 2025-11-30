export default function CompletePage({ title }) {
    return (
        <div className="com-container">
            <div className="com-wrapper">
                <div className="complete-box">
                    <h3 className="submitTitle fw-bold mb-2">
                        {title}
                    </h3>
                    <p className="submitMessage mb-3 text-muted">
                        응답이 기록되었습니다
                    </p>

                    <button className="com-btn" onClick={() => (window.location.href = "/")}>
                        홈으로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
}
