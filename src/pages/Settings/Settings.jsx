    import {
    useCallback,
    useEffect,
    useState,
    } from "react";

    import {
    useNavigate,
    useParams,
    } from "react-router-dom";

    import {
    deleteCurrentUser,
    getMyUser,
    updateMyUser,
    } from "../../api/users";

    import {
    getMyProfileCards,
    } from "../../api/profile";

    import {
    cancelConnectionRequest,
    getSentConnectionRequests,
    } from "../../api/connectionRequests";

    import {
    requestLogout,
    } from "../../api/auth";

    import {
    removeAccessToken,
    } from "../../utils/auth";

    import {
    mapProfileCard,
    } from "../../utils/profileMapper";

    import styles from "./Settings.module.css";

    const SECTION_MAP = {
    basic: "basic",
    requests: "requests",
    account: "account",
    };

    const REQUEST_STATUS = {
    0: "대기 중",
    1: "수락됨",
    2: "거절됨",
    3: "취소됨",
    };

    const getItems = (
    response,
    ) => {
    return (
        response?.items ||
        response?.data?.items ||
        response?.data ||
        []
    );
    };

    const getRequestDate = (
    request,
    ) => {
    return (
        request.createdAt
        ?.isoString ||
        request.createdAt ||
        request.requestedAt
        ?.isoString ||
        request.requestedAt ||
        ""
    );
    };

    const formatRequestDate = (
    request,
    ) => {
    const value =
        getRequestDate(request);

    if (!value) {
        return "";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
        date.getTime(),
        )
    ) {
        return "";
    }

    return date.toLocaleDateString(
        "ko-KR",
    );
    };

    const Settings = () => {
    const navigate =
        useNavigate();

    const { section } =
        useParams();

    const activeSection =
        SECTION_MAP[section] ||
        "basic";

    const [
        nickname,
        setNickname,
    ] = useState("");

    const [
        initialNickname,
        setInitialNickname,
    ] = useState("");

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        isSaving,
        setIsSaving,
    ] = useState(false);

    const [
        isLoggingOut,
        setIsLoggingOut,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    const [
        successMessage,
        setSuccessMessage,
    ] = useState("");

    const [
        isLeaveModalOpen,
        setIsLeaveModalOpen,
    ] = useState(false);

    const [
        pendingPath,
        setPendingPath,
    ] = useState(null);

    const [
        sentRequests,
        setSentRequests,
    ] = useState([]);

    const [
        isRequestsLoading,
        setIsRequestsLoading,
    ] = useState(false);

    const [
        cancellingRequestId,
        setCancellingRequestId,
    ] = useState(null);

    const [
        isWithdrawModalOpen,
        setIsWithdrawModalOpen,
    ] = useState(false);

    const [
        isWithdrawing,
        setIsWithdrawing,
    ] = useState(false);

    const isDirty =
        nickname.trim() !==
        initialNickname.trim();

    /*
    * 내 회원 정보 조회
    */
    useEffect(() => {
        const controller =
        new AbortController();

        const loadUser =
        async () => {
            try {
            const result =
                await getMyUser({
                signal:
                    controller.signal,
                });

            const nextNickname =
                result?.nickname ||
                "";

            setNickname(
                nextNickname,
            );

            setInitialNickname(
                nextNickname,
            );
            } catch (
            requestError
            ) {
            if (
                requestError.name ===
                "AbortError"
            ) {
                return;
            }

            setError(
                requestError
                ?.message ||
                "회원 정보를 불러오지 못했습니다.",
            );
            } finally {
            setIsLoading(
                false,
            );
            }
        };

        loadUser();

        return () => {
        controller.abort();
        };
    }, []);

    /*
    * 내가 보낸 교환 요청 조회
    */
    const loadSentRequests =
        useCallback(
        async (signal) => {
            setIsRequestsLoading(
            true,
            );

            setError("");

            try {
            const cardsResponse =
                await getMyProfileCards(
                {
                    page: 1,
                    limit: 100,
                    signal,
                },
                );

            const cards =
                getItems(
                cardsResponse,
                );

            const responses =
                await Promise.all(
                cards.map(
                    (card) =>
                    getSentConnectionRequests(
                        {
                        cardId:
                            card.id,

                        page: 1,
                        limit: 100,
                        signal,
                        },
                    ),
                ),
                );

            const uniqueRequests =
                Array.from(
                new Map(
                    responses
                    .flatMap(
                        getItems,
                    )
                    .map(
                        (
                        request,
                        ) => [
                        request.id,
                        request,
                        ],
                    ),
                ).values(),
                ).sort(
                (a, b) =>
                    new Date(
                    getRequestDate(
                        b,
                    ),
                    ).getTime() -
                    new Date(
                    getRequestDate(
                        a,
                    ),
                    ).getTime(),
                );

            if (
                signal?.aborted
            ) {
                return;
            }

            setSentRequests(
                uniqueRequests,
            );
            } catch (
            requestError
            ) {
            if (
                requestError.name ===
                "AbortError"
            ) {
                return;
            }

            setError(
                requestError
                ?.message ||
                "요청 기록을 불러오지 못했습니다.",
            );
            } finally {
            if (
                !signal?.aborted
            ) {
                setIsRequestsLoading(
                false,
                );
            }
            }
        },
        [],
        );

    useEffect(() => {
        if (
        activeSection !==
        "requests"
        ) {
        return undefined;
        }

        const controller =
        new AbortController();

        Promise.resolve().then(
        () =>
            loadSentRequests(
            controller.signal,
            ),
        );

        return () => {
        controller.abort();
        };
    }, [
        activeSection,
        loadSentRequests,
    ]);

    const moveToPath = (
        path,
    ) => {
        if (
        isDirty &&
        activeSection ===
            "basic"
        ) {
        setPendingPath(path);

        setIsLeaveModalOpen(
            true,
        );

        return;
        }

        navigate(path);
    };

    const handleBack = () => {
        if (
        isDirty &&
        activeSection ===
            "basic"
        ) {
        setPendingPath(
            "/profile",
        );

        setIsLeaveModalOpen(
            true,
        );

        return;
        }

        navigate("/profile");
    };

    const handleLogout =
        async () => {
        if (isLoggingOut) {
            return;
        }

        setIsLoggingOut(
            true,
        );

        setError("");

        setSuccessMessage(
            "",
        );

        try {
            await requestLogout();

            removeAccessToken();

            window.location.replace(
            "/explore",
            );
        } catch (
            requestError
        ) {
            console.error(
            "로그아웃 실패:",
            requestError,
            );

            setError(
            requestError
                ?.message ||
                "로그아웃하지 못했습니다. 잠시 후 다시 시도해주세요.",
            );

            setIsLoggingOut(
            false,
            );
        }
        };

    const handleCancelRequest =
        async (
        requestId,
        ) => {
        if (
            cancellingRequestId
        ) {
            return;
        }

        setCancellingRequestId(
            requestId,
        );

        setError("");

        try {
            await cancelConnectionRequest(
            requestId,
            );

            setSentRequests(
            (requests) =>
                requests.map(
                (
                    request,
                ) =>
                    request.id ===
                    requestId
                    ? {
                        ...request,
                        status: 3,
                        }
                    : request,
                ),
            );
        } catch (
            requestError
        ) {
            setError(
            requestError
                ?.message ||
                "요청을 취소하지 못했습니다.",
            );
        } finally {
            setCancellingRequestId(
            null,
            );
        }
        };

    const handleWithdraw =
        async () => {
        if (isWithdrawing) {
            return;
        }

        setIsWithdrawing(
            true,
        );

        setError("");

        try {
            await deleteCurrentUser();

            removeAccessToken();

            window.location.replace(
            "/explore",
            );
        } catch (
            requestError
        ) {
            setError(
            requestError
                ?.message ||
                "회원 탈퇴에 실패했습니다.",
            );

            setIsWithdrawing(
            false,
            );

            setIsWithdrawModalOpen(
            false,
            );
        }
        };

    const handleContinueEditing =
        () => {
        setIsLeaveModalOpen(
            false,
        );

        setPendingPath(null);
        };

    const handleDiscardChanges =
        () => {
        const nextPath =
            pendingPath ||
            "/profile";

        setNickname(
            initialNickname,
        );

        setIsLeaveModalOpen(
            false,
        );

        setPendingPath(null);

        navigate(nextPath);
        };

    const handleSubmit =
        async (event) => {
        event.preventDefault();

        const trimmedNickname =
            nickname.trim();

        if (!trimmedNickname) {
            setError(
            "이름을 입력해주세요.",
            );

            return;
        }

        if (!isDirty) {
            setSuccessMessage(
            "변경된 내용이 없습니다.",
            );

            return;
        }

        try {
            setIsSaving(true);

            setError("");

            setSuccessMessage(
            "",
            );

            const result =
            await updateMyUser(
                {
                nickname:
                    trimmedNickname,
                },
            );

            const savedNickname =
            result?.nickname ||
            trimmedNickname;

            setNickname(
            savedNickname,
            );

            setInitialNickname(
            savedNickname,
            );

            setSuccessMessage(
            "기본 정보가 변경되었습니다.",
            );
        } catch (
            requestError
        ) {
            setError(
            requestError
                ?.message ||
                "기본 정보를 변경하지 못했습니다.",
            );
        } finally {
            setIsSaving(false);
        }
        };

    const renderBasicSettings =
        () => {
        if (isLoading) {
            return (
            <p
                className={
                styles.statusText
                }
            >
                회원 정보를
                불러오는 중입니다.
            </p>
            );
        }

        return (
            <>
            <div
                className={
                styles.contentHeader
                }
            >
                <h1>
                기본 정보 변경
                </h1>

                <p>
                변경 시점 이후
                만드시는 카드에만
                변경 사항이
                적용됩니다.
                </p>
            </div>

            <form
                className={
                styles.form
                }
                onSubmit={
                handleSubmit
                }
            >
                <div
                className={
                    styles.field
                }
                >
                <label htmlFor="nickname">
                    이름
                </label>

                <input
                    id="nickname"
                    type="text"
                    value={
                    nickname
                    }
                    onChange={(
                    event,
                    ) => {
                    setNickname(
                        event.target
                        .value,
                    );

                    setError("");

                    setSuccessMessage(
                        "",
                    );
                    }}
                    maxLength={
                    20
                    }
                    placeholder="이름을 입력해주세요"
                />
                </div>

                <div
                className={
                    styles.field
                }
                >
                <label htmlFor="job">
                    직군
                </label>

                <div
                    className={
                    styles.jobRow
                    }
                >
                    <button
                    type="button"
                    className={
                        styles.jobSelectButton
                    }
                    disabled
                    >
                    선택
                    <span>
                        ▾
                    </span>
                    </button>

                    <input
                    id="job"
                    type="text"
                    value="직군 변경 API 준비 중"
                    disabled
                    />
                </div>

                <p
                    className={
                    styles.fieldDescription
                    }
                >
                    현재 API에서는
                    이름만 변경할 수
                    있습니다.
                </p>
                </div>

                {error && (
                <p
                    className={
                    styles.error
                    }
                    role="alert"
                >
                    {error}
                </p>
                )}

                {successMessage && (
                <p
                    className={
                    styles.success
                    }
                    role="status"
                >
                    {
                    successMessage
                    }
                </p>
                )}

                <button
                type="submit"
                className={
                    styles.submitButton
                }
                disabled={
                    isSaving
                }
                >
                {isSaving
                    ? "변경 중..."
                    : "변경하기"}
                </button>
            </form>
            </>
        );
        };

    /*
    * 이 함수 선언이 첨부 코드에서 빠져 있었다.
    */
    const renderRequests =
        () => {
        const getTargetCard =
            (request) =>
            request.card ||
            request.receiverCard ||
            request.receiverProfileCard ||
            request.receiver ||
            {};

        return (
            <>
            <div
                className={
                styles.contentHeader
                }
            >
                <h1>
                내 요청 기록
                </h1>

                <p>
                내가 보낸 카드 교환
                요청을 관리합니다.
                </p>
            </div>

            {error && (
                <p
                className={
                    styles.error
                }
                role="alert"
                >
                {error}
                </p>
            )}

            {isRequestsLoading ? (
                <p
                className={
                    styles.statusText
                }
                >
                요청 기록을
                불러오는 중입니다.
                </p>
            ) : sentRequests.length ===
                0 ? (
                <div
                className={
                    styles.emptySection
                }
                >
                <p>
                    아직 보낸 교환
                    요청이 없습니다.
                </p>
                </div>
            ) : (
                <div
                className={
                    styles.requestList
                }
                >
                {sentRequests.map(
                    (request) => {
                    const targetCard =
                        mapProfileCard(
                        getTargetCard(
                            request,
                        ),
                        );

                    const status =
                        Number(
                        request.status,
                        );

                    const displayName =
                        targetCard.name ||
                        "프로필 카드";

                    const profileImageUrl =
                        targetCard.profileImage ||
                        "";

                    return (
                        <article
                        className={
                            styles.requestItem
                        }
                        key={
                            request.id
                        }
                        >
                        <div
                            className={
                            styles.requestProfile
                            }
                        >
                            {profileImageUrl ? (
                            <img
                                className={
                                styles.requestAvatar
                                }
                                src={
                                profileImageUrl
                                }
                                alt={`${displayName} 프로필`}
                            />
                            ) : (
                            <div
                                className={
                                styles.requestAvatarFallback
                                }
                            >
                                {displayName.slice(
                                0,
                                1,
                                )}
                            </div>
                            )}

                            <div>
                            <strong>
                                {
                                displayName
                                }
                            </strong>

                            <p>
                                {formatRequestDate(
                                request,
                                )}
                            </p>
                            </div>
                        </div>

                        <div
                            className={
                            styles.requestActions
                            }
                        >
                            <span
                            className={`${
                                styles.requestStatus
                            } ${
                                styles[
                                `status${status}`
                                ] || ""
                            }`}
                            >
                            {REQUEST_STATUS[
                                status
                            ] ||
                                "상태 확인 중"}
                            </span>

                            {status ===
                            0 && (
                            <button
                                type="button"
                                onClick={() =>
                                handleCancelRequest(
                                    request.id,
                                )
                                }
                                disabled={
                                cancellingRequestId ===
                                request.id
                                }
                            >
                                {cancellingRequestId ===
                                request.id
                                ? "취소 중..."
                                : "요청 취소"}
                            </button>
                            )}
                        </div>
                        </article>
                    );
                    },
                )}
                </div>
            )}
            </>
        );
        };

    const renderAccount =
        () => {
        return (
            <>
            <div
                className={
                styles.contentHeader
                }
            >
                <h1>
                계정 관리
                </h1>

                <p>
                계정과 관련된 설정을
                관리합니다.
                </p>
            </div>

            {error && (
                <p
                className={
                    styles.error
                }
                role="alert"
                >
                {error}
                </p>
            )}

            <div
                className={
                styles.dangerSection
                }
            >
                <div>
                <strong>
                    회원 탈퇴
                </strong>

                <p>
                    탈퇴하면 계정과
                    관련된 정보가
                    삭제되며 되돌릴 수
                    없습니다.
                </p>
                </div>

                <button
                type="button"
                onClick={() =>
                    setIsWithdrawModalOpen(
                    true,
                    )
                }
                >
                회원 탈퇴
                </button>
            </div>
            </>
        );
        };

    return (
        <main
        className={styles.page}
        >
        <aside
            className={
            styles.sidebar
            }
        >
            <button
            type="button"
            className={
                styles.backButton
            }
            onClick={handleBack}
            >
            <span>‹</span>
            돌아가기
            </button>

            <nav
            className={
                styles.sideNav
            }
            >
            <button
                type="button"
                className={
                activeSection ===
                "basic"
                    ? styles.activeSideItem
                    : ""
                }
                onClick={() =>
                moveToPath(
                    "/settings",
                )
                }
            >
                기본 정보 변경
            </button>

            <button
                type="button"
                className={
                activeSection ===
                "requests"
                    ? styles.activeSideItem
                    : ""
                }
                onClick={() =>
                moveToPath(
                    "/settings/requests",
                )
                }
            >
                내 요청 기록
            </button>

            <button
                type="button"
                className={
                activeSection ===
                "account"
                    ? styles.activeSideItem
                    : ""
                }
                onClick={() =>
                moveToPath(
                    "/settings/account",
                )
                }
            >
                계정 관리
            </button>

            <button
                type="button"
                className={
                styles.logoutButton
                }
                onClick={
                handleLogout
                }
                disabled={
                isLoggingOut
                }
            >
                {isLoggingOut
                ? "로그아웃 중..."
                : "로그아웃"}
            </button>
            </nav>
        </aside>

        <section
            className={
            styles.content
            }
        >
            <div
            className={
                styles.contentInner
            }
            >
            {activeSection ===
                "basic" &&
                renderBasicSettings()}

            {activeSection ===
                "requests" &&
                renderRequests()}

            {activeSection ===
                "account" &&
                renderAccount()}
            </div>
        </section>

        {isLeaveModalOpen && (
            <div
            className={
                styles.modalBackdrop
            }
            role="presentation"
            onMouseDown={
                handleContinueEditing
            }
            >
            <section
                className={
                styles.leaveModal
                }
                role="dialog"
                aria-modal="true"
                aria-labelledby="leave-modal-title"
                onMouseDown={(
                event,
                ) =>
                event.stopPropagation()
                }
            >
                <h2 id="leave-modal-title">
                변경 내용을
                삭제하시겠어요?
                </h2>

                <p>
                지금 돌아가면 변경
                내용이 삭제됩니다.
                </p>

                <div
                className={
                    styles.modalActions
                }
                >
                <button
                    type="button"
                    className={
                    styles.continueButton
                    }
                    onClick={
                    handleContinueEditing
                    }
                >
                    수정 계속하기
                </button>

                <button
                    type="button"
                    className={
                    styles.discardButton
                    }
                    onClick={
                    handleDiscardChanges
                    }
                >
                    변경 사항 삭제
                </button>
                </div>
            </section>
            </div>
        )}

        {isWithdrawModalOpen && (
            <div
            className={
                styles.modalBackdrop
            }
            role="presentation"
            onMouseDown={() =>
                !isWithdrawing &&
                setIsWithdrawModalOpen(
                false,
                )
            }
            >
            <section
                className={
                styles.leaveModal
                }
                role="dialog"
                aria-modal="true"
                aria-labelledby="withdraw-modal-title"
                onMouseDown={(
                event,
                ) =>
                event.stopPropagation()
                }
            >
                <h2 id="withdraw-modal-title">
                정말 탈퇴하시겠어요?
                </h2>

                <p>
                탈퇴 후에는 계정
                정보를 복구할 수
                없습니다.
                </p>

                <div
                className={
                    styles.modalActions
                }
                >
                <button
                    type="button"
                    className={
                    styles.continueButton
                    }
                    onClick={() =>
                    setIsWithdrawModalOpen(
                        false,
                    )
                    }
                    disabled={
                    isWithdrawing
                    }
                >
                    취소
                </button>

                <button
                    type="button"
                    className={
                    styles.withdrawConfirmButton
                    }
                    onClick={
                    handleWithdraw
                    }
                    disabled={
                    isWithdrawing
                    }
                >
                    {isWithdrawing
                    ? "탈퇴 중..."
                    : "탈퇴하기"}
                </button>
                </div>
            </section>
            </div>
        )}
        </main>
    );
    };

    export default Settings;