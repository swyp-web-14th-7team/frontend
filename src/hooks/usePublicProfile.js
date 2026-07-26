import {
    useEffect,
    useState,
} from "react";

import {
    getPublicProfileCard,
} from "../api/profile";

import {
    getConnection,
} from "../api/connections";

import {
    mapProfileCard,
} from "../utils/profileMapper";

const usePublicProfile = (
    profileId,
    connectionId = null,
) => {
    const [
        profile,
        setProfile,
    ] = useState(null);

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");

    useEffect(() => {
        if (
            !profileId &&
            !connectionId
        ) {
            setProfile(null);
            setIsLoading(false);
            return undefined;
        }

        const controller =
            new AbortController();

        const fetchProfile =
            async () => {
                setIsLoading(true);
                setErrorMessage("");

                try {
                    let profileData;

                    if (connectionId) {
                        const connectionData =
                            await getConnection(
                                connectionId,
                                {
                                    signal:
                                        controller
                                            .signal,
                                },
                            );

                        /*
                         * 보관함에서는 현재 프로필이 아닌
                         * 교환 당시 저장된 카드를 사용합니다.
                         */
                        profileData =
                            connectionData?.card;
                    } else {
                        profileData =
                            await getPublicProfileCard(
                                profileId,
                                {
                                    signal:
                                        controller
                                            .signal,
                                },
                            );
                    }

                    if (
                        controller.signal
                            .aborted
                    ) {
                        return;
                    }

                    if (!profileData) {
                        throw new Error(
                            connectionId
                                ? "보관된 카드를 찾을 수 없습니다."
                                : "프로필을 찾을 수 없습니다.",
                        );
                    }

                    setProfile(
                        mapProfileCard(
                            profileData,
                        ),
                    );
                } catch (error) {
                    if (
                        error.name ===
                        "AbortError"
                    ) {
                        return;
                    }

                    console.error(
                        "프로필 상세 조회 실패:",
                        error,
                    );

                    setProfile(null);

                    setErrorMessage(
                        error.message ||
                            "프로필을 불러오지 못했습니다.",
                    );
                } finally {
                    if (
                        !controller.signal
                            .aborted
                    ) {
                        setIsLoading(false);
                    }
                }
            };

        fetchProfile();

        return () => {
            controller.abort();
        };
    }, [
        profileId,
        connectionId,
    ]);

    return {
        profile,
        isLoading,
        errorMessage,
    };
};

export default usePublicProfile;