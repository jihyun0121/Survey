import { useEffect } from "react";
import { UserAPI } from "../api/api";

export default function LoadingPage() {
    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get("code");
        if (code) handleGoogleLogin(code);
    }, []);

    const handleGoogleLogin = async (code) => {
        try {
            const res = await UserAPI.oauthLogin(code);

            console.log(res.data);

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user_id", res.data.user_id);
            localStorage.setItem("email", res.data.email);

            // alert("구글 로그인 성공");
            window.location.href = "/";
        } catch (err) {
            console.error(err);
            alert("구글 로그인 실패");
            window.location.href = "/auth";
        }
    };

    return <div></div>;
}
