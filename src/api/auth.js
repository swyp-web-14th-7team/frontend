const BASE_URL = "https://nodi-be.choihw.me";

export const getSocialLoginUrl = async (provider) => {
    const response = await fetch(`${BASE_URL}/auth/${provider}`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("로그인 URL 요청 실패");
    }

    const result = await response.json();
    return result.data.url;
};

export const loginWithSocialCode = async ({ provider, code, state }) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type":"application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            provider: provider.toUpperCase(),
            code,
            state,
        }),
    });

    if (!response.ok) {
        throw new Error("소셜 로그인 실패");
    }

    const result = await response.json();
    return result.data;
};

