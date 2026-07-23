import {
    apiRequest,
} from "./apiClient";

export const uploadProfileImage =
    async (
        imageFile,
        { signal } = {},
    ) => {
        const formData =
            new FormData();

        formData.append(
            "file",
            imageFile,
        );

        return apiRequest(
            "/files/profile-image/upload",
            {
                method: "POST",
                body: formData,
                signal,
            },
        );
    };