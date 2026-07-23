    import { apiRequest } from "./apiClient";

    export const getCurrentUser = async ({ signal } = {}) => {
    return apiRequest("/users/me", {
        signal,
    });
    };

    export const updateCurrentUser = async (user) => {
    const nickname =
        typeof user === "string"
        ? user
        : user?.nickname;

    const trimmedNickname = nickname?.trim();

    if (!trimmedNickname) {
        throw new Error("닉네임을 입력해주세요.");
    }

    return apiRequest("/users/me", {
        method: "PATCH",
        body: JSON.stringify({
        nickname: trimmedNickname,
        }),
    });
    };

    export const deleteCurrentUser = async () => {
    return apiRequest("/users/me", {
        method: "DELETE",
    });
    };

    /*
    * 기존 Settings.jsx에서 사용하는 이름
    */
    export const getMyUser = getCurrentUser;
    export const updateMyUser = updateCurrentUser;