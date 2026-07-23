import {
    useEffect,
    useState,
} from "react";

import {
    getPublicProfileCard,
} from "../api/profile";

import {
    mapProfileCard,
} from "../utils/profileMapper";

const usePublicProfile = (
    profileId,
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
        if (!profileId) {
            return undefined;
        }

        const controller =
            new AbortController();

        const fetchProfile =
            async () => {
                try {
                    const data =
                        await getPublicProfileCard(
                            profileId,
                            {
                                signal:
                                    controller
                                        .signal,
                            },
                        );

                    if (
                        controller.signal
                            .aborted
                    ) {
                        return;
                    }

                    setProfile(
                        mapProfileCard(
                            data,
                        ),
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
                        setIsLoading(
                            false,
                        );
                    }
                }
            };

        fetchProfile();

        return () => {
            controller.abort();
        };
    }, [profileId]);

    return {
        profile,
        isLoading,
        errorMessage,
    };
};

export default usePublicProfile;