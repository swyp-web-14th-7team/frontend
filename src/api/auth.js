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

export const getMyInfo =
    async () => {
        return apiRequest(
            "/users/me",
            {
                method: "GET",
            },
        );
    };

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