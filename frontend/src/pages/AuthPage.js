import { useState } from "react";
import { UserAPI } from "../api/api";

export default function AuthPage() {
    const [page, setPage] = useState("login");
    const [loading, setLoading] = useState(false);

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");

    // const validatePassword = (pwd) => {
    //     const minLength = 8;
    //     const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?{}[\]~]).+$/;
    //     if (pwd.length < minLength) {
    //         return `비밀번호는 최소 ${minLength}자리 이상이어야 합니다.`;
    //     }
    //     if (!regex.test(pwd)) {
    //         return "비밀번호는 대문자, 소문자, 숫자, 특수문자를 모두 포함해야 합니다.";
    //     }
    //     return "";
    // };

    async function handleLogin() {
        if (!loginEmail || !loginPassword) return alert("이메일과 비밀번호를 입력하세요");
        setLoading(true);

        try {
            const res = await UserAPI.loginUser({
                user_email: loginEmail,
                user_password: loginPassword,
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user_id", res.data.user_id);
            localStorage.setItem("email", res.data.email);

            alert("로그인 성공");
            window.location.href = "/";
        } catch (e) {
            alert(e.response?.data?.error || "로그인 실패");
        } finally {
            setLoading(false);
        }
    }

    async function handleSignup() {
        if (!signupEmail || !signupPassword) return alert("모든 항목을 입력해주세요");
        setLoading(true);

        try {
            await UserAPI.createUser({
                user_email: signupEmail,
                user_password: signupPassword,
            });

            alert("회원가입 성공");
            setPage("login");
        } catch (e) {
            alert(e.response?.data?.error || "회원가입 실패");
        } finally {
            setLoading(false);
        }
    }

    function redirectGoogleLogin() {
        const CLIENT_ID = "697397970424-93p03sqlv7072iss0b9j661ap8tuvf25.apps.googleusercontent.com";
        const REDIRECT_URI = "http://localhost:3000/loading";
        const googleAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=email%20profile%20openid&access_type=offline`;

        window.location.href = googleAuthURL;
    }

    return (
        <div className="container" style={{ maxWidth: 420, paddingTop: 60 }}>
            <div className="d-flex justify-content-center mb-4">
                <button className={`btn btn-link ${page === "login" ? "fw-bold" : ""}`} onClick={() => setPage("login")}>
                    로그인
                </button>
                <button className={`btn btn-link ${page === "signup" ? "fw-bold" : ""}`} onClick={() => setPage("signup")}>
                    회원가입
                </button>
            </div>

            {page === "login" && (
                <div className="card p-4 shadow-sm">
                    <h4 className="fw-bold mb-3">로그인</h4>

                    <div className="mb-3">
                        <label className="form-label">이메일</label>
                        <div className="input-wrapper">
                            <input type="email" className="form-input-base" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="이메일을 입력해주세요" />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">비밀번호</label>
                        <div className="input-wrapper">
                            <input type="password" className="form-input-base" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="비밀번호를 입력해주세요" />
                        </div>
                    </div>

                    <button className="btn btn-primary w-100 mb-2" onClick={handleLogin} disabled={loading}>
                        {loading ? "로그인 중..." : "이메일로 로그인"}
                    </button>

                    <button className="btn btn-outline-danger w-100" onClick={redirectGoogleLogin}>
                        <i className="bi bi-google me-2"></i> 구글 계정으로 로그인
                    </button>
                </div>
            )}

            {page === "signup" && (
                <div className="card p-4 shadow-sm">
                    <h4 className="fw-bold mb-3">회원가입</h4>

                    <div className="mb-3">
                        <label className="form-label">이메일</label>
                        <div className="input-wrapper">
                            <input type="email" className="form-input-base" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} placeholder="이메일을 입력해주세요" />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">비밀번호</label>
                        <div className="input-wrapper">
                            <input type="password" className="form-input-base" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} placeholder="비밀번호를 입력해주세요" />
                        </div>
                    </div>

                    <button className="btn btn-success w-100 mb-2" onClick={handleSignup} disabled={loading}>
                        {loading ? "회원가입 중..." : "이메일로 회원가입"}
                    </button>

                    <button className="btn btn-outline-danger w-100" onClick={redirectGoogleLogin}>
                        <i className="bi bi-google me-2"></i> 구글 계정으로 회원가입
                    </button>
                </div>
            )}
        </div>
    );
}
