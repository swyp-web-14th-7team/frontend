const myProfileCards = [
    {
        id: "my-card-1",
        createdAt:
            "2026-07-01T09:00:00",

        cardName: "팀 빌딩 카드",

        /*
         * public: 공개
         * private: 비공개
         */
        visibility: "public",

        /*
         * 사용자의 기본 카드 여부
         * 기본 카드는 한 장만 true
         */
        isDefault: true,

        name: "김노디",
        profileImage: null,

        job: "frontend",

        purposes: [
            "팀 빌딩",
            "사이드 프로젝트",
        ],

        affiliationType: "직장인",
        affiliation:
            "시리즈B 스타트업",

        introduction:
            "함께 서비스를 만들 팀원을 찾고 있는 프론트엔드 개발자입니다.",

        techStacks: [
            {
                id: "my-card-1-skill-1",
                name: "React",
            },
            {
                id: "my-card-1-skill-2",
                name: "TypeScript",
            },
            {
                id: "my-card-1-skill-3",
                name: "Next.js",
            },
        ],

        interests: [],

        tools: [
            {
                id: "my-card-1-tool-1",
                name: "GitHub",
            },
            {
                id: "my-card-1-tool-2",
                name: "Figma",
            },
            {
                id: "my-card-1-tool-3",
                name: "Notion",
            },
        ],

        representativeExperience:
            "노디: 편리한 자기소개, 간편한 연결",

        representativeExperienceDescription:
            "팀원 탐색과 스크랩 기능을 구현한 프로젝트입니다.",

        links: [
            {
                id: "my-card-1-link-1",
                type: "github",
                label: "GitHub",
                url: "https://github.com",
            },
            {
                id: "my-card-1-link-2",
                type: "blog",
                label: "Blog",
                url: "https://example.com",
            },
            {
                id: "my-card-1-link-3",
                type: "email",
                label: "Email",
                url: "mailto:nodi@example.com",
            },
        ],

        experiences: [
            {
                id: "my-card-1-experience-1",
                isRepresentative: true,

                title:
                    "노디: 편리한 자기소개, 간편한 연결",

                summary:
                    "팀원 탐색과 스크랩 기능을 구현한 프로젝트입니다.",

                description:
                    "프론트엔드 개발자로 참여해 프로필 탐색, 스크랩, 세부 프로필 화면을 구현했습니다.",

                url: "https://example.com/nodi",

                linkLabel:
                    "프로젝트 보러 가기",
            },
            {
                id: "my-card-1-experience-2",
                isRepresentative: false,

                title:
                    "팀 빌딩 서비스 개발",

                summary:
                    "사용자가 원하는 팀원을 탐색하고 연결할 수 있는 서비스를 개발했습니다.",

                description:
                    "검색 필터와 프로필 카드 UI를 구현하고 반응형 화면을 개발했습니다.",

                url: "https://example.com/team-building",

                linkLabel:
                    "서비스 보러 가기",
            },
        ],

        strength: {
            title: "실행력 MAX 리더",
            description:
                "목표를 정하면 끝까지 실행해요.",
            icon: null,
        },
    },

    {
        id: "my-card-2",
        createdAt:
            "2026-07-02T10:00:00",

        cardName:
            "사이드 프로젝트 카드",

        visibility: "private",
        isDefault: false,

        name: "김노디",
        profileImage: null,

        job: "frontend",

        purposes: [
            "사이드 프로젝트",
            "커피챗",
        ],

        affiliationType: "직장인",
        affiliation:
            "시리즈B 스타트업",

        introduction:
            "재미있는 아이디어를 함께 구현할 사이드 프로젝트 팀원을 찾고 있습니다.",

        techStacks: [
            {
                id: "my-card-2-skill-1",
                name: "JavaScript",
            },
            {
                id: "my-card-2-skill-2",
                name: "Vue",
            },
            {
                id: "my-card-2-skill-3",
                name: "CSS",
            },
        ],

        interests: [],

        tools: [
            {
                id: "my-card-2-tool-1",
                name: "Git",
            },
            {
                id: "my-card-2-tool-2",
                name: "GitHub",
            },
            {
                id: "my-card-2-tool-3",
                name: "Slack",
            },
        ],

        representativeExperience:
            "사이드 프로젝트 프론트엔드 개발",

        representativeExperienceDescription:
            "사용자 인증과 반응형 화면을 구현했습니다.",

        links: [
            {
                id: "my-card-2-link-1",
                type: "github",
                label: "GitHub",
                url: "https://github.com",
            },
            {
                id: "my-card-2-link-2",
                type: "website",
                label: "Website",
                url: "https://example.com",
            },
        ],

        experiences: [
            {
                id: "my-card-2-experience-1",
                isRepresentative: true,

                title:
                    "사이드 프로젝트 프론트엔드 개발",

                summary:
                    "사용자 인증과 반응형 화면을 구현했습니다.",

                description:
                    "로그인과 회원가입 화면을 구현하고 모바일과 데스크톱에 대응하는 반응형 UI를 개발했습니다.",

                url: "https://example.com/side-project",

                linkLabel:
                    "프로젝트 보러 가기",
            },
            {
                id: "my-card-2-experience-2",
                isRepresentative: false,

                title:
                    "커뮤니티 웹 서비스",

                summary:
                    "게시글과 댓글을 작성할 수 있는 커뮤니티 서비스를 개발했습니다.",

                description:
                    "게시글 목록과 상세 화면, 댓글 작성 및 삭제 기능을 구현했습니다.",

                url: "https://example.com/community",

                linkLabel:
                    "서비스 보러 가기",
            },
        ],

        strength: {
            title: "아이디어 뱅크",
            description:
                "새로운 아이디어를 좋아해요.",
            icon: null,
        },
    },

    {
        id: "my-card-3",
        createdAt:
            "2026-07-03T11:00:00",

        cardName:
            "디자인 협업 카드",

        visibility: "public",
        isDefault: false,

        name: "김노디",
        profileImage: null,

        job: "designer",

        purposes: [
            "디자인 협업",
            "교류/네트워킹",
        ],

        affiliationType: "프리랜서",
        affiliation:
            "프로덕트 디자이너",

        introduction:
            "개발자와 원활하게 소통하며 사용자 중심의 제품을 설계합니다.",

        techStacks: [],

        interests: [
            {
                id: "my-card-3-interest-1",
                name: "UI 디자인",
            },
            {
                id: "my-card-3-interest-2",
                name: "UX",
            },
            {
                id: "my-card-3-interest-3",
                name: "브랜딩",
            },
        ],

        tools: [
            {
                id: "my-card-3-tool-1",
                name: "Figma",
            },
            {
                id: "my-card-3-tool-2",
                name: "Photoshop",
            },
            {
                id: "my-card-3-tool-3",
                name: "Illustrator",
            },
        ],

        representativeExperience:
            "서비스 디자인 시스템 구축",

        representativeExperienceDescription:
            "공통 컴포넌트와 디자인 원칙을 정리했습니다.",

        links: [
            {
                id: "my-card-3-link-1",
                type: "behance",
                label: "Behance",
                url: "https://www.behance.net",
            },
            {
                id: "my-card-3-link-2",
                type: "instagram",
                label: "Instagram",
                url: "https://www.instagram.com",
            },
            {
                id: "my-card-3-link-3",
                type: "email",
                label: "Email",
                url: "mailto:nodi@example.com",
            },
        ],

        experiences: [
            {
                id: "my-card-3-experience-1",
                isRepresentative: true,

                title:
                    "서비스 디자인 시스템 구축",

                summary:
                    "공통 컴포넌트와 디자인 원칙을 정리했습니다.",

                description:
                    "서비스 전반에 사용되는 색상, 타이포그래피, 버튼, 입력창과 카드 컴포넌트를 설계했습니다.",

                url: "https://www.behance.net",

                linkLabel:
                    "디자인 상세 보기",
            },
            {
                id: "my-card-3-experience-2",
                isRepresentative: false,

                title:
                    "모바일 앱 UX 개선",

                summary:
                    "사용자 테스트를 바탕으로 주요 화면의 사용성을 개선했습니다.",

                description:
                    "사용자 인터뷰와 사용성 테스트를 진행하고 핵심 화면의 정보 구조와 이동 흐름을 개선했습니다.",

                url: "https://example.com/mobile-ux",

                linkLabel:
                    "프로젝트 상세 보기",
            },
        ],

        strength: {
            title: "꼼꼼한 분석가",
            description:
                "디테일을 중요하게 생각해요.",
            icon: null,
        },
    },
];

export default myProfileCards;