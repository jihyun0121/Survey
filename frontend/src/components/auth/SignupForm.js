import { useState } from "react";
import Button from "../../ui/Button";

export default function SignupForm({ loading, onSignup, onGoogleLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit() {
        if (!email || !password) return alert("모든 항목을 입력해주세요");
        onSignup({ email, password });
    }

    return (
        <div className="card p-4 shadow-sm">
            <h4 className="fw-bold mb-3">회원가입</h4>

            <div className="mb-3">
                <label className="form-label">이메일</label>
                <input type="email" className="form-input-base auth-place" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일을 입력해주세요" />
            </div>

            <div className="mb-3">
                <label className="form-label">비밀번호</label>
                <input type="password" className="form-input-base auth-place" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호를 입력해주세요" />
            </div>

            <Button variant="success" className="w-100 mb-2" loading={loading} loadText="회원가입 중..." onClick={handleSubmit}>
                이메일로 회원가입
            </Button>

            <Button variant="outline-danger" className="w-100" onClick={onGoogleLogin}>
                <i className="bi bi-google me-2"></i> 구글 계정으로 회원가입
            </Button>
        </div>
    );
}
