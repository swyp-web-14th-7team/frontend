import { useEffect } from "react";
import { createPortal } from "react-dom";

import { getSocialLoginUrl } from "../../../api/auth";

import styles from "./LoginModal.module.css";

const CloseIcon = () => {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
        >
            <path
                d="M6 6L18 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />

            <path
                d="M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
};

const KakaoIcon = () => {
    return (
        <span
            className={`${styles.socialIcon} ${styles.kakaoIcon}`}
            aria-hidden="true"
        >
            TALK
        </span>
    );
};

const GoogleIcon = () => {
    return (
        <span
            className={`${styles.socialIcon} ${styles.googleIcon}`}
            aria-hidden="true"
        >
            G
        </span>
    );
};

const NaverIcon = () => {
    return (
        <span
            className={`${styles.socialIcon} ${styles.naverIcon}`}
            aria-hidden="true"
        >
            N
        </span>
    );
};

const LoginModal = ({
    isOpen,
    onClose,
}) => {
    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown,
        );

        return () => {
            document.body.style.overflow =
                previousOverflow;

            window.removeEventListener(
                "keydown",
                handleKeyDown,
            );
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    const handleBackdropClick = (event) => {
        if (
            event.target === event.currentTarget
        ) {
            onClose();
        }
    };

    const handleSocialLogin = async (
        provider,
    ) => {
        try {
            const url =
                await getSocialLoginUrl(provider);

            window.location.href = url;
        } catch (error) {
            console.error(error);

            alert(
                "로그인 요청 중 문제가 발생했습니다.",
            );
        }
    };

    return createPortal(
        <div
            className={styles.backdrop}
            onMouseDown={handleBackdropClick}
            role="presentation"
        >
            <section
                className={styles.modal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="login-modal-title"
            >
                <button
                    type="button"
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="로그인 모달 닫기"
                >
                    <CloseIcon />
                </button>

                <div className={styles.logo}>
                    <span className={styles.logoMark}>
                        ♪
                    </span>

                    <span>Nodi</span>
                </div>

                <h2
                    id="login-modal-title"
                    className={styles.title}
                >
                    로그인
                </h2>

                <p className={styles.description}>
                    노디와 함께 나를 똑똑하게
                    소개하고 새로운 연결을 맺어봐요!
                </p>

                <div className={styles.buttonList}>
                    <button
                        type="button"
                        className={`${styles.loginButton} ${styles.kakaoButton}`}
                        onClick={() =>
                            handleSocialLogin(
                                "kakao",
                            )
                        }
                    >
                        <KakaoIcon />

                        <span>
                            카카오톡으로 계속하기
                        </span>
                    </button>

                    <button
                        type="button"
                        className={`${styles.loginButton} ${styles.googleButton}`}
                        onClick={() =>
                            handleSocialLogin(
                                "google",
                            )
                        }
                    >
                        <GoogleIcon />

                        <span>
                            Google로 계속하기
                        </span>
                    </button>

                    <button
                        type="button"
                        className={`${styles.loginButton} ${styles.naverButton}`}
                        onClick={() =>
                            handleSocialLogin(
                                "naver",
                            )
                        }
                    >
                        <NaverIcon />

                        <span>
                            네이버로 계속하기
                        </span>
                    </button>
                </div>
            </section>
        </div>,
        document.body,
    );
};

export default LoginModal;