const BASE_URL = "https://nodi-be.choihw.me";

export const getSocialLoginUrl = async (provider) => {
    const response = await fetch(`${BASE_URL}/auth/${provider}`);

    if (!response.ok) {
        throw new Error("로그인 URL 요청 실패");
    }

    const result = await response.json();
    return result.data.url;
};