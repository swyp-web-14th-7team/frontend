export const getAccessToken = () => {
    return localStorage.getItem(
        "accessToken",
    );
};

export const isLoggedIn = () => {
    return Boolean(
        getAccessToken(),
    );
};

export const saveAccessToken = (
    accessToken,
) => {
    if (!accessToken) {
        return;
    }

    localStorage.setItem(
        "accessToken",
        accessToken,
    );

    window.dispatchEvent(
        new CustomEvent(
            "auth:changed",
        ),
    );
};

export const saveUserName = (
    userName,
) => {
    localStorage.setItem(
        "userName",
        userName,
    );
};

export const getUserName = () => {
    return localStorage.getItem(
        "userName",
    );
};

export const removeAccessToken =
    () => {
        localStorage.removeItem(
            "accessToken",
        );

        window.dispatchEvent(
            new CustomEvent(
                "auth:changed",
            ),
        );
    };

export const removeUserName = () => {
    localStorage.removeItem(
        "userName",
    );
};

export const logout = () => {
    removeAccessToken();
    removeUserName();
};