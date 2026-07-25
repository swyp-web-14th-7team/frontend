import {
    apiRequest,
} from "./apiClient";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL;

const parseResponse = async (
    response,
) => {
    const result = await response
        .json()
        .catch(() => null);

    if (!response.ok) {
        const message =
            result?.message ||
            result?.error?.message ||
            "인증 요청에 실패했습니다.";

        const error = new Error(
            Array.isArray(message)
                ? message.join(", ")
                : message,
        );

        error.status =
            response.status;

        error.data =
            result;

        throw error;
    }

    return result?.data;
};

/*
 * 소셜 로그인 페이지 URL 조회
 */
export const getSocialLoginUrl =
    async (provider) => {
        const response = await fetch(
            `${API_BASE_URL}/auth/${provider}`,
            {
                credentials:
                    "include",
            },
        );

        const data =
            await parseResponse(
                response,
            );

        return data?.url;
    };

/*
 * 소셜 로그인 콜백 처리
 */
export const loginWithSocialCode =
    async ({
        provider,
        code,
        state,
    }) => {
        const response = await fetch(
            `${API_BASE_URL}/auth/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                credentials:
                    "include",

                body: JSON.stringify({
                    provider:
                        provider.toUpperCase(),

                    code,

                    state,
                }),
            },
        );

        return parseResponse(
            response,
        );
    };

/*
 * refresh_token과 device_id는
 * httpOnly 쿠키로 자동 전달된다.
 */
export const refreshAccessToken =
    async () => {
        const response = await fetch(
            `${API_BASE_URL}/auth/refresh`,
            {
                method: "POST",

                credentials:
                    "include",
            },
        );

        return parseResponse(
            response,
        );
    };

/*
 * 현재 로그인한 사용자 정보 조회
 *
 * apiClient의 parseResponse에서
 * response.data만 반환하기 때문에
 * 반환값은 바로 사용자 객체이다.
 */
export const getMyInfo =
    async () => {
        return apiRequest(
            "/users/me",
            {
                method: "GET",
            },
        );
    };

/*
 * 서버의 refresh_token을 제거한다.
 */
export const requestLogout =
    async () => {
        const response = await fetch(
            `${API_BASE_URL}/auth/logout`,
            {
                method: "POST",

                credentials:
                    "include",
            },
        );

        return parseResponse(
            response,
        );
    };