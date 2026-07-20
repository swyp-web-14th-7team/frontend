import {
    useEffect,
    useState,
} from "react";

import {
    getPublicProfileCards,
} from "../api/profile";

import {
    mapProfileCards,
} from "../utils/profileMapper";

const ITEMS_PER_REQUEST = 100;

const usePublicProfiles = () => {
    const [
        profiles,
        setProfiles,
    ] = useState([]);

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");

    useEffect(() => {
        const controller =
            new AbortController();

        const fetchProfiles =
            async () => {
                try {
                    /*
                     * 첫 번째 페이지 조회
                     */
                    const firstData =
                        await getPublicProfileCards(
                            {
                                page: 1,

                                limit:
                                    ITEMS_PER_REQUEST,

                                sort:
                                    "createdAt",

                                order:
                                    "desc",

                                signal:
                                    controller
                                        .signal,
                            },
                        );

                    const firstItems =
                        firstData?.items ||
                        [];

                    const total =
                        firstData
                            ?.metadata
                            ?.total || 0;

                    const responseLimit =
                        firstData
                            ?.metadata
                            ?.limit ||
                        firstData
                            ?.metadata
                            ?.Limit ||
                        ITEMS_PER_REQUEST;

                    const totalPages =
                        Math.max(
                            1,

                            Math.ceil(
                                total /
                                    responseLimit,
                            ),
                        );

                    /*
                     * 2페이지 이상이면
                     * 나머지 페이지도 조회
                     */
                    const remainingRequests =
                        [];

                    for (
                        let page = 2;
                        page <=
                        totalPages;
                        page += 1
                    ) {
                        remainingRequests.push(
                            getPublicProfileCards(
                                {
                                    page,

                                    limit:
                                        responseLimit,

                                    sort:
                                        "createdAt",

                                    order:
                                        "desc",

                                    signal:
                                        controller
                                            .signal,
                                },
                            ),
                        );
                    }

                    const remainingData =
                        await Promise.all(
                            remainingRequests,
                        );

                    if (
                        controller.signal
                            .aborted
                    ) {
                        return;
                    }

                    const remainingItems =
                        remainingData.flatMap(
                            (data) =>
                                data?.items ||
                                [],
                        );

                    setProfiles(
                        mapProfileCards([
                            ...firstItems,
                            ...remainingItems,
                        ]),
                    );

                    setErrorMessage("");
                } catch (error) {
                    if (
                        error.name ===
                        "AbortError"
                    ) {
                        return;
                    }

                    console.error(
                        "캐러셀 프로필 조회 실패:",
                        error,
                    );

                    setProfiles([]);

                    setErrorMessage(
                        error.message ||
                            "프로필을 불러오지 못했습니다.",
                    );
                } finally {
                    if (
                        !controller.signal
                            .aborted
                    ) {
                        setIsLoading(
                            false,
                        );
                    }
                }
            };

        fetchProfiles();

        return () => {
            controller.abort();
        };
    }, []);

    return {
        profiles,
        isLoading,
        errorMessage,
    };
};

export default usePublicProfiles;