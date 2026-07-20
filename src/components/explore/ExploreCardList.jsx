import {
    useNavigate,
} from "react-router-dom";

import ExploreProfileCard from "../profile/ExploreProfileCard";
import MobileProfileCard from "./MobileProfileCard";

import styles from "./ExploreCardList.module.css";

const RestrictedCardWrapper = ({
    isRestricted,
    children,
}) => {
    return (
        <div
            style={{
                position: "relative",
                width: "100%",
            }}
            aria-disabled={
                isRestricted
            }
        >
            {children}

            {isRestricted && (
                <div
                    title="로그인 후 이용할 수 있습니다."
                    aria-label="로그인 후 이용할 수 있는 프로필입니다."
                    style={{
                        position:
                            "absolute",

                        inset: 0,
                        zIndex: 20,

                        borderRadius:
                            "12px",

                        backgroundColor:
                            "rgba(13, 15, 23, 0.05)",

                        cursor:
                            "not-allowed",
                    }}
                    onClick={(
                        event,
                    ) => {
                        event.preventDefault();
                        event.stopPropagation();
                    }}
                    onMouseDown={(
                        event,
                    ) => {
                        event.preventDefault();
                        event.stopPropagation();
                    }}
                />
            )}
        </div>
    );
};

const ExploreCardList = ({
    profiles = [],
    activeTab = "전체보기",
    keyword = "",
    isUserLoggedIn = false,
    isLoading = false,
    errorMessage = "",
}) => {
    const navigate =
        useNavigate();

    const hasSearchKeyword =
        String(keyword)
            .trim()
            .length > 0;

    const isCardRestricted =
        !isUserLoggedIn &&
        (
            activeTab !==
                "전체보기" ||
            hasSearchKeyword
        );

    const handleCardClick = (
        id,
    ) => {
        if (isCardRestricted) {
            return;
        }

        if (hasSearchKeyword) {
            navigate(
                `/profile/${id}`,
            );

            return;
        }

        if (
            activeTab ===
            "전체보기"
        ) {
            navigate(
                `/profile-carousel/${id}`,
            );

            return;
        }

        navigate(
            `/profile-carousel/${id}?purpose=${encodeURIComponent(
                activeTab,
            )}`,
        );
    };

    if (isLoading) {
        return (
            <p
                className={
                    styles.emptyMessage
                }
            >
                프로필을 불러오는
                중입니다.
            </p>
        );
    }

    if (errorMessage) {
        return (
            <p
                className={
                    styles.emptyMessage
                }
            >
                {errorMessage}
            </p>
        );
    }

    if (
        profiles.length === 0
    ) {
        return (
            <p
                className={
                    styles.emptyMessage
                }
            >
                조건에 맞는 프로필이
                없습니다.
            </p>
        );
    }

    return (
        <>
            <section
                className={
                    styles.desktopGrid
                }
            >
                {profiles.map(
                    (profile) => (
                        <RestrictedCardWrapper
                            key={
                                profile.id
                            }
                            isRestricted={
                                isCardRestricted
                            }
                        >
                            <ExploreProfileCard
                                profile={
                                    profile
                                }
                                onClick={
                                    isCardRestricted
                                        ? undefined
                                        : handleCardClick
                                }
                            />
                        </RestrictedCardWrapper>
                    ),
                )}
            </section>

            <section
                className={
                    styles.mobileList
                }
            >
                {profiles.map(
                    (profile) => (
                        <RestrictedCardWrapper
                            key={
                                profile.id
                            }
                            isRestricted={
                                isCardRestricted
                            }
                        >
                            <MobileProfileCard
                                profile={
                                    profile
                                }
                                onClick={
                                    isCardRestricted
                                        ? undefined
                                        : handleCardClick
                                }
                            />
                        </RestrictedCardWrapper>
                    ),
                )}
            </section>
        </>
    );
};

export default ExploreCardList;