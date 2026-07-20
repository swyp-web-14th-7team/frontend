import {
    apiRequest,
} from "./apiClient";

const createListParams = ({
    page = 1,
    limit = 100,
    sort = "name",
    order = "asc",
    search = "",
} = {}) => {
    const params =
        new URLSearchParams({
            page: String(page),
            limit: String(limit),
            sort,
            order,
        });

    if (search.trim()) {
        params.append(
            "search",
            search.trim(),
        );
    }

    return params;
};

export const getSkillCategories =
    async () => {
        return apiRequest(
            "/skill-categories",
        );
    };

export const getSkills = async ({
    page = 1,
    limit = 100,
    sort = "name",
    order = "asc",
    categoryId,
    jobTypeId,
    search = "",
    signal,
} = {}) => {
    const params =
        createListParams({
            page,
            limit,
            sort,
            order,
            search,
        });

    if (categoryId) {
        params.append(
            "categoryId",
            String(categoryId),
        );
    }

    if (jobTypeId) {
        params.append(
            "jobTypeId",
            String(jobTypeId),
        );
    }

    return apiRequest(
        `/skills?${params.toString()}`,
        {
            signal,
        },
    );
};

export const getInterests = async ({
    page = 1,
    limit = 100,
    sort = "name",
    order = "asc",
    search = "",
    signal,
} = {}) => {
    const params =
        createListParams({
            page,
            limit,
            sort,
            order,
            search,
        });

    return apiRequest(
        `/interests?${params.toString()}`,
        {
            signal,
        },
    );
};

export const getJobTypes = async ({
    page = 1,
    limit = 100,
    sort = "name",
    order = "asc",
    search = "",
    signal,
} = {}) => {
    const params =
        createListParams({
            page,
            limit,
            sort,
            order,
            search,
        });

    return apiRequest(
        `/job-types?${params.toString()}`,
        {
            signal,
        },
    );
};

export const getAffiliationStatuses =
    async ({
        page = 1,
        limit = 100,
        sort = "name",
        order = "asc",
        search = "",
        signal,
    } = {}) => {
        const params =
            createListParams({
                page,
                limit,
                sort,
                order,
                search,
            });

        return apiRequest(
            `/affiliation-statuses?${params.toString()}`,
            {
                signal,
            },
        );
    };

export const getPurposes = async ({
    page = 1,
    limit = 100,
    sort = "name",
    order = "asc",
    search = "",
    signal,
} = {}) => {
    const params =
        createListParams({
            page,
            limit,
            sort,
            order,
            search,
        });

    return apiRequest(
        `/purposes?${params.toString()}`,
        {
            signal,
        },
    );
};

export const getPersonalities =
    async ({
        page = 1,
        limit = 100,
        sort = "name",
        order = "asc",
        search = "",
        jobTypeId,
        signal,
    } = {}) => {
        const params =
            createListParams({
                page,
                limit,
                sort,
                order,
                search,
            });

        if (jobTypeId) {
            params.append(
                "jobTypeId",
                String(jobTypeId),
            );
        }

        return apiRequest(
            `/personalities?${params.toString()}`,
            {
                signal,
            },
        );
    };