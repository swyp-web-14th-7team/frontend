    import { useCallback, useEffect, useState } from "react";

    import { useNavigate, useParams } from "react-router-dom";

    import {
    deleteCurrentUser,
    getMyUser,
    updateCurrentUser,
    } from "../../api/users";

    import {
    updateDefaultProfileCard,
    } from "../../api/profile";

    import {
    cancelConnectionRequest,
    getSentConnectionRequests,
    } from "../../api/connectionRequests";

    import { requestLogout } from "../../api/auth";

    import { removeAccessToken, saveUserName } from "../../utils/auth";

    import { mapProfileCard } from "../../utils/profileMapper";

    import styles from "./Settings.module.css";

    const SECTION_MAP = {
    requests: "requests",
    account: "account",
    };

    const REQUEST_STATUS = {
    0: "대기중",
    1: "수락",
    2: "거절",
    3: "취소",
    };

    const STRING_STATUS_MAP = {
    PENDING: 0,
    WAITING: 0,
    REJECTED: 2,
    DECLINED: 2,
    ACCEPTED: 1,
    APPROVED: 1,
    CANCELED: 3,
    CANCELLED: 3,
    };

    const unwrapUser = (response) =>
    response?.data?.data?.user ??
    response?.data?.user ??
    response?.user ??
    response?.data?.data ??
    response?.data ??
    response ??
    {};

    const getRequestStatus = (request) => {
    const rawStatus =
        request?.status?.value ??
        request?.status?.code ??
        request?.status?.id ??
        request?.status;

    if (typeof rawStatus === "number" && Number.isFinite(rawStatus)) {
        return rawStatus;
    }

    if (typeof rawStatus === "string") {
        const trimmedStatus = rawStatus.trim();

        if (trimmedStatus) {
        const numericStatus = Number(trimmedStatus);

        if (Number.isFinite(numericStatus)) {
            return numericStatus;
        }

        return STRING_STATUS_MAP[trimmedStatus.toUpperCase()] ?? null;
        }
    }

    return null;
    };

    const getItems = (response) => {
    const items =
        response?.items ?? response?.data?.items ?? response?.data ?? [];

    return Array.isArray(items) ? items : [];
    };

    const getRequestDate = (request) =>
    request?.createdAt?.isoString ??
    request?.createdAt ??
    request?.requestedAt?.isoString ??
    request?.requestedAt ??
    "";

    const formatRequestDate = (request) => {
    const value = getRequestDate(request);

    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
    };

    const Settings = () => {
    const navigate = useNavigate();
    const { section } = useParams();

    const activeSection = SECTION_MAP[section] ?? "account";

    const [nickname, setNickname] = useState("");
    const [initialNickname, setInitialNickname] = useState("");

    const [accountName, setAccountName] = useState("");
    const [accountEmail, setAccountEmail] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [pendingPath, setPendingPath] = useState(null);

    const [sentRequests, setSentRequests] = useState([]);
    const [isRequestsLoading, setIsRequestsLoading] = useState(false);
    const [cancellingRequestId, setCancellingRequestId] = useState(null);

    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    const isNicknameDirty = nickname.trim() !== initialNickname.trim();
    const isDirty = isNicknameDirty;

    /*
    * 계정 관리에 필요한 회원 정보를 불러옵니다.
    */
    useEffect(() => {
        const controller = new AbortController();

        const loadSettings = async () => {
        try {
            setIsLoading(true);
            setError("");

            const userResult = await getMyUser({
                signal: controller.signal,
            });

            if (controller.signal.aborted) {
            return;
            }

            const user = unwrapUser(userResult);

            const nextNickname =
            user?.nickname || user?.profile?.nickname || user?.name || "";
            const nextEmail =
            user?.email ?? user?.account?.email ?? user?.profile?.email ?? "";

            setNickname(nextNickname);
            setInitialNickname(nextNickname);

            setAccountName(
            user?.name ?? user?.username ?? user?.nickname ?? nextNickname,
            );
            setAccountEmail(nextEmail);
        } catch (requestError) {
            if (requestError?.name === "AbortError") {
            return;
            }

            setError(requestError?.message ?? "회원 정보를 불러오지 못했습니다.");
        } finally {
            if (!controller.signal.aborted) {
            setIsLoading(false);
            }
        }
        };

        loadSettings();

        return () => {
        controller.abort();
        };
    }, []);

    const loadSentRequests = useCallback(async (signal) => {
        setIsRequestsLoading(true);
        setError("");

        try {
        const cardsResponse = await getMyProfileCards({
            page: 1,
            limit: 100,
            signal,
        });

        const cards = getItems(cardsResponse);

        const responses = await Promise.all(
            cards.map((card) =>
            getSentConnectionRequests({
                cardId: card.id,
                page: 1,
                limit: 100,
                signal,
            }),
            ),
        );

        const uniqueRequests = Array.from(
            new Map(
            responses.flatMap(getItems).map((request) => [request.id, request]),
            ).values(),
        ).sort((first, second) => {
            const firstDate = new Date(getRequestDate(first)).getTime();
            const secondDate = new Date(getRequestDate(second)).getTime();

            return secondDate - firstDate;
        });

        if (!signal?.aborted) {
            setSentRequests(uniqueRequests);
        }
        } catch (requestError) {
        if (requestError?.name === "AbortError") {
            return;
        }

        setError(requestError?.message ?? "요청 기록을 불러오지 못했습니다.");
        } finally {
        if (!signal?.aborted) {
            setIsRequestsLoading(false);
        }
        }
    }, []);

    useEffect(() => {
        if (activeSection !== "requests") {
        return undefined;
        }

        const controller = new AbortController();

        loadSentRequests(controller.signal);

        return () => {
        controller.abort();
        };
    }, [activeSection, loadSentRequests]);

    const clearMessages = () => {
        setError("");
        setSuccessMessage("");
    };

    const moveToPath = (path) => {
        if (isDirty && activeSection === "account") {
        setPendingPath(path);
        setIsLeaveModalOpen(true);
        return;
        }

        clearMessages();
        navigate(path);
    };

    const handleBack = () => {
        if (isDirty && activeSection === "account") {
        setPendingPath("/profile");
        setIsLeaveModalOpen(true);
        return;
        }

        navigate("/profile");
    };

    const handleLogout = async () => {
        if (isLoggingOut) {
        return;
        }

        setIsLoggingOut(true);
        clearMessages();

        try {
        await requestLogout();
        removeAccessToken();
        window.location.replace("/explore");
        } catch (requestError) {
        setError(
            requestError?.message ??
            "로그아웃하지 못했습니다. 잠시 후 다시 시도해주세요.",
        );
        setIsLoggingOut(false);
        }
    };

    const handleCancelRequest = async (requestId) => {
        if (cancellingRequestId) {
        return;
        }

        setCancellingRequestId(requestId);
        setError("");

        try {
        await cancelConnectionRequest(requestId);

        setSentRequests((requests) =>
            requests.map((request) =>
            request.id === requestId
                ? {
                    ...request,
                    status: 3,
                }
                : request,
            ),
        );
        } catch (requestError) {
        setError(requestError?.message ?? "요청을 취소하지 못했습니다.");
        } finally {
        setCancellingRequestId(null);
        }
    };

    const handleWithdraw = async () => {
        if (isWithdrawing) {
        return;
        }

        setIsWithdrawing(true);
        setError("");

        try {
        await deleteCurrentUser();
        removeAccessToken();
        window.location.replace("/explore");
        } catch (requestError) {
        setError(requestError?.message ?? "회원 탈퇴에 실패했습니다.");
        setIsWithdrawing(false);
        setIsWithdrawModalOpen(false);
        }
    };

    const handleContinueEditing = () => {
        setIsLeaveModalOpen(false);
        setPendingPath(null);
    };

    const handleDiscardChanges = () => {
        const nextPath = pendingPath ?? "/profile";

        setNickname(initialNickname);
        setIsLeaveModalOpen(false);
        setPendingPath(null);

        navigate(nextPath);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const trimmedNickname = nickname.trim();

        if (isNicknameDirty && !trimmedNickname) {
        setError("닉네임을 입력해주세요.");
        return;
        }

        if (!isDirty) {
        setError("");
        setSuccessMessage("변경된 내용이 없습니다.");
        return;
        }

        try {
        setIsSaving(true);
        clearMessages();

        const result = await updateCurrentUser({
            nickname: trimmedNickname,
        });

        await updateDefaultProfileCard({
            nickname: trimmedNickname,
        });

        const savedUser = unwrapUser(result);

        const savedNickname =
            savedUser?.nickname || savedUser?.name || trimmedNickname;

        setNickname(savedNickname);
        setInitialNickname(savedNickname);
        saveUserName(savedNickname);

        setSuccessMessage("닉네임과 카드 정보가 변경되었습니다.");
        } catch (requestError) {
        setError(
            requestError?.message ??
            "닉네임 또는 카드 정보를 변경하지 못했습니다.",
        );
        } finally {
        setIsSaving(false);
        }
    };

    const renderRequests = () => {
        const getTargetCard = (request) =>
        request?.receiverCard ??
        request?.receiverProfileCard ??
        request?.targetCard ??
        request?.card ??
        request?.receiver ??
        {};

        return (
        <>
            <div className={styles.contentHeader}>
            <h1>내 요청 기록</h1>
            <p>내가 보낸 카드 교환 요청을 관리합니다.</p>
            </div>

            {error && (
            <p className={styles.error} role="alert">
                {error}
            </p>
            )}

            {isRequestsLoading ? (
            <p className={styles.statusText}>요청 기록을 불러오는 중입니다.</p>
            ) : sentRequests.length === 0 ? (
            <div className={styles.emptySection}>
                <p>아직 보낸 교환 요청이 없습니다.</p>
            </div>
            ) : (
            <div className={styles.requestList}>
                {sentRequests.map((request) => {
                const targetCard = mapProfileCard(getTargetCard(request));
                const status = getRequestStatus(request);
                const displayName =
                    targetCard?.name ?? targetCard?.nickname ?? "프로필 카드";
                const profileImageUrl =
                    targetCard?.profileImage ?? targetCard?.profileImageUrl ?? "";

                return (
                    <article
                    className={`${styles.requestItem} ${
                        status === 0 ? styles.requestItemCancelable : ""
                    }`}
                    key={request.id}
                    >
                    <div className={styles.requestProfile}>
                        {profileImageUrl ? (
                        <img
                            className={styles.requestAvatar}
                            src={profileImageUrl}
                            alt={`${displayName} 프로필`}
                        />
                        ) : (
                        <div
                            className={styles.requestAvatarFallback}
                            aria-hidden="true"
                        >
                            {displayName.slice(0, 1)}
                        </div>
                        )}

                        <div className={styles.requestText}>
                        <strong>{displayName}</strong>
                        <p>{formatRequestDate(request)}</p>
                        </div>
                    </div>

                    <div className={styles.requestActions}>
                        <span
                        className={`${styles.requestStatus} ${
                            status !== null ? (styles[`status${status}`] ?? "") : ""
                        }`}
                        >
                        {status !== null
                            ? (REQUEST_STATUS[status] ?? "상태 확인 중")
                            : "상태 확인 중"}
                        </span>

                        {status === 0 && (
                        <button
                            type="button"
                            className={styles.requestCancelButton}
                            onClick={() => handleCancelRequest(request.id)}
                            disabled={cancellingRequestId === request.id}
                        >
                            {cancellingRequestId === request.id
                            ? "취소 중..."
                            : "취소"}
                        </button>
                        )}
                    </div>
                    </article>
                );
                })}
            </div>
            )}
        </>
        );
    };

    const renderAccount = () => {
        if (isLoading) {
        return (
            <p className={styles.statusText}>회원 정보를 불러오는 중입니다.</p>
        );
        }

        return (
        <div className={styles.accountContent}>
            <div className={styles.contentHeader}>
            <h1>계정 관리</h1>
            <p>닉네임과 계정 정보를 관리합니다.</p>
            </div>

            <form
            className={styles.accountForm}
            onSubmit={handleSubmit}
            >
            <div className={styles.accountInfo}>
                <div className={styles.field}>
                <label htmlFor="account-nickname">닉네임</label>
                <div className={styles.nicknameControlRow}>
                    <input
                    id="account-nickname"
                    className={styles.accountNicknameInput}
                    type="text"
                    value={nickname}
                    onChange={(event) => {
                        setNickname(event.target.value);
                        clearMessages();
                    }}
                    maxLength={255}
                    placeholder="닉네임을 입력해주세요"
                    />

                    <button
                    type="submit"
                    className={styles.nicknameSubmitButton}
                    disabled={isSaving}
                    >
                    {isSaving ? "변경 중..." : "변경"}
                    </button>
                </div>
                </div>

                <div className={styles.field}>
                <label htmlFor="account-name">이름</label>
                <input
                    id="account-name"
                    className={styles.accountReadOnlyInput}
                    type="text"
                    value={accountName || "등록된 이름이 없습니다."}
                    readOnly
                    aria-readonly="true"
                />
                </div>

                <div className={styles.field}>
                <label htmlFor="account-email">이메일</label>
                <input
                    id="account-email"
                    className={styles.accountReadOnlyInput}
                    type="text"
                    value={accountEmail || "등록된 이메일이 없습니다."}
                    readOnly
                    aria-readonly="true"
                />
                </div>
            </div>

            {error && (
                <p className={styles.error} role="alert">
                {error}
                </p>
            )}

            {successMessage && (
                <p className={styles.success} role="status">
                {successMessage}
                </p>
            )}

            </form>

            <div className={styles.dangerSection}>
            <div>
                <strong>회원 탈퇴</strong>
                <p>탈퇴하면 계정과 관련된 정보가 삭제되며 되돌릴 수 없습니다.</p>
            </div>

            <button type="button" onClick={() => setIsWithdrawModalOpen(true)}>
                회원 탈퇴
            </button>
            </div>
        </div>
        );
    };

    return (
        <main className={styles.page}>
        <aside className={styles.sidebar}>
            <button
            type="button"
            className={styles.backButton}
            onClick={handleBack}
            >
            <span>‹</span>
            돌아가기
            </button>

            <nav className={styles.sideNav}>
            <button
                type="button"
                className={
                activeSection === "requests" ? styles.activeSideItem : ""
                }
                onClick={() => moveToPath("/settings/requests")}
            >
                내 요청 기록
            </button>

            <button
                type="button"
                className={activeSection === "account" ? styles.activeSideItem : ""}
                onClick={() => moveToPath("/settings/account")}
            >
                계정 관리
            </button>

            <button
                type="button"
                className={styles.logoutButton}
                onClick={handleLogout}
                disabled={isLoggingOut}
            >
                {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
            </button>
            </nav>
        </aside>

        <section className={styles.content}>
            <div className={styles.contentInner}>
            {activeSection === "requests" && renderRequests()}
            {activeSection === "account" && renderAccount()}
            </div>
        </section>

        {isLeaveModalOpen && (
            <div
            className={styles.modalBackdrop}
            role="presentation"
            onMouseDown={handleContinueEditing}
            >
            <section
                className={styles.leaveModal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="leave-modal-title"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <h2 id="leave-modal-title">변경 내용을 삭제하시겠어요?</h2>
                <p>지금 돌아가면 변경 내용이 삭제됩니다.</p>

                <div className={styles.modalActions}>
                <button
                    type="button"
                    className={styles.continueButton}
                    onClick={handleContinueEditing}
                >
                    수정 계속하기
                </button>

                <button
                    type="button"
                    className={styles.discardButton}
                    onClick={handleDiscardChanges}
                >
                    변경 사항 삭제
                </button>
                </div>
            </section>
            </div>
        )}

        {isWithdrawModalOpen && (
            <div
            className={styles.modalBackdrop}
            role="presentation"
            onMouseDown={() => {
                if (!isWithdrawing) {
                setIsWithdrawModalOpen(false);
                }
            }}
            >
            <section
                className={styles.leaveModal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="withdraw-modal-title"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <h2 id="withdraw-modal-title">정말 탈퇴하시겠어요?</h2>
                <p>탈퇴 후에는 계정 정보를 복구할 수 없습니다.</p>

                <div className={styles.modalActions}>
                <button
                    type="button"
                    className={styles.continueButton}
                    onClick={() => setIsWithdrawModalOpen(false)}
                    disabled={isWithdrawing}
                >
                    취소
                </button>

                <button
                    type="button"
                    className={styles.withdrawConfirmButton}
                    onClick={handleWithdraw}
                    disabled={isWithdrawing}
                >
                    {isWithdrawing ? "탈퇴 중..." : "탈퇴하기"}
                </button>
                </div>
            </section>
            </div>
        )}
        </main>
    );
    };

    export default Settings;
