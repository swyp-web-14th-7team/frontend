import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    QRCodeSVG,
} from "qrcode.react";

import {
    getMyProfileCards,
    updateProfileCard,
} from "../../api/profile";

import {
    getPurposes,
} from "../../api/options";

import {
    mapProfileCards,
} from "../../utils/profileMapper";

import {
    createDraftId,
    getOnboardingDrafts,
} from "../../utils/onboardingDraft";

import ExploreProfileCard from "../../components/profile/ExploreProfileCard";

import shareIcon from "../../assets/icons/icon_share.svg";

import cardStyles from "../../components/profile/ProfileCard.module.css";
import styles from "./MyPage.module.css";

const JOB_LABEL_MAP = {
    planner: "Planner",
    designer: "Designer",

    frontend:
        "Frontend Developer",

    backend:
        "Backend Developer",
};

const getJobLabel = (
    job,
) => {
    return (
        JOB_LABEL_MAP[job] ||
        job ||
        "직군 미설정"
    );
};

const getPurposeName = (
    purpose,
) => {
    if (
        typeof purpose ===
        "string"
    ) {
        return purpose;
    }

    return (
        purpose?.name ||
        ""
    );
};

const getProfilePurposeName = (
    profile,
) => {
    return getPurposeName(
        profile?.purposes?.[0],
    );
};

const MyPage = () => {
    const navigate =
        useNavigate();

    const [
        profiles,
        setProfiles,
    ] = useState([]);

    const [
        purposes,
        setPurposes,
    ] = useState([]);

    const [
        selectedIndex,
        setSelectedIndex,
    ] = useState(0);

    const [
        flippedProfileId,
        setFlippedProfileId,
    ] = useState(null);

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    const [
        isAddMenuOpen,
        setIsAddMenuOpen,
    ] = useState(false);

    const [
        isVisibilityModalOpen,
        setIsVisibilityModalOpen,
    ] = useState(false);

    const [
        selectedPurposeId,
        setSelectedPurposeId,
    ] = useState("");

    const [
        selectedIsActive,
        setSelectedIsActive,
    ] = useState(false);

    const [
        isSavingVisibility,
        setIsSavingVisibility,
    ] = useState(false);

    const [
        copyMessage,
        setCopyMessage,
    ] = useState("");

    const [
        isDraftModalOpen,
        setIsDraftModalOpen,
    ] = useState(false);

    const [
        onboardingDrafts,
        setOnboardingDrafts,
    ] = useState([]);

    const [
        selectedDraftId,
        setSelectedDraftId,
    ] = useState("");

    const selectedProfile =
        profiles[
            selectedIndex
        ] || null;

    const previousProfile =
        selectedIndex > 0
            ? profiles[
                  selectedIndex - 1
              ]
            : null;

    const nextProfile =
        selectedIndex <
        profiles.length - 1
            ? profiles[
                  selectedIndex + 1
              ]
            : null;

    const isSelectedCardFlipped =
        flippedProfileId ===
        selectedProfile?.id;

    const profileShareUrl =
        selectedProfile
            ? `${window.location.origin}/profile/${selectedProfile.id}`
            : "";

    useEffect(() => {
        let isMounted = true;

        const loadMyPageData =
            async () => {
                try {
                    setIsLoading(
                        true,
                    );

                    setError("");

                    const [
                        profileResult,
                        purposeResult,
                    ] =
                        await Promise.all(
                            [
                                getMyProfileCards(),
                                getPurposes(),
                            ],
                        );

                    if (!isMounted) {
                        return;
                    }

                    const profileItems =
                        Array.isArray(
                            profileResult,
                        )
                            ? profileResult
                            : profileResult
                                  ?.items ??
                              profileResult
                                  ?.data
                                  ?.items ??
                              [];

                    const purposeItems =
                        Array.isArray(
                            purposeResult,
                        )
                            ? purposeResult
                            : purposeResult
                                  ?.items ??
                              purposeResult
                                  ?.data
                                  ?.items ??
                              [];

                    const mappedProfiles =
                        mapProfileCards(
                            profileItems,
                        );

                    setProfiles(
                        mappedProfiles,
                    );

                    setPurposes(
                        purposeItems,
                    );

                    const defaultIndex =
                        mappedProfiles.findIndex(
                            (profile) =>
                                profile.isDefault,
                        );

                    setSelectedIndex(
                        defaultIndex >= 0
                            ? defaultIndex
                            : 0,
                    );
                } catch (
                    requestError
                ) {
                    if (!isMounted) {
                        return;
                    }

                    setError(
                        requestError
                            ?.message ||
                            "내 프로필 정보를 불러오지 못했습니다.",
                    );
                } finally {
                    if (isMounted) {
                        setIsLoading(
                            false,
                        );
                    }
                }
            };

        loadMyPageData();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleSelectIndex = (
        index,
    ) => {
        setSelectedIndex(index);

        setFlippedProfileId(
            null,
        );

        setCopyMessage("");
    };

    const handleCreateProfile =
        () => {
            const draftId =
                createDraftId();

            setIsAddMenuOpen(
                false,
            );

            navigate(
                `/onboarding?mode=create&draftId=${draftId}`,
            );
        };

    const handleOpenDraftModal =
        () => {
            const savedDrafts =
                getOnboardingDrafts();

            setOnboardingDrafts(
                savedDrafts,
            );

            setSelectedDraftId(
                savedDrafts[0]?.id ||
                    "",
            );

            setIsAddMenuOpen(
                false,
            );

            setIsDraftModalOpen(
                true,
            );
        };

    const handleCloseDraftModal =
        () => {
            setIsDraftModalOpen(
                false,
            );

            setSelectedDraftId(
                "",
            );
        };

    const handleContinueDraft =
        () => {
            if (!selectedDraftId) {
                return;
            }

            navigate(
                `/onboarding?mode=resume&draftId=${selectedDraftId}`,
            );
        };

    const handleProfileDetail =
        (profile) => {
            if (!profile) {
                return;
            }

            navigate(
                `/my-profile/${profile.id}`,
            );
        };

    const handleFlipCard = (
        event,
    ) => {
        event?.stopPropagation();

        if (
            !selectedProfile ||
            !selectedProfile
                .isActive
        ) {
            return;
        }

        setCopyMessage("");

        setFlippedProfileId(
            (
                currentProfileId,
            ) =>
                currentProfileId ===
                selectedProfile.id
                    ? null
                    : selectedProfile.id,
        );
    };

    const handleCopyLink =
        async () => {
            if (!profileShareUrl) {
                return;
            }

            try {
                await navigator.clipboard.writeText(
                    profileShareUrl,
                );

                setCopyMessage(
                    "링크를 복사했어요.",
                );
            } catch {
                setCopyMessage(
                    "링크를 복사하지 못했어요.",
                );
            }
        };

    const handleOpenVisibilityModal =
        () => {
            if (
                !selectedProfile
            ) {
                return;
            }

            const currentPurposeName =
                getProfilePurposeName(
                    selectedProfile,
                );

            const currentPurpose =
                purposes.find(
                    (purpose) =>
                        purpose.name ===
                        currentPurposeName,
                );

            setSelectedPurposeId(
                currentPurpose?.id
                    ? String(
                          currentPurpose.id,
                      )
                    : "",
            );

            setSelectedIsActive(
                selectedProfile
                    .isActive,
            );

            setError("");

            setIsVisibilityModalOpen(
                true,
            );
        };

    const handleCloseVisibilityModal =
        () => {
            if (
                isSavingVisibility
            ) {
                return;
            }

            setIsVisibilityModalOpen(
                false,
            );
        };

    const handleSaveVisibility =
        async () => {
            if (
                !selectedProfile ||
                isSavingVisibility
            ) {
                return;
            }

            if (
                selectedIsActive &&
                !selectedPurposeId
            ) {
                setError(
                    "프로필을 공개하려면 목적을 선택해주세요.",
                );

                return;
            }

            try {
                setIsSavingVisibility(
                    true,
                );

                setError("");

                const requestBody = {
                    isActive:
                        selectedIsActive,
                };

                if (
                    selectedPurposeId
                ) {
                    requestBody.purposeId =
                        Number(
                            selectedPurposeId,
                        );
                }

                await updateProfileCard(
                    selectedProfile.id,
                    requestBody,
                );

                const selectedPurpose =
                    purposes.find(
                        (purpose) =>
                            String(
                                purpose.id,
                            ) ===
                            String(
                                selectedPurposeId,
                            ),
                    );

                setProfiles(
                    (
                        currentProfiles,
                    ) =>
                        currentProfiles.map(
                            (profile) =>
                                profile.id ===
                                selectedProfile.id
                                    ? {
                                          ...profile,

                                          isActive:
                                              selectedIsActive,

                                          purposes:
                                              selectedPurpose
                                                  ? [
                                                        selectedPurpose.name,
                                                    ]
                                                  : profile.purposes,
                                      }
                                    : profile,
                        ),
                );

                if (
                    !selectedIsActive
                ) {
                    setFlippedProfileId(
                        null,
                    );
                }

                setIsVisibilityModalOpen(
                    false,
                );
            } catch (
                requestError
            ) {
                setError(
                    requestError
                        ?.message ||
                        "공개 설정을 저장하지 못했습니다.",
                );
            } finally {
                setIsSavingVisibility(
                    false,
                );
            }
        };

    const renderSideCard = (
        profile,
    ) => {
        if (!profile) {
            return null;
        }

        const profileIndex =
            profiles.findIndex(
                (item) =>
                    item.id ===
                    profile.id,
            );

        return (
            <div
                className={
                    styles.sideCardShell
                }
            >
                <ExploreProfileCard
                    profile={profile}
                    onClick={() =>
                        handleSelectIndex(
                            profileIndex,
                        )
                    }
                />
            </div>
        );
    };

    if (isLoading) {
        return (
            <main
                className={
                    styles.page
                }
            >
                <div
                    className={
                        styles.statusMessage
                    }
                >
                    프로필 카드를
                    불러오는 중입니다.
                </div>
            </main>
        );
    }

    return (
        <main
            className={
                styles.page
            }
        >
            <section
                className={
                    styles.container
                }
            >
                <div
                    className={
                        styles.titleRow
                    }
                >
                    <h1
                        className={
                            styles.title
                        }
                    >
                        내 카드
                    </h1>

                    <div
                        className={
                            styles.addArea
                        }
                    >
                        <button
                            type="button"
                            className={
                                styles.addButton
                            }
                            onClick={() =>
                                setIsAddMenuOpen(
                                    (
                                        currentValue,
                                    ) =>
                                        !currentValue,
                                )
                            }
                            aria-expanded={
                                isAddMenuOpen
                            }
                        >
                            + 추가하기
                        </button>

                        {isAddMenuOpen && (
                            <div
                                className={
                                    styles.addMenu
                                }
                            >
                                <button
                                    type="button"
                                    onClick={
                                        handleCreateProfile
                                    }
                                >
                                    새 카드 만들기
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleOpenDraftModal
                                    }
                                >
                                    임시저장
                                    불러오기
                                </button>
                            </div>
                        )}
                    </div>
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

                {profiles.length ===
                0 ? (
                    <div
                        className={
                            styles.empty
                        }
                    >
                        <p>
                            아직 만든 프로필
                            카드가 없습니다.
                        </p>

                        <button
                            type="button"
                            onClick={
                                handleCreateProfile
                            }
                        >
                            첫 카드 만들기
                        </button>
                    </div>
                ) : (
                    <>
                        <div
                            className={
                                styles.carousel
                            }
                        >
                            <div
                                className={
                                    styles.sideSlot
                                }
                            >
                                {renderSideCard(
                                    previousProfile,
                                )}
                            </div>

                            <div
                                className={
                                    styles.centerSlot
                                }
                            >
                                <div
                                    className={
                                        styles.cardShell
                                    }
                                >
                                    {isSelectedCardFlipped ? (
                                        <article
                                            className={`${cardStyles.exploreCard} ${styles.qrCard}`}
                                        >
                                            <div
                                                className={
                                                    styles.qrHeader
                                                }
                                            >
                                                <span>
                                                    {getJobLabel(
                                                        selectedProfile
                                                            .job,
                                                    )}
                                                </span>

                                                <button
                                                    type="button"
                                                    className={
                                                        styles.flipButton
                                                    }
                                                    onClick={
                                                        handleFlipCard
                                                    }
                                                    aria-label="카드 앞면 보기"
                                                >
                                                    <img
                                                        src={
                                                            shareIcon
                                                        }
                                                        alt=""
                                                    />
                                                </button>
                                            </div>

                                            <div
                                                className={
                                                    styles.qrContainer
                                                }
                                            >
                                                <QRCodeSVG
                                                    value={
                                                        profileShareUrl
                                                    }
                                                    size={
                                                        205
                                                    }
                                                    level="H"
                                                    includeMargin
                                                />
                                            </div>

                                            <div
                                                className={
                                                    styles.qrActions
                                                }
                                            >
                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleCopyLink
                                                    }
                                                >
                                                    링크
                                                    복사
                                                </button>
                                            </div>

                                            {copyMessage && (
                                                <p
                                                    className={
                                                        styles.copyMessage
                                                    }
                                                    role="status"
                                                >
                                                    {
                                                        copyMessage
                                                    }
                                                </p>
                                            )}
                                        </article>
                                    ) : (
                                        <>
                                            <ExploreProfileCard
                                                profile={
                                                    selectedProfile
                                                }
                                                onClick={() =>
                                                    handleProfileDetail(
                                                        selectedProfile,
                                                    )
                                                }
                                            />

                                            {selectedProfile
                                                .isActive && (
                                                <button
                                                    type="button"
                                                    className={
                                                        styles.flipButton
                                                    }
                                                    onClick={
                                                        handleFlipCard
                                                    }
                                                    aria-label="QR 코드 보기"
                                                >
                                                    <img
                                                        src={
                                                            shareIcon
                                                        }
                                                        alt=""
                                                    />
                                                </button>
                                            )}

                                            {!selectedProfile
                                                .isActive && (
                                                <div
                                                    className={
                                                        styles.privateOverlay
                                                    }
                                                >
                                                    <strong>
                                                        프로필이
                                                        비공개
                                                        상태예요.
                                                    </strong>

                                                    <p>
                                                        프로필을
                                                        공개하면 QR
                                                        코드와 공유
                                                        링크를 생성할
                                                        수 있어요.
                                                    </p>

                                                    <button
                                                        type="button"
                                                        onClick={
                                                            handleOpenVisibilityModal
                                                        }
                                                    >
                                                        공개
                                                        설정하기
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            <div
                                className={
                                    styles.sideSlot
                                }
                            >
                                {renderSideCard(
                                    nextProfile,
                                )}
                            </div>
                        </div>

                        <div
                            className={
                                styles.badgeRow
                            }
                        >
                            <button
                                type="button"
                                className={`${styles.statusBadge} ${
                                    selectedProfile
                                        .isActive
                                        ? styles.activeStatusBadge
                                        : styles.inactiveStatusBadge
                                }`}
                                onClick={
                                    handleOpenVisibilityModal
                                }
                            >
                                {selectedProfile
                                    .isActive
                                    ? "공개"
                                    : "비공개"}
                            </button>

                            <span
                                className={
                                    styles.purposeBadge
                                }
                            >
                                {getProfilePurposeName(
                                    selectedProfile,
                                ) ||
                                    "목적 미설정"}
                            </span>
                        </div>

                        <div
                            className={
                                styles.pagination
                            }
                        >
                            {profiles.map(
                                (
                                    profile,
                                    index,
                                ) => (
                                    <button
                                        key={
                                            profile.id
                                        }
                                        type="button"
                                        className={`${styles.paginationDot} ${
                                            index ===
                                            selectedIndex
                                                ? styles.activeDot
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleSelectIndex(
                                                index,
                                            )
                                        }
                                        aria-label={`${index + 1}번째 카드 보기`}
                                    />
                                ),
                            )}
                        </div>
                    </>
                )}
            </section>

            {isVisibilityModalOpen && (
                <div
                    className={
                        styles.modalBackdrop
                    }
                    role="presentation"
                    onMouseDown={
                        handleCloseVisibilityModal
                    }
                >
                    <section
                        className={
                            styles.modal
                        }
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="visibility-modal-title"
                        onMouseDown={(
                            event,
                        ) =>
                            event.stopPropagation()
                        }
                    >
                        <div
                            className={
                                styles.modalHeader
                            }
                        >
                            <h2
                                id="visibility-modal-title"
                            >
                                공개 설정 변경
                            </h2>

                            <button
                                type="button"
                                className={
                                    styles.closeButton
                                }
                                onClick={
                                    handleCloseVisibilityModal
                                }
                                aria-label="모달 닫기"
                            >
                                ×
                            </button>
                        </div>

                        <div
                            className={
                                styles.modalBody
                            }
                        >
                            <div
                                className={
                                    styles.settingRow
                                }
                            >
                                <label
                                    htmlFor="profile-purpose"
                                >
                                    목적
                                </label>

                                <select
                                    id="profile-purpose"
                                    value={
                                        selectedPurposeId
                                    }
                                    onChange={(
                                        event,
                                    ) =>
                                        setSelectedPurposeId(
                                            event
                                                .target
                                                .value,
                                        )
                                    }
                                >
                                    <option value="">
                                        목적 선택
                                    </option>

                                    {purposes.map(
                                        (
                                            purpose,
                                        ) => (
                                            <option
                                                key={
                                                    purpose.id
                                                }
                                                value={
                                                    purpose.id
                                                }
                                            >
                                                {
                                                    purpose.name
                                                }
                                            </option>
                                        ),
                                    )}
                                </select>
                            </div>

                            <div
                                className={
                                    styles.settingRow
                                }
                            >
                                <span>
                                    공개
                                </span>

                                <button
                                    type="button"
                                    className={`${styles.toggle} ${
                                        selectedIsActive
                                            ? styles.toggleOn
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setSelectedIsActive(
                                            (
                                                currentValue,
                                            ) =>
                                                !currentValue,
                                        )
                                    }
                                    role="switch"
                                    aria-checked={
                                        selectedIsActive
                                    }
                                >
                                    <span
                                        className={
                                            styles.toggleText
                                        }
                                    >
                                        {selectedIsActive
                                            ? "ON"
                                            : "OFF"}
                                    </span>

                                    <span
                                        className={
                                            styles.toggleHandle
                                        }
                                    />
                                </button>
                            </div>
                        </div>

                        <button
                            type="button"
                            className={
                                styles.saveButton
                            }
                            onClick={
                                handleSaveVisibility
                            }
                            disabled={
                                isSavingVisibility
                            }
                        >
                            {isSavingVisibility
                                ? "저장 중..."
                                : "저장"}
                        </button>
                    </section>
                </div>
            )}

            {isDraftModalOpen && (
                <div
                    className={
                        styles.modalBackdrop
                    }
                    role="presentation"
                    onMouseDown={
                        handleCloseDraftModal
                    }
                >
                    <section
                        className={
                            styles.draftModal
                        }
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="draft-modal-title"
                        onMouseDown={(
                            event,
                        ) =>
                            event.stopPropagation()
                        }
                    >
                        <div
                            className={
                                styles.draftHeader
                            }
                        >
                            <h2
                                id="draft-modal-title"
                            >
                                임시저장 불러오기
                            </h2>

                            <button
                                type="button"
                                onClick={
                                    handleCloseDraftModal
                                }
                                aria-label="닫기"
                            >
                                ×
                            </button>
                        </div>

                        {onboardingDrafts.length ===
                        0 ? (
                            <p
                                className={
                                    styles.emptyDraft
                                }
                            >
                                임시저장된 카드가
                                없습니다.
                            </p>
                        ) : (
                            <div
                                className={
                                    styles.draftList
                                }
                            >
                                {onboardingDrafts.map(
                                    (
                                        draft,
                                    ) => (
                                        <button
                                            key={
                                                draft.id
                                            }
                                            type="button"
                                            className={`${styles.draftItem} ${
                                                selectedDraftId ===
                                                draft.id
                                                    ? styles.selectedDraft
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                setSelectedDraftId(
                                                    draft.id,
                                                )
                                            }
                                        >
                                            <span>
                                                {draft.title ||
                                                    "작성 중인 카드"}
                                            </span>

                                            <time>
                                                {draft.updatedAt
                                                    ? new Date(
                                                          draft.updatedAt,
                                                      ).toLocaleString(
                                                          "ko-KR",
                                                      )
                                                    : "저장 시간 없음"}
                                            </time>
                                        </button>
                                    ),
                                )}
                            </div>
                        )}

                        <button
                            type="button"
                            className={
                                styles.continueButton
                            }
                            disabled={
                                !selectedDraftId
                            }
                            onClick={
                                handleContinueDraft
                            }
                        >
                            이어쓰기
                        </button>
                    </section>
                </div>
            )}
        </main>
    );
};

export default MyPage;