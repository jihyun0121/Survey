import { useState } from "react";
import Button from "../../ui/Button";

export default function LoginForm({ loading, onLogin, onGoogleLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit() {
        if (!email || !password) return alert("이메일과 비밀번호를 입력하세요");
        onLogin({ email, password });
    }

    return (
        <div className="card p-4 shadow-sm">
            <h4 className="fw-bold mb-3">로그인</h4>

            <div className="mb-3">
                <label className="form-label">이메일</label>
                <input type="email" className="form-input-base auth-place" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일을 입력해주세요" />
            </div>

            <div className="mb-3">
                <label className="form-label">비밀번호</label>
                <input type="password" className="form-input-base auth-place" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호를 입력해주세요" />
            </div>

            <Button variant="primary" className="w-100 mb-2" loading={loading} loadText="로그인 중..." onClick={handleSubmit}>
                이메일로 로그인
            </Button>

            <Button variant="outline-danger" className="w-100" onClick={onGoogleLogin}>
                <i className="bi bi-google me-2"></i> 구글 계정으로 로그인
            </Button>
        </div>
    );
}
