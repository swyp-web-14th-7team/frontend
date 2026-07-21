export const ONBOARDING_DRAFT_KEY =
    "nodi:onboarding-drafts";

export const getOnboardingDrafts =
    () => {
        try {
            const savedDrafts =
                JSON.parse(
                    localStorage.getItem(
                        ONBOARDING_DRAFT_KEY,
                    ) || "[]",
                );

            return Array.isArray(
                savedDrafts,
            )
                ? savedDrafts
                : [];
        } catch {
            return [];
        }
    };

export const getOnboardingDraft =
    (draftId) => {
        return getOnboardingDrafts().find(
            (draft) =>
                draft.id === draftId,
        );
    };

export const createDraftId = () => {
    if (
        typeof crypto !==
            "undefined" &&
        crypto.randomUUID
    ) {
        return crypto.randomUUID();
    }

    return `draft-${Date.now()}-${Math.random()
        .toString(16)
        .slice(2)}`;
};

export const saveOnboardingDraft =
    ({
        id,
        step,
        data,
    }) => {
        const drafts =
            getOnboardingDrafts();

        const savedDraft = {
            id,
            step,

            data: {
                ...data,

                profileCardId:
                    null,

                createdProfile:
                    null,
            },

            title:
                data.jobLabel ||
                data.job ||
                "작성 중인 카드",

            updatedAt:
                new Date().toISOString(),
        };

        const draftIndex =
            drafts.findIndex(
                (draft) =>
                    draft.id === id,
            );

        if (draftIndex >= 0) {
            drafts[draftIndex] =
                savedDraft;
        } else {
            drafts.unshift(
                savedDraft,
            );
        }

        localStorage.setItem(
            ONBOARDING_DRAFT_KEY,
            JSON.stringify(drafts),
        );

        return savedDraft;
    };

export const removeOnboardingDraft =
    (draftId) => {
        const nextDrafts =
            getOnboardingDrafts().filter(
                (draft) =>
                    draft.id !==
                    draftId,
            );

        localStorage.setItem(
            ONBOARDING_DRAFT_KEY,
            JSON.stringify(
                nextDrafts,
            ),
        );
    };