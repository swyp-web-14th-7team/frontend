import {
  useState,
} from "react";

import Dropdown from "../common/Dropdown/Dropdown";
import SkillFilterModal from "./SkillFilterModal";

import styles from "./ExploreSearch.module.css";

import dropdownIcon from "../../assets/icons/icon_dropdown.svg";
import searchIcon from "../../assets/icons/icon_search.svg";

const AFFILIATION_OPTIONS = [
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
  selectedJobType,
  selectedTags,
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

  /*
   * 직군 1개와 선택 스킬 개수를 합산한다.
   */
  const selectedFilterCount =
    (selectedJobType ? 1 : 0) +
    selectedTags.length;

  /*
   * 모달에서 적용 버튼을 눌렀을 때만
   * 실제 탐색 필터를 변경한다.
   */
  const handleFilterApply = ({
    jobType,
    skills,
  }) => {
    onJobTypeChange(jobType);
    onTagsChange(skills);
  };

  return (
    <div
      className={styles.container}
    >
      <div
        className={`${
          styles.searchBox
        } ${
          isMobileSearchOpen
            ? styles.mobileSearchOpen
            : ""
        }`}
      >
        <img
          src={searchIcon}
          alt=""
          className={
            styles.searchIcon
          }
        />

        <input
          type="search"
          value={keyword}
          onChange={(event) =>
            onKeywordChange(
              event.target.value,
            )
          }
          placeholder="이름, 직군, 관심분야를 검색해보세요."
          className={
            styles.searchInput
          }
          aria-label="프로필 검색"
        />

        <div
          className={
            styles.filterArea
          }
        >
          <Dropdown
            value={affiliation}
            placeholder="현 소속"
            options={
              AFFILIATION_OPTIONS
            }
            onChange={
              onAffiliationChange
            }
            className={
              styles.affiliationDropdown
            }
          />

          <button
            type="button"
            className={`${
              styles.filterButton
            } ${
              selectedFilterCount > 0
                ? styles.activeFilterButton
                : ""
            }`}
            onClick={() =>
              setIsSkillModalOpen(
                true,
              )
            }
          >
            <span
              className={
                styles.filterText
              }
            >
              직군·스킬
            </span>

            {selectedFilterCount >
              0 && (
              <span
                className={
                  styles.filterCount
                }
              >
                {
                  selectedFilterCount
                }
              </span>
            )}

            <img
              src={dropdownIcon}
              alt=""
              className={
                styles.arrow
              }
            />
          </button>
        </div>
      </div>

      <div
        className={styles.sortArea}
      >
        <Dropdown
          value={sort}
          options={SORT_OPTIONS}
          onChange={onSortChange}
          className={
            styles.sortDropdown
          }
        />
      </div>

      {isSkillModalOpen && (
        <SkillFilterModal
          selectedJobType={
            selectedJobType
          }
          selectedSkills={
            selectedTags
          }
          onClose={() =>
            setIsSkillModalOpen(
              false,
            )
          }
          onApply={
            handleFilterApply
          }
        />
      )}
    </div>
  );
};

export default ExploreSearch;