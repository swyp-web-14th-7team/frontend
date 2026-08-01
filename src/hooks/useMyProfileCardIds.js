import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    getMyProfileCards,
} from "../api/profile";

import {
    isLoggedIn,
} from "../utils/auth";

const getProfileCardItems = (result) => {
    if (Array.isArray(result)) {
        return result;
    }

    return (
        result?.items ||
        result?.data?.items ||
        []
    );
};

const useMyProfileCardIds = () => {
    const [profileCardIds, setProfileCardIds] =
        useState([]);

    const [isLoading, setIsLoading] =
        useState(() => isLoggedIn());

    useEffect(() => {
        if (!isLoggedIn()) {
            return undefined;
        }

        const controller = new AbortController();

        const loadMyProfileCardIds = async () => {
            try {
                setIsLoading(true);

                const result = await getMyProfileCards({
                    page: 1,
                    limit: 100,
                    signal: controller.signal,
                });

                if (controller.signal.aborted) {
                    return;
                }

                const ids = getProfileCardItems(result)
                    .map(
                        (card) =>
                            card?.id ??
                            card?.profileCardId ??
                            card?.card?.id,
                    )
                    .filter(
                        (id) =>
                            id !== null &&
                            id !== undefined,
                    )
                    .map(String);

                setProfileCardIds([
                    ...new Set(ids),
                ]);
            } catch (error) {
                if (error?.name === "AbortError") {
                    return;
                }

                console.error(
                    "내 카드 목록 조회 실패:",
                    error,
                );

                setProfileCardIds([]);
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        loadMyProfileCardIds();

        return () => {
            controller.abort();
        };
    }, []);

    const myProfileCardIds = useMemo(
        () => new Set(profileCardIds),
        [profileCardIds],
    );

    return {
        myProfileCardIds,
        isLoading,
    };
};

export default useMyProfileCardIds;