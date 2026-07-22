import {
    apiRequest,
} from "./apiClient";

export const getCardBackgroundImages =
    async ({
        page = 1,
        limit = 10,
        sort = "createdAt",
        order = "desc",
        signal,
    } = {}) => {
        const params =
            new URLSearchParams({
                page: String(page),
                limit: String(limit),
                sort,
                order,
            });

        return apiRequest(
            `/card-background-images?${params.toString()}`,
            {
                signal,
            },
        );
    };

export const makeCardBackgroundUrl = (
    baseUrl,
) => {
    if (!baseUrl) {
        return "";
    }

    if (
        baseUrl.endsWith(
            "/282x400.webp",
        )
    ) {
        return baseUrl;
    }

    return `${baseUrl.replace(
        /\/$/,
        "",
    )}/282x400.webp`;
};