    import styles from "./Pagination.module.css";

    const Pagination = ({
    currentPage,
    totalPages,
    onChange,
    }) => {
    const pages = Array.from(
        { length: totalPages },
        (_, index) => index + 1
    );

    return (
        <nav
        className={styles.pagination}
        aria-label="탐색 결과 페이지 이동"
        >
        <button
            type="button"
            className={styles.arrowButton}
            onClick={() => onChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="이전 페이지"
        >
            ‹
        </button>

        {pages.map((page) => (
            <button
            key={page}
            type="button"
            className={`${styles.pageButton} ${
                currentPage === page ? styles.active : ""
            }`}
            onClick={() => onChange(page)}
            aria-current={
                currentPage === page ? "page" : undefined
            }
            >
            {page}
            </button>
        ))}

        <button
            type="button"
            className={styles.arrowButton}
            onClick={() => onChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="다음 페이지"
        >
            ›
        </button>
        </nav>
    );
    };

    export default Pagination;