    import { useEffect, useRef } from "react";
    import { useNavigate } from "react-router-dom";

    import { loginWithSocialCode } from "../../api/auth";
    import { saveAccessToken } from "../../utils/auth";

    const AuthCallback = ({ provider }) => {
    const navigate = useNavigate();
    const isCalled = useRef(false);

    useEffect(() => {
        if (isCalled.current) {
        return;
        }

        isCalled.current = true;

        const handleLogin = async () => {
        try {
            const params = new URLSearchParams(
            window.location.search,
            );

            const code = params.get("code");
            const state = params.get("state");

            if (!code) {
            throw new Error("인가 코드가 없습니다.");
            }

            const data = await loginWithSocialCode({
            provider,
            code,
            state,
            });

            if (!data?.accessToken) {
            throw new Error(
                "액세스 토큰을 받지 못했습니다.",
            );
            }

            saveAccessToken(data.accessToken);

            navigate("/explore", {
            replace: true,
            });
        } catch (error) {
            console.error(error);

            alert("로그인 처리 중 문제가 발생했습니다.");

            navigate("/login", {
            replace: true,
            });
        }
        };

        handleLogin();
    }, [provider, navigate]);

    return <div>{provider} 로그인 처리 중...</div>;
    };

    export default AuthCallback;