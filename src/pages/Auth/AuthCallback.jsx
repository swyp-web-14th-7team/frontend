import {
    useEffect,
    useRef,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    loginWithSocialCode,
} from "../../api/auth";

import {
    getMyProfileCards,
} from "../../api/profile";

import {
    saveAccessToken,
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

                    const data =
                        await loginWithSocialCode(
                            {
                                provider,
                                code,
                                state,
                            },
                        );

                    if (
                        !data?.accessToken
                    ) {
                        throw new Error(
                            "액세스 토큰을 받지 못했습니다.",
                        );
                    }

                    saveAccessToken(
                        data.accessToken,
                    );

                    /*
                     * 로그인한 사용자의
                     * 기존 프로필 카드 확인
                     */
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

                    /*
                     * 프로필 카드가 없으면
                     * 최초 사용자로 판단하여
                     * 온보딩으로 이동
                     */
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

                    /*
                     * 이미 프로필 카드가 있으면
                     * 탐색 화면으로 이동
                     */
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