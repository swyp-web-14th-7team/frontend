    import { useCallback, useEffect, useMemo, useState } from "react";

    import { useNavigate, useParams } from "react-router-dom";

    import { deleteCurrentUser, getMyUser } from "../../api/users";

    import {
    getDefaultProfileCard,
    getMyProfileCards,
    updateDefaultProfileCard,
    } from "../../api/profile";

    import {
    cancelConnectionRequest,
    getSentConnectionRequests,
    } from "../../api/connectionRequests";

    import { requestLogout } from "../../api/auth";

    import { removeAccessToken } from "../../utils/auth";

    import { mapProfileCard } from "../../utils/profileMapper";

    import styles from "./Settings.module.css";

    const SECTION_MAP = {
    basic: "basic",
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

    const LINK_TYPES = [
    { type: 0, label: "Email" },
    { type: 1, label: "Instagram" },
    { type: 2, label: "GitHub" },
    { type: 3, label: "LinkedIn" },
    { type: 4, label: "Behance" },
    { type: 5, label: "Notion" },
    { type: 6, label: "Website" },
    ];

    const createEmptyLink = () => ({
    type: 6,
    value: "",
    });

    const LINK_TYPE_BY_NAME = {
    EMAIL: 0,
    INSTAGRAM: 1,
    GITHUB: 2,
    LINKEDIN: 3,
    BEHANCE: 4,
    NOTION: 5,
    WEBSITE: 6,
    };

    const getLinkValue = (link) =>
    String(
        link?.value ??
        link?.url ??
        link?.link ??
        link?.address ??
        link?.email ??
        "",
    ).trim();

    const normalizeEmailValue = (value) =>
    String(value ?? "")
        .trim()
        .replace(/^mailto:/i, "");

    const looksLikeEmail = (value) => {
    const normalizedValue = normalizeEmailValue(value);

    return (
        normalizedValue.includes("@") &&
        !normalizedValue.includes("://") &&
        !normalizedValue.startsWith("www.")
    );
    };

    const normalizeLinkType = (type, value) => {
    if (looksLikeEmail(value)) {
        return 0;
    }

    const numericType = Number(type);

    if (Number.isInteger(numericType) && numericType >= 0 && numericType <= 6) {
        return numericType;
    }

    const namedType = LINK_TYPE_BY_NAME[String(type ?? "").toUpperCase()];

    if (namedType !== undefined) {
        return namedType;
    }

    return 6;
    };

    const unwrapUser = (response) =>
    response?.data?.data?.user ??
    response?.data?.user ??
    response?.user ??
    response?.data?.data ??
    response?.data ??
    response ??
    {};

    const unwrapProfileCard = (response) =>
    response?.data?.data?.card ??
    response?.data?.data?.profileCard ??
    response?.data?.card ??
    response?.data?.profileCard ??
    response?.card ??
    response?.profileCard ??
    response?.data?.data ??
    response?.data ??
    response ??
    {};

    const normalizeLinks = (links, fallbackEmail = "") => {
    const sourceLinks = Array.isArray(links) ? links : [];

    const normalizedLinks = sourceLinks
        .map((link) => {
        const value = getLinkValue(link);
        const type = normalizeLinkType(
            link?.type ?? link?.linkType ?? link?.category,
            value,
        );

        return {
            type,
            value: type === 0 ? normalizeEmailValue(value) : value,
        };
        })
        .filter((link) => link.value);

    const normalizedFallbackEmail = normalizeEmailValue(fallbackEmail);
    const hasEmailLink = normalizedLinks.some((link) => link.type === 0);

    if (normalizedFallbackEmail && !hasEmailLink && normalizedLinks.length < 4) {
        normalizedLinks.unshift({
        type: 0,
        value: normalizedFallbackEmail,
        });
    }

    return normalizedLinks.length > 0
        ? normalizedLinks.slice(0, 4)
        : [createEmptyLink()];
    };

    const createLinkPayload = (links) =>
    links
        .filter((link) => String(link?.value ?? "").trim())
        .map((link) => ({
        type: Number(link.type),
        value: String(link.value).trim(),
        }));

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

    const activeSection = SECTION_MAP[section] ?? "basic";

    const [nickname, setNickname] = useState("");
    const [initialNickname, setInitialNickname] = useState("");

    const [links, setLinks] = useState([createEmptyLink()]);
    const [initialLinks, setInitialLinks] = useState([]);

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

    const currentLinkPayload = useMemo(() => createLinkPayload(links), [links]);

    const isNicknameDirty = nickname.trim() !== initialNickname.trim();
    const areLinksDirty =
        JSON.stringify(currentLinkPayload) !== JSON.stringify(initialLinks);
    const isDirty = isNicknameDirty || areLinksDirty;

    /*
    * 회원 정보와 기본 카드 정보를 함께 불러옵니다.
    * 닉네임과 링크는 기본 카드 데이터를 우선 사용합니다.
    */
    useEffect(() => {
        const controller = new AbortController();

        const loadSettings = async () => {
        try {
            setIsLoading(true);
            setError("");

            const [userResult, defaultProfileResult] = await Promise.all([
            getMyUser({
                signal: controller.signal,
            }),
            getDefaultProfileCard({
                signal: controller.signal,
            }),
            ]);

            if (controller.signal.aborted) {
            return;
            }

            const user = unwrapUser(userResult);
            const defaultProfile = unwrapProfileCard(defaultProfileResult);

            const nextNickname = defaultProfile?.nickname ?? user?.nickname ?? "";
            const nextEmail =
            user?.email ?? user?.account?.email ?? user?.profile?.email ?? "";
            const nextLinks = normalizeLinks(
            defaultProfile?.links ??
                defaultProfile?.profileLinks ??
                defaultProfile?.linkList,
            nextEmail,
            );
            const nextLinkPayload = createLinkPayload(nextLinks);

            setNickname(nextNickname);
            setInitialNickname(nextNickname);

            setLinks(nextLinks);
            setInitialLinks(nextLinkPayload);

            setAccountName(
            user?.name ?? user?.username ?? user?.nickname ?? nextNickname,
            );
            setAccountEmail(nextEmail);
        } catch (requestError) {
            if (requestError?.name === "AbortError") {
            return;
            }

            setError(requestError?.message ?? "기본 정보를 불러오지 못했습니다.");
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
        if (isDirty && activeSection === "basic") {
        setPendingPath(path);
        setIsLeaveModalOpen(true);
        return;
        }

        clearMessages();
        navigate(path);
    };

    const handleBack = () => {
        if (isDirty && activeSection === "basic") {
        setPendingPath("/profile");
        setIsLeaveModalOpen(true);
        return;
        }

        navigate("/profile");
    };

    const handleLinkChange = (index, field, value) => {
        setLinks((previousLinks) =>
        previousLinks.map((link, linkIndex) =>
            linkIndex === index
            ? {
                ...link,
                [field]: field === "type" ? Number(value) : value,
                }
            : link,
        ),
        );

        clearMessages();
    };

    const handleAddLink = () => {
        if (links.length >= 4) {
        return;
        }

        setLinks((previousLinks) => [...previousLinks, createEmptyLink()]);
        clearMessages();
    };

    const handleRemoveLink = (index) => {
        setLinks((previousLinks) => {
        const nextLinks = previousLinks.filter(
            (_, linkIndex) => linkIndex !== index,
        );

        return nextLinks.length > 0 ? nextLinks : [createEmptyLink()];
        });

        clearMessages();
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
        setLinks(normalizeLinks(initialLinks));
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

        const requestBody = {};

        if (isNicknameDirty) {
        requestBody.nickname = trimmedNickname;
        }

        if (areLinksDirty) {
        requestBody.links = currentLinkPayload;
        }

        try {
        setIsSaving(true);
        clearMessages();

        const result = await updateDefaultProfileCard(requestBody);
        const savedProfile = unwrapProfileCard(result);

        const savedNickname =
            savedProfile?.nickname ?? requestBody.nickname ?? initialNickname;

        const savedLinks = Array.isArray(savedProfile?.links)
            ? savedProfile.links
            : (requestBody.links ?? initialLinks);
        const nextSavedLinks = normalizeLinks(savedLinks, accountEmail);
        const nextSavedLinkPayload = createLinkPayload(nextSavedLinks);

        setNickname(savedNickname);
        setInitialNickname(savedNickname);
        setLinks(nextSavedLinks);
        setInitialLinks(nextSavedLinkPayload);

        setSuccessMessage("기본 정보가 변경되었습니다.");
        } catch (requestError) {
        setError(requestError?.message ?? "기본 정보를 변경하지 못했습니다.");
        } finally {
        setIsSaving(false);
        }
    };

    const renderBasicSettings = () => {
        if (isLoading) {
        return (
            <p className={styles.statusText}>기본 정보를 불러오는 중입니다.</p>
        );
        }

        return (
        <>
            <div className={styles.contentHeader}>
            <h1>기본 정보 변경</h1>
            <p>기본 카드의 닉네임과 링크를 변경합니다.</p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
                <label htmlFor="nickname">닉네임</label>

                <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(event) => {
                    setNickname(event.target.value);
                    clearMessages();
                }}
                maxLength={255}
                placeholder="닉네임을 입력해주세요"
                />
            </div>

            <div className={`${styles.field} ${styles.linkField}`}>
                <div className={styles.linkHeader}>
                <label>링크</label>
                <span>{currentLinkPayload.length}/4</span>
                </div>

                <div className={styles.linkList}>
                {links.map((link, index) => (
                    <div className={styles.linkRow} key={index}>
                    <div className={styles.linkTypeWrap}>
                        <select
                        className={styles.linkTypeSelect}
                        value={link.type}
                        onChange={(event) =>
                            handleLinkChange(index, "type", event.target.value)
                        }
                        aria-label={`${index + 1}번째 링크 종류`}
                        >
                        {LINK_TYPES.map((linkType) => (
                            <option value={linkType.type} key={linkType.type}>
                            {linkType.label}
                            </option>
                        ))}
                        </select>
                    </div>

                    <input
                        className={styles.linkInput}
                        type="text"
                        value={link.value}
                        onChange={(event) =>
                        handleLinkChange(index, "value", event.target.value)
                        }
                        placeholder="이메일, 포트폴리오 주소 등을 입력해주세요"
                    />

                    <button
                        type="button"
                        className={styles.removeLinkButton}
                        onClick={() => handleRemoveLink(index)}
                        aria-label={`${index + 1}번째 링크 삭제`}
                    >
                        삭제
                    </button>
                    </div>
                ))}
                </div>

                <button
                type="button"
                className={styles.addLinkButton}
                onClick={handleAddLink}
                disabled={links.length >= 4}
                >
                + 링크 추가
                </button>
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

            <button
                type="submit"
                className={styles.submitButton}
                disabled={isSaving}
            >
                {isSaving ? "변경 중..." : "변경하기"}
            </button>
            </form>
        </>
        );
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
            <p>계정과 관련된 설정을 관리합니다.</p>
            </div>

            {error && (
            <p className={styles.error} role="alert">
                {error}
            </p>
            )}

            <div className={styles.accountInfo}>
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
                className={activeSection === "basic" ? styles.activeSideItem : ""}
                onClick={() => moveToPath("/settings")}
            >
                기본 정보 변경
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
            {activeSection === "basic" && renderBasicSettings()}
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
