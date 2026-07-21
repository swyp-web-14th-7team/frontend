import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    getMyUser,
    updateMyUser,
} from "../../api/users";

import styles from "./Settings.module.css";

const SECTION_MAP = {
    basic: "basic",
    requests: "requests",
    account: "account",
};

const Settings = () => {
    const navigate =
        useNavigate();

    const {
        section,
    } = useParams();

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

    const isDirty =
        nickname.trim() !==
        initialNickname.trim();

    useEffect(() => {
        const controller =
            new AbortController();

        const loadUser =
            async () => {
                try {
                    const result =
                        await getMyUser({
                            signal:
                                controller
                                    .signal,
                        });

                    const nextNickname =
                        result
                            ?.nickname ||
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
                    await updateMyUser({
                        nickname:
                            trimmedNickname,
                    });

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
                            <label
                                htmlFor="nickname"
                            >
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
                                        event
                                            .target
                                            .value,
                                    );

                                    setError(
                                        "",
                                    );

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
                            <label
                                htmlFor="job"
                            >
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

    const renderRequests =
        () => {
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

                    <div
                        className={
                            styles.emptySection
                        }
                    >
                        <p>
                            교환 요청 API 연결
                            후 요청 기록이
                            표시됩니다.
                        </p>
                    </div>
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
                            계정과 관련된
                            설정을 관리합니다.
                        </p>
                    </div>

                    <div
                        className={
                            styles.emptySection
                        }
                    >
                        <p>
                            계정 관리 기능은
                            준비 중입니다.
                        </p>
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
                    onClick={
                        handleBack
                    }
                >
                    <span>
                        ‹
                    </span>

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
                        onClick={() =>
                            window.alert(
                                "로그아웃 기능은 추후 연결할 예정입니다.",
                            )
                        }
                    >
                        로그아웃
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
                        <h2
                            id="leave-modal-title"
                        >
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
        </main>
    );
};

export default Settings;