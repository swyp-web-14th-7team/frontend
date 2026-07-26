import { useState } from "react";

import Dropdown from "../common/Dropdown/Dropdown";
import SkillFilterModal from "./SkillFilterModal";

import dropdownIcon from "../../assets/icons/icon_dropdown.svg";
import searchIcon from "../../assets/icons/icon_search.svg";

import styles from "./ExploreSearch.module.css";

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
    const [isSkillModalOpen, setIsSkillModalOpen] =
        useState(false);

    const skillFilterLabel =
        selectedTags.length > 0
            ? `${selectedTags[0]?.name || "스킬"}${
                  selectedTags.length > 1
                      ? ` 외 ${selectedTags.length - 1}`
                      : ""
              }`
            : "스킬";

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
                    value={keyword}
                    onChange={(event) =>
                        onKeywordChange(event.target.value)
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
                            selectedTags.length > 0
                                ? styles.activeFilterButton
                                : ""
                        }`}
                        onClick={() =>
                            setIsSkillModalOpen(true)
                        }
                        aria-label="스킬 필터 열기"
                    >
                        <span className={styles.filterText}>
                            {skillFilterLabel}
                        </span>

                        <span
                            className={
                                styles.mobileFilterText
                            }
                        >
                            {skillFilterLabel}
                        </span>

                        <img
                            src={dropdownIcon}
                            alt=""
                            className={styles.arrow}
                        />
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