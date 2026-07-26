import { useState } from "react";

import Dropdown from "../common/Dropdown/Dropdown";
import SkillFilterModal from "./SkillFilterModal";

import styles from "./ExploreSearch.module.css";

import dropdownIcon from "../../assets/icons/icon_dropdown.svg";
import searchIcon from "../../assets/icons/icon_search.svg";

const DEFAULT_AFFILIATION_OPTIONS = [
    "모두",
    "직장인",
    "재학생",
    "휴학생",
    "취준생",
    "프리랜서",
];

const SORT_OPTIONS = [
    "최근 등록순",
    "오래된 등록순",
    "가나다순",
];

const JOB_DISPLAY_NAMES = {
    PM: "기획자",
    Planner: "기획자",
    기획자: "기획자",

    Designer: "디자이너",
    디자이너: "디자이너",

    Frontend: "프론트엔드",
    "Frontend Developer": "프론트엔드",
    "프론트 개발자": "프론트엔드",
    "프론트엔드 개발자": "프론트엔드",

    Backend: "백엔드",
    "Backend Developer": "백엔드",
    "백엔드 개발자": "백엔드",
};

const getJobDisplayName = (jobType) => {
    const name =
        jobType?.name ||
        jobType?.label ||
        "";

    return JOB_DISPLAY_NAMES[name] || name;
};

const getSkillName = (skill) => {
    if (typeof skill === "string") {
        return skill;
    }

    return (
        skill?.name ||
        skill?.label ||
        ""
    );
};

const ExploreSearch = ({
    keyword,
    affiliation,
    affiliationOptions = DEFAULT_AFFILIATION_OPTIONS,
    selectedJobType,
    selectedTags = [],
    sort,
    isMobileSearchOpen = false,
    onKeywordChange,
    onAffiliationChange,
    onJobTypeChange,
    onTagsChange,
    onSortChange,
}) => {
    const [
        isSkillModalOpen,
        setIsSkillModalOpen,
    ] = useState(false);

    const hasSelectedSkills =
        selectedTags.length > 0;

    /*
     * 1개: Swift
     * 여러 개: Swift 외 3
     */
    const skillFilterLabel = hasSelectedSkills
        ? `${getSkillName(selectedTags[0])}${
              selectedTags.length > 1
                  ? ` 외 ${selectedTags.length - 1}`
                  : ""
          }`
        : "직군·스킬";

    /*
     * 직접 입력한 검색어가 있으면 검색어 표시
     * 검색어가 없고 직군을 선택했다면 직군 표시
     */
    const displayedKeyword =
        keyword ||
        getJobDisplayName(
            selectedJobType,
        );

    const handleFilterApply = ({
        jobType,
        skills,
    }) => {
        onJobTypeChange(jobType);
        onTagsChange(skills);
    };

    return (
        <div className={styles.container}>
            <div
                className={`${styles.searchBox} ${
                    isMobileSearchOpen
                        ? styles.mobileSearchOpen
                        : ""
                }`}
            >
                <img
                    src={searchIcon}
                    alt=""
                    className={styles.searchIcon}
                />

                <input
                    type="search"
                    value={displayedKeyword}
                    onChange={(event) =>
                        onKeywordChange(
                            event.target.value,
                        )
                    }
                    placeholder="이름, 직군, 관심분야를 검색해보세요."
                    className={styles.searchInput}
                    aria-label="프로필 검색"
                />

                <div className={styles.filterArea}>
                    <Dropdown
                        value={affiliation}
                        placeholder="현 소속"
                        options={affiliationOptions}
                        onChange={onAffiliationChange}
                        className={`${
                            styles.affiliationDropdown
                        } ${
                            affiliation &&
                            affiliation !== "모두"
                                ? styles.selectedAffiliationDropdown
                                : ""
                        }`}
                    />

                    <button
                        type="button"
                        className={`${styles.filterButton} ${
                            hasSelectedSkills
                                ? styles.activeFilterButton
                                : ""
                        }`}
                        onClick={() =>
                            setIsSkillModalOpen(true)
                        }
                        aria-label={`직군·스킬 필터: ${skillFilterLabel}`}
                    >
                        <span className={styles.filterText}>
                            {skillFilterLabel}
                        </span>

                        {!hasSelectedSkills && (
                            <img
                                src={dropdownIcon}
                                alt=""
                                className={styles.arrow}
                            />
                        )}
                    </button>
                </div>
            </div>

            <div className={styles.sortArea}>
                <Dropdown
                    value={sort}
                    options={SORT_OPTIONS}
                    onChange={onSortChange}
                    className={styles.sortDropdown}
                />
            </div>

            {isSkillModalOpen && (
                <SkillFilterModal
                    selectedJobType={selectedJobType}
                    selectedSkills={selectedTags}
                    onClose={() =>
                        setIsSkillModalOpen(false)
                    }
                    onApply={handleFilterApply}
                />
            )}
        </div>
    );
};

export default ExploreSearch;