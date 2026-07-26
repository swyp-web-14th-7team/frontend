    import {
    useEffect,
    useState,
    } from "react";

    import {
    createPortal,
    } from "react-dom";

    import {
    getSocialLoginUrl,
    } from "../../../api/auth";

    import logo from "../../../assets/icons/Logo.svg";

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
            d="M5 5L19 19"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
        />

        <path
            d="M19 5L5 19"
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
        className={
            styles.kakaoIcon
        }
        aria-hidden="true"
        >
        TALK
        </span>
    );
    };

    const GoogleIcon = () => {
    return (
        <svg
        className={
            styles.socialSvgIcon
        }
        viewBox="0 0 24 24"
        aria-hidden="true"
        >
        <path
            fill="#4285F4"
            d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.08 3.56-5.16 3.56-8.65Z"
        />

        <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.87-3a7.18 7.18 0 0 1-10.68-3.78h-4v3.1A12 12 0 0 0 12 24Z"
        />

        <path
            fill="#FBBC05"
            d="M5.38 14.31a7.2 7.2 0 0 1 0-4.62v-3.1h-4a12 12 0 0 0 0 10.82l4-3.1Z"
        />

        <path
            fill="#EA4335"
            d="M12 4.77a6.5 6.5 0 0 1 4.6 1.8l3.42-3.42A11.48 11.48 0 0 0 12 0 12 12 0 0 0 1.38 6.59l4 3.1A7.16 7.16 0 0 1 12 4.77Z"
        />
        </svg>
    );
    };

    const NaverIcon = () => {
    return (
        <span
        className={
            styles.naverIcon
        }
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
    const [
        loadingProvider,
        setLoadingProvider,
    ] = useState(null);

    useEffect(() => {
        if (!isOpen) {
        return undefined;
        }

        const previousOverflow =
        document.body.style.overflow;

        document.body.style.overflow =
        "hidden";

        const handleKeyDown = (
        event,
        ) => {
        if (
            event.key === "Escape" &&
            !loadingProvider
        ) {
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
    }, [
        isOpen,
        loadingProvider,
        onClose,
    ]);

    if (!isOpen) {
        return null;
    }

    const handleBackdropClick = (
        event,
    ) => {
        if (
        event.target ===
            event.currentTarget &&
        !loadingProvider
        ) {
        onClose();
        }
    };

    const handleSocialLogin =
        async (provider) => {
        if (loadingProvider) {
            return;
        }

        try {
            setLoadingProvider(provider);

            const url =
            await getSocialLoginUrl(
                provider,
            );

            if (!url) {
            throw new Error(
                "로그인 주소를 확인할 수 없습니다.",
            );
            }

            window.location.href = url;
        } catch (error) {
            console.error(
            "소셜 로그인 실패:",
            error,
            );

            alert(
            error?.message ||
                "로그인 요청 중 문제가 발생했습니다.",
            );

            setLoadingProvider(null);
        }
        };

    const isLoading =
        Boolean(loadingProvider);

    return createPortal(
        <div
        className={styles.backdrop}
        onMouseDown={
            handleBackdropClick
        }
        role="presentation"
        >
        <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-modal-title"
            aria-describedby="login-modal-description"
            onMouseDown={(event) =>
            event.stopPropagation()
            }
        >
            <button
            type="button"
            className={
                styles.closeButton
            }
            onClick={onClose}
            aria-label="로그인 모달 닫기"
            disabled={isLoading}
            >
            <CloseIcon />
            </button>

            <img
            src={logo}
            alt="NODI"
            className={styles.logo}
            />

            <h2
            id="login-modal-title"
            className={styles.title}
            >
            로그인
            </h2>

            <p
            id="login-modal-description"
            className={
                styles.description
            }
            >
            노디와 함께 나를 똑똑하게
            소개하고 새로운 연을
            맺어봐요!
            </p>

            <div
            className={
                styles.buttonList
            }
            >
            <button
                type="button"
                className={`${styles.loginButton} ${styles.kakaoButton}`}
                onClick={() =>
                handleSocialLogin(
                    "kakao",
                )
                }
                disabled={isLoading}
            >
                <KakaoIcon />

                <span>
                {loadingProvider ===
                "kakao"
                    ? "카카오 로그인 중..."
                    : "카카오톡으로 계속하기"}
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
                disabled={isLoading}
            >
                <GoogleIcon />

                <span>
                {loadingProvider ===
                "google"
                    ? "Google 로그인 중..."
                    : "Google로 계속하기"}
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
                disabled={isLoading}
            >
                <NaverIcon />

                <span>
                {loadingProvider ===
                "naver"
                    ? "네이버 로그인 중..."
                    : "네이버로 계속하기"}
                </span>
            </button>
            </div>
        </section>
        </div>,
        document.body,
    );
    };

    export default LoginModal;