import {
    useEffect,
    useRef,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    getMyInfo,
    loginWithSocialCode,
} from "../../api/auth";

import {
    getMyProfileCards,
} from "../../api/profile";

import {
    saveAccessToken,
    saveUserName,
} from "../../utils/auth";

const AuthCallback = ({
    provider,
}) => {
    const navigate =
        useNavigate();

    const isCalled =
        useRef(false);

    useEffect(() => {
        if (isCalled.current) {
            return;
        }

        isCalled.current = true;

        const handleLogin =
            async () => {
                try {
                    const params =
                        new URLSearchParams(
                            window.location
                                .search,
                        );

                    const code =
                        params.get(
                            "code",
                        );

                    const state =
                        params.get(
                            "state",
                        );

                    if (!code) {
                        throw new Error(
                            "인가 코드가 없습니다.",
                        );
                    }

                    const loginData =
                        await loginWithSocialCode(
                            {
                                provider,
                                code,
                                state,
                            },
                        );

                    console.log(
                        "로그인 API 응답:",
                        loginData,
                    );

                    if (
                        !loginData
                            ?.accessToken
                    ) {
                        throw new Error(
                            "액세스 토큰을 받지 못했습니다.",
                        );
                    }

                    saveAccessToken(
                        loginData.accessToken,
                    );

                    const myInfo =
                        await getMyInfo();

                    console.log(
                        "내 정보 조회 응답:",
                        myInfo,
                    );

                    const userName =
                        myInfo?.name ||
                        myInfo?.nickname ||
                        "";

                    if (userName) {
                        saveUserName(
                            userName,
                        );
                    }

                    const profileData =
                        await getMyProfileCards(
                            {
                                page: 1,
                                limit: 1,
                                sort:
                                    "createdAt",
                                order:
                                    "desc",
                            },
                        );

                    const profileCards =
                        profileData?.items ||
                        [];

                    if (
                        profileCards.length ===
                        0
                    ) {
                        navigate(
                            "/onboarding",
                            {
                                replace:
                                    true,
                            },
                        );

                        return;
                    }

                    navigate(
                        "/explore",
                        {
                            replace: true,
                        },
                    );
                } catch (error) {
                    console.error(
                        "로그인 처리 실패:",
                        error,
                    );

                    alert(
                        "로그인 처리 중 문제가 발생했습니다.",
                    );

                    navigate(
                        "/explore",
                        {
                            replace: true,
                        },
                    );
                }
            };

        handleLogin();
    }, [
        provider,
        navigate,
    ]);

    return (
        <div>
            {provider} 로그인 처리
            중...
        </div>
    );
};

export default AuthCallback;