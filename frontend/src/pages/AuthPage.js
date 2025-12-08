import { useState } from "react";
import { UserAPI } from "../api/api";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";

export default function AuthPage() {
    const [page, setPage] = useState("login");
    const [loading, setLoading] = useState(false);

    async function handleLogin({ email, password }) {
        setLoading(true);
        try {
            const res = await UserAPI.loginUser({
                user_email: email,
                user_password: password,
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

    async function handleSignup({ email, password }) {
        setLoading(true);
        try {
            await UserAPI.createUser({
                user_email: email,
                user_password: password,
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

            {page === "login" && <LoginForm loading={loading} onLogin={handleLogin} onGoogleLogin={redirectGoogleLogin} />}

            {page === "signup" && <SignupForm loading={loading} onSignup={handleSignup} onGoogleLogin={redirectGoogleLogin} />}
        </div>
    );
}
