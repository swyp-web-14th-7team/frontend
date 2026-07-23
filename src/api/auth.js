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

        throw new Error(
            Array.isArray(message)
                ? message.join(", ")
                : message,
        );
    }

    return result?.data;
};

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