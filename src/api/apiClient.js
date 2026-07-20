import {
    refreshAccessToken,
} from "./auth";

import {
    getAccessToken,
    removeAccessToken,
    saveAccessToken,
} from "../utils/auth";

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
            "API 요청에 실패했습니다.";

        throw new Error(
            Array.isArray(message)
                ? message.join(", ")
                : message,
        );
    }

    return result?.data;
};

export const apiRequest = async (
    endpoint,
    options = {},
) => {
    const accessToken =
        getAccessToken();

    const isFormData =
        options.body instanceof
        FormData;

    /*
     * access token을 받아서
     * 실제 요청을 보내는 함수
     */
    const sendRequest = (
        token,
    ) => {
        return fetch(
            `${API_BASE_URL}${endpoint}`,
            {
                ...options,

                credentials:
                    "include",

                headers: {
                    ...(
                        options.body &&
                        !isFormData
                            ? {
                                  "Content-Type":
                                      "application/json",
                              }
                            : {}
                    ),

                    ...(token
                        ? {
                              Authorization:
                                  `Bearer ${token}`,
                          }
                        : {}),

                    ...options.headers,
                },
            },
        );
    };

    let response =
        await sendRequest(
            accessToken,
        );

    /*
     * 로그인된 상태에서 401이 발생하면
     * access token 재발급 후 한 번 재요청한다.
     */
    if (
        response.status === 401 &&
        accessToken
    ) {
        try {
            const refreshData =
                await refreshAccessToken();

            const newAccessToken =
                refreshData?.accessToken;

            if (!newAccessToken) {
                throw new Error(
                    "새 access token을 받지 못했습니다.",
                );
            }

            saveAccessToken(
                newAccessToken,
            );

            response =
                await sendRequest(
                    newAccessToken,
                );
        } catch (error) {
            console.error(
                "토큰 재발급 실패:",
                error,
            );

            removeAccessToken();

            window.dispatchEvent(
                new CustomEvent(
                    "auth:expired",
                ),
            );

            return Promise.reject(
                new Error(
                    "로그인이 만료되었습니다. 다시 로그인해주세요.",
                ),
            );
        }
    }

    return parseResponse(
        response,
    );
};