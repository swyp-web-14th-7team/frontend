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
   * 직군은 스킬 목록을 좁히는 용도로만 사용한다.
   * 실제 탐색 결과에 적용되는 필터 개수는
   * 선택한 스킬만 계산한다.
   */
  const selectedFilterCount =
    selectedTags.length;

  /*
   * 모바일 스킬 표시
   *
   * 1개 선택: Swift
   * 여러 개 선택: Swift 외 3
   * 선택 없음: 직군·스킬
   */
  const mobileFilterLabel =
    selectedTags.length > 0
      ? `${
          selectedTags[0]
            ?.name ||
          "스킬"
        }${
          selectedTags.length >
          1
            ? ` 외 ${
                selectedTags.length -
                1
              }`
            : ""
        }`
      : "직군·스킬";

  const handleFilterApply = ({
    jobType,
    skills,
  }) => {
    /*
     * 직군 선택값은 모달을 다시 열었을 때
     * 선택 상태를 유지하기 위해서만 저장한다.
     */
    onJobTypeChange(
      jobType,
    );

    /*
     * 실제 탐색 결과에는
     * 선택한 스킬만 적용한다.
     */
    onTagsChange(
      skills,
    );
  };

  return (
    <div
      className={
        styles.container
      }
    >
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
          className={
            styles.searchIcon
          }
        />

        <input
          type="search"
          value={keyword}
          onChange={(
            event,
          ) =>
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
            value={
              affiliation
            }
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
            className={`${styles.filterButton} ${
              selectedFilterCount >
              0
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

            <span
              className={
                styles.mobileFilterText
              }
            >
              {
                mobileFilterLabel
              }
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
              src={
                dropdownIcon
              }
              alt=""
              className={
                styles.arrow
              }
            />
          </button>
        </div>
      </div>

      <div
        className={
          styles.sortArea
        }
      >
        <Dropdown
          value={sort}
          options={
            SORT_OPTIONS
          }
          onChange={
            onSortChange
          }
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