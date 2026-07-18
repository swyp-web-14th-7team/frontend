import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import ExploreProfileCard from "../profile/ExploreProfileCard";
import MobileProfileCard from "./MobileProfileCard";

import profiles from "../../mocks/profiles";

import styles from "./ExploreCardList.module.css";

const ITEMS_PER_PAGE = 16;

const JOB_SEARCH_KEYWORDS = {
    planner: [
        "planner",
        "planning",
        "기획",
        "기획자",
        "서비스기획",
        "서비스 기획",
        "pm",
        "product manager",
        "프로덕트 매니저",
    ],

    designer: [
        "designer",
        "design",
        "디자인",
        "디자이너",
        "ui",
        "ux",
        "uiux",
        "ui/ux",
    ],

    frontend: [
        "frontend",
        "front-end",
        "front",
        "프론트",
        "프론트엔드",
        "프론트 엔드",
        "프론트개발자",
        "프론트 개발자",
        "프엔",
    ],

    backend: [
        "backend",
        "back-end",
        "back",
        "백엔드",
        "백 엔드",
        "백엔드개발자",
        "백엔드 개발자",
    ],
};


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
            aria-disabled={isRestricted}
        >
            {children}

            {/*
             * 로그인 전에는
             * 목적별 탭 또는 검색 결과 카드 위에
             * 클릭 차단 레이어를 표시한다.
             */}

            {isRestricted && (
                <div
                    title="로그인 후 이용할 수 있습니다."
                    aria-label="로그인 후 이용할 수 있는 프로필입니다."
                    style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 20,

                        borderRadius: "12px",

                        backgroundColor:
                            "rgba(13, 15, 23, 0.05)",

                        cursor: "not-allowed",
                    }}
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                    }}
                    onMouseDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                    }}
                />
            )}
        </div>
    );
};

const ExploreCardList = ({
    currentPage = 1,
    activeTab = "전체보기",
    keyword = "",
    affiliation = "",
    selectedTags = [],
    sort = "최근 등록순",
    isUserLoggedIn = false,
}) => {
    const navigate = useNavigate();

    /*
     * 공백을 제외한 실제 검색어가
     * 입력되어 있는지 확인한다.
     */
    const hasSearchKeyword =
        String(keyword).trim().length > 0;

    /*
     * 비로그인 상태에서는
     * - 전체보기 이외의 탭이거나
     * - 검색 결과를 보고 있는 경우
     * 카드 클릭을 제한한다.
     */
    const isCardRestricted =
        !isUserLoggedIn &&
        (
            activeTab !== "전체보기" ||
            hasSearchKeyword
        );


    const handleCardClick = (id) => {
        /*
         * 클릭 제한 상태라면
         * 어떤 페이지로도 이동하지 않는다.
         */
        if (isCardRestricted) {
            return;
        }

        /*
         * 로그인한 사용자가 검색 결과에서
         * 카드를 누르면 상세 프로필로 이동한다.
         */
        if (hasSearchKeyword) {
            navigate(`/profile/${id}`);
            return;
        }

        /*
         * 검색하지 않은 전체보기에서는
         * 프로필 캐러셀 화면으로 이동한다.
         */
        if (activeTab === "전체보기") {
            navigate(
                `/profile-carousel/${id}`,
            );
            return;
        }

        /*
         * 로그인한 사용자가 목적별 탭에서
         * 카드를 누르면 해당 목적을 전달한다.
         */
        navigate(
            `/profile-carousel/${id}?purpose=${encodeURIComponent(
                activeTab,
            )}`,
        );
    };

    const filteredProfiles = useMemo(() => {
        const normalizedKeyword =
            String(keyword)
                .trim()
                .toLowerCase();

        const selectedTagNames =
            selectedTags.map((tag) =>
                String(tag.name || "")
                    .trim()
                    .toLowerCase(),
            );

        const result = profiles.filter(
            (profile) => {
                const profileTags = [
                    ...(profile.techStacks || []),
                    ...(profile.interests || []),
                    ...(profile.tools || []),
                ];

                const profileTagNames =
                    profileTags.map((tag) =>
                        String(tag.name || "")
                            .trim()
                            .toLowerCase(),
                    );

                const jobKeywords =
                    JOB_SEARCH_KEYWORDS[
                        profile.job
                    ] || [];

                const matchesJob =
                    jobKeywords.some(
                        (jobKeyword) =>
                            jobKeyword
                                .toLowerCase()
                                .includes(
                                    normalizedKeyword,
                                ),
                    );

                const matchesKeyword =
                    !normalizedKeyword ||
                    profile.name
                        ?.toLowerCase()
                        .includes(
                            normalizedKeyword,
                        ) ||
                    profile.affiliation
                        ?.toLowerCase()
                        .includes(
                            normalizedKeyword,
                        ) ||
                    profile.affiliationType
                        ?.toLowerCase()
                        .includes(
                            normalizedKeyword,
                        ) ||
                    matchesJob ||
                    profileTagNames.some(
                        (tagName) =>
                            tagName.includes(
                                normalizedKeyword,
                            ),
                    );

                const matchesAffiliation =
                    !affiliation ||
                    profile.affiliationType ===
                        affiliation;

                const matchesTags =
                    selectedTagNames.length === 0 ||
                    selectedTagNames.some(
                        (tagName) =>
                            profileTagNames.includes(
                                tagName,
                            ),
                    );

                const matchesTab =
                    activeTab === "전체보기" ||
                    (
                        profile.purposes || []
                    ).includes(activeTab);

                return (
                    matchesKeyword &&
                    matchesAffiliation &&
                    matchesTags &&
                    matchesTab
                );
            },
        );

        const sortedProfiles = [...result];

        switch (sort) {
            case "최근 등록순":
                sortedProfiles.sort(
                    (a, b) =>
                        new Date(
                            b.createdAt,
                        ).getTime() -
                        new Date(
                            a.createdAt,
                        ).getTime(),
                );
                break;

            case "오래된 등록순":
                sortedProfiles.sort(
                    (a, b) =>
                        new Date(
                            a.createdAt,
                        ).getTime() -
                        new Date(
                            b.createdAt,
                        ).getTime(),
                );
                break;

            case "가나다순":
                sortedProfiles.sort(
                    (a, b) =>
                        a.name.localeCompare(
                            b.name,
                            "ko",
                        ),
                );
                break;

            default:
                break;
        }

        return sortedProfiles;
    }, [
        activeTab,
        keyword,
        affiliation,
        selectedTags,
        sort,
    ]);


    const startIndex =
        (currentPage - 1) *
        ITEMS_PER_PAGE;

    const visibleProfiles =
        filteredProfiles.slice(
            startIndex,
            startIndex + ITEMS_PER_PAGE,
        );

    if (visibleProfiles.length === 0) {
        return (
            <p className={styles.emptyMessage}>
                조건에 맞는 프로필이
                없습니다.
            </p>
        );
    }

    return (
        <>
            {/* 데스크톱 카드 목록 */}

            <section
                className={
                    styles.desktopGrid
                }
            >
                {visibleProfiles.map(
                    (profile) => (
                        <RestrictedCardWrapper
                            key={profile.id}
                            isRestricted={
                                isCardRestricted
                            }
                        >
                            <ExploreProfileCard
                                profile={profile}
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

            {/* 모바일 카드 목록 */}

            <section
                className={
                    styles.mobileList
                }
            >
                {visibleProfiles.map(
                    (profile) => (
                        <RestrictedCardWrapper
                            key={profile.id}
                            isRestricted={
                                isCardRestricted
                            }
                        >
                            <MobileProfileCard
                                profile={profile}
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