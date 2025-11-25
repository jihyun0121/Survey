import React, { useState, useEffect } from "react";
import * as API from "../api";

function AuthPage() {
    const [tab, setTab] = useState("login");

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");

    useEffect(() => {
        const hash = window.location.hash.replace("#", "");
        setTab(hash === "signup" ? "signup" : "login");
    }, []);

    const changeTab = (name) => {
        window.location.hash = name;
        setTab(name);
    };

    const handleLogin = async () => {
        if (!loginEmail || !loginPassword) {
            alert("이메일과 비밀번호를 입력하세요.");
            return;
        }

        try {
            const res = await API.loginUser({
                email: loginEmail,
                password: loginPassword,
            });

            const token = res.data.token;
            if (!token) {
                alert("서버 응답 오류: 토큰 없음");
                return;
            }

            localStorage.setItem("token", token);

            alert("로그인 성공!");

            window.location.href = "/";
        } catch (err) {
            console.error("로그인 실패:", err);
            alert(err.response?.data?.error || "로그인 실패");
        }
    };

    const handleSignup = async () => {
        if (!signupEmail || !signupPassword) return alert("모든 항목을 입력해주세요.");

        try {
            await API.createUser({
                email: signupEmail,
                password: signupPassword,
            });

            alert("회원가입 성공! 로그인해주세요.");
            changeTab("login");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || "회원가입 실패");
        }
    };

    const CLIENT_ID = "697397970424-93p03sqlv7072iss0b9j661ap8tuvf25.apps.googleusercontent.com";
    const REDIRECT_URI = "http://localhost:8080/auth/login/google";

    const handleGoogleLogin = () => {
        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=email profile&access_type=offline&prompt=consent`;
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (code) {
            API.oauthLogin(code)
                .then((res) => {
                    const token = res.data.token;
                    localStorage.setItem("token", token);
                    alert("구글 로그인 성공!");
                    window.location.href = "/";
                })
                .catch((err) => {
                    console.error(err);
                    alert("구글 로그인 실패");
                });
        }
    }, []);

    return (
        <div className="bg-light" style={{ minHeight: "100vh" }}>
            <nav className="navbar navbar-light bg-white border-bottom px-3">
                <a href="/" className="navbar-brand fw-bold">
                    Form Builder
                </a>
            </nav>

            <main className="container" style={{ maxWidth: "420px", paddingTop: "60px" }}>
                <div className="d-flex justify-content-center mb-4">
                    <button className={`btn btn-link tab-btn ${tab === "login" ? "fw-bold" : ""}`} onClick={() => changeTab("login")}>
                        로그인
                    </button>
                    <button className={`btn btn-link tab-btn ${tab === "signup" ? "fw-bold" : ""}`} onClick={() => changeTab("signup")}>
                        회원가입
                    </button>
                </div>

                {tab === "login" && (
                    <div className="card p-4 shadow-sm">
                        <h4 className="fw-bold mb-3">로그인</h4>

                        <div className="mb-3">
                            <label className="form-label">이메일</label>
                            <input type="email" className="form-control" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="email@example.com" />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">비밀번호</label>
                            <input type="password" className="form-control" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••••••" />
                        </div>

                        <button className="btn btn-primary w-100" onClick={handleLogin}>
                            로그인
                        </button>

                        <button className="btn btn-danger w-100 mt-3" onClick={handleGoogleLogin}>
                            <i className="bi bi-google me-2"></i> Google 로그인
                        </button>
                    </div>
                )}

                {tab === "signup" && (
                    <div className="card p-4 shadow-sm">
                        <h4 className="fw-bold mb-3">회원가입</h4>

                        <div className="mb-3">
                            <label className="form-label">이메일</label>
                            <input type="email" className="form-control" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} placeholder="email@example.com" />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">비밀번호</label>
                            <input type="password" className="form-control" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} placeholder="비밀번호" />
                        </div>

                        <button className="btn btn-success w-100" onClick={handleSignup}>
                            회원가입
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}

export default AuthPage;
