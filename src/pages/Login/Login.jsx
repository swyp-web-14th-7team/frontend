import { getSocialLoginUrl } from "../../api/auth";

const Login = () => {
    const handleSocialLogin = async (provider) => {
        try {
            const url = await getSocialLoginUrl(provider);
            window.location.href = url;
        } catch (error) {
            console.error(error);
            alert("로그인 요청 중 문제가 발생했습니다.")
        }
    };

    return (
    <main>
        <h1>Nodi</h1>
        <p>나를 한 장의 카드로, 더 쉽고 인상 깊은 첫 만남</p>

        <button type="button" onClick={() => handleSocialLogin("google")}>Google로 계속하기</button>
        <button type="button" onClick={() => handleSocialLogin("Kakao")}>Kakao로 계속하기</button>
        <button type="button" onClick={() => handleSocialLogin("Naver")}>Naver로 계속하기</button>
    </main>
    );
};

export default Login;