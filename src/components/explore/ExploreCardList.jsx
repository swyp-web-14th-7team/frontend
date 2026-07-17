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

    const ExploreCardList = ({
    currentPage = 1,
    activeTab = "전체보기",
    keyword = "",
    affiliation = "",
    selectedTags = [],
    sort = "최근 등록순",
    }) => {
    const navigate = useNavigate();

    const handleCardClick = (id) => {
        /*
        * 현재 보고 있는 목적 탭 정보를 URL에 같이 전달한다.
        *
        * 예:
        * /profile-carousel/1?purpose=커피챗
        * /profile-carousel/5?purpose=팀 찾기
        *
        * 전체보기에서 클릭한 경우에는 목적 필터 없이 이동한다.
        */
        if (activeTab === "전체보기") {
        navigate(`/profile-carousel/${id}`);
        return;
        }

        navigate(
        `/profile-carousel/${id}?purpose=${encodeURIComponent(activeTab)}`,
        );
    };

    const filteredProfiles = useMemo(() => {
        const normalizedKeyword = keyword
        .trim()
        .toLowerCase();

        const selectedTagNames = selectedTags.map((tag) =>
        tag.name.trim().toLowerCase(),
        );

        const result = profiles.filter((profile) => {
        const profileTags = [
            ...(profile.techStacks || []),
            ...(profile.interests || []),
            ...(profile.tools || []),
        ];

        const profileTagNames = profileTags.map((tag) =>
            tag.name.trim().toLowerCase(),
        );

        const jobKeywords =
            JOB_SEARCH_KEYWORDS[profile.job] || [];

        const matchesJob = jobKeywords.some(
            (jobKeyword) =>
            jobKeyword
                .toLowerCase()
                .includes(normalizedKeyword),
        );

        const matchesKeyword =
            !normalizedKeyword ||
            profile.name
            ?.toLowerCase()
            .includes(normalizedKeyword) ||
            profile.affiliation
            ?.toLowerCase()
            .includes(normalizedKeyword) ||
            profile.affiliationType
            ?.toLowerCase()
            .includes(normalizedKeyword) ||
            matchesJob ||
            profileTagNames.some((tagName) =>
            tagName.includes(normalizedKeyword),
            );

        const matchesAffiliation =
            !affiliation ||
            profile.affiliationType === affiliation;

        const matchesTags =
            selectedTagNames.length === 0 ||
            selectedTagNames.some((tagName) =>
            profileTagNames.includes(tagName),
            );

        const matchesTab =
            activeTab === "전체보기" ||
            (profile.purposes || []).includes(activeTab);

        return (
            matchesKeyword &&
            matchesAffiliation &&
            matchesTags &&
            matchesTab
        );
        });

        const sortedProfiles = [...result];

        switch (sort) {
        case "최근 등록순":
            sortedProfiles.sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            );
            break;

        case "오래된 등록순":
            sortedProfiles.sort(
            (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime(),
            );
            break;

        case "가나다순":
            sortedProfiles.sort((a, b) =>
            a.name.localeCompare(b.name, "ko"),
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
        (currentPage - 1) * ITEMS_PER_PAGE;

    const visibleProfiles = filteredProfiles.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE,
    );

    if (visibleProfiles.length === 0) {
        return (
        <p className={styles.emptyMessage}>
            조건에 맞는 프로필이 없습니다.
        </p>
        );
    }

    return (
        <>
        <section className={styles.desktopGrid}>
            {visibleProfiles.map((profile) => (
            <ExploreProfileCard
                key={profile.id}
                profile={profile}
                onClick={handleCardClick}
            />
            ))}
        </section>

        <section className={styles.mobileList}>
            {visibleProfiles.map((profile) => (
            <MobileProfileCard
                key={profile.id}
                profile={profile}
                onClick={handleCardClick}
            />
            ))}
        </section>
        </>
    );
    };

    export default ExploreCardList;