import profiles from "./profiles";

const exchangeRequests = [
    {
        id: "exchange-request-1",
        status: "pending",
        isRead: false,
        createdAt: "2026-07-19T10:30:00",

        sender: {
            id: profiles[0].id,
            name: profiles[0].name,
            profileImage:
                profiles[0].profileImage,
        },

        receivedCard: profiles[0],

        message:
            "안녕하세요! AI 프로젝트 팀원을 찾고 있는데 관심 도메인이 겹쳐서 연락드렸어요. 저도 팀을 찾고 있어서 함께하면 좋을 것 같아요. 커피챗 나누면 좋을 것 같은데 언제든지 제 프로필 링크에 걸려있는 인스타로 디엠주시면 좋을 것 같아요.",
    },
    {
        id: "exchange-request-2",
        status: "pending",
        isRead: false,
        createdAt: "2026-07-19T09:10:00",

        sender: {
            id: profiles[2].id,
            name: profiles[2].name,
            profileImage:
                profiles[2].profileImage,
        },

        receivedCard: profiles[2],

        message:
            "안녕하세요. 함께 사이드 프로젝트를 진행해보고 싶어서 카드 교환 요청을 보냅니다.",
    },
    {
        id: "exchange-request-3",
        status: "pending",
        isRead: true,
        createdAt: "2026-07-18T16:20:00",

        sender: {
            id: profiles[4].id,
            name: profiles[4].name,
            profileImage:
                profiles[4].profileImage,
        },

        receivedCard: profiles[4],

        message:
            "프로필을 보고 관심 분야가 비슷해서 연락드렸어요. 편하게 이야기 나눠보고 싶습니다.",
    },
];

export default exchangeRequests;