import { useState } from "react";

import styles from "./ExploreSearch.module.css";

import dropdownIcon from "../../assets/icons/icon_dropdown.svg";
import searchIcon from "../../assets/icons/icon_search.svg";

const ExploreSearch = () => {
  const [keyword, setKeyword] = useState("");

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
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="이름, 직군, 관심분야를 검색해보세요."
          className={styles.searchInput}
          aria-label="프로필 검색"
        />

        <div className={styles.filterArea}>
          <button
            type="button"
            className={styles.filterButton}
          >
            <span>현 소속</span>

            <img
              src={dropdownIcon}
              alt=""
              className={styles.arrow}
            />
          </button>

          <button
            type="button"
            className={styles.filterButton}
          >
            <span>스킬</span>

            <img
              src={dropdownIcon}
              alt=""
              className={styles.arrow}
            />
          </button>
        </div>
      </div>

      <button
        type="button"
        className={styles.sortButton}
      >
        <span>최근 등록순</span>

        <img
          src={dropdownIcon}
          alt=""
          className={styles.arrow}
        />
      </button>
    </div>
  );
};

export default ExploreSearch;