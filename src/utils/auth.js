    export const getAccessToken = () => {
    return localStorage.getItem("accessToken");
    };

    export const isLoggedIn = () => {
    return Boolean(getAccessToken());
    };

    export const saveAccessToken = (accessToken) => {
    if (!accessToken) {
        return;
    }

    localStorage.setItem("accessToken", accessToken);
    };

    export const removeAccessToken = () => {
    localStorage.removeItem("accessToken");
    };

    export const logout = () => {
    removeAccessToken();
    };