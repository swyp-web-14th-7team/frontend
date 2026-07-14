import { useState } from "react";

import Dropdown from "../common/Dropdown/Dropdown";
import SkillFilterModal from "./SkillFilterModal";

import styles from "./ExploreSearch.module.css";

import dropdownIcon from "../../assets/icons/icon_dropdown.svg";
import searchIcon from "../../assets/icons/icon_search.svg";

const AFFILIATION_OPTIONS = [
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
  selectedTags,
  sort,
  onKeywordChange,
  onAffiliationChange,
  onTagsChange,
  onSortChange,
}) => {
  const [isSkillModalOpen, setIsSkillModalOpen] =
    useState(false);

  const selectedTagLabel = (() => {
    if (selectedTags.length === 0) {
      return "스킬";
    }

    if (selectedTags.length === 1) {
      return selectedTags[0].name;
    }

    return `${selectedTags[0].name} 외 ${
      selectedTags.length - 1
    }`;
  })();

  return (
    <div className={styles.container}>
      <div className={styles.searchBox}>
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
            options={AFFILIATION_OPTIONS}
            onChange={onAffiliationChange}
            className={styles.affiliationDropdown}
          />

          <button
            type="button"
            className={styles.filterButton}
            onClick={() => setIsSkillModalOpen(true)}
          >
            <span className={styles.filterText}>
              {selectedTagLabel}
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
          selectedSkills={selectedTags}
          onClose={() => setIsSkillModalOpen(false)}
          onApply={onTagsChange}
        />
      )}
    </div>
  );
};

export default ExploreSearch;