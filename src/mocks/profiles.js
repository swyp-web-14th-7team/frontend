    const strengthTypes = [
    {
        title: "실행력 MAX 리더",
        description: "목표를 정하면 끝까지 실행해요.",
        icon: null,
    },
    {
        title: "소통왕",
        description: "협업을 즐겨요.",
        icon: null,
    },
    {
        title: "아이디어 뱅크",
        description: "새로운 아이디어를 좋아해요.",
        icon: null,
    },
    {
        title: "꼼꼼한 분석가",
        description: "디테일을 중요하게 생각해요.",
        icon: null,
    },
    ];

    const profiles = [
    {
        id: 1,
        createdAt: "2026-07-01T09:00:00",

        name: "이유진",
        job: "planner",

        purposes: ["팀 빌딩", "커피챗"],

        affiliationType: "재학생",
        affiliation: "성균관대학교",

        profileImage: null,

        techStacks: [],

        interests: [
        { id: "interest-1", name: "서비스 기획" },
        { id: "interest-2", name: "AI" },
        { id: "interest-3", name: "UX" },
        ],

        tools: [
        { id: "tool-1", name: "Notion" },
        { id: "tool-2", name: "Jira" },
        { id: "tool-3", name: "Figma" },
        ],

        representativeExperience: "교내 창업 프로젝트 PM",

        representativeExperienceDescription:
        "사용자 리서치부터 기능 정의와 일정 관리까지 프로젝트 전반을 기획했습니다.",

        strength: strengthTypes[0],
    },

    {
        id: 2,
        createdAt: "2026-07-02T10:00:00",

        name: "김서연",
        job: "designer",

        purposes: ["커피챗", "교류/네트워킹"],

        affiliationType: "프리랜서",
        affiliation: "브랜드 디자이너",

        profileImage: null,

        techStacks: [],

        interests: [
        { id: "interest-4", name: "브랜딩" },
        { id: "interest-5", name: "UI 디자인" },
        { id: "interest-6", name: "사용자 리서치" },
        ],

        tools: [
        { id: "tool-4", name: "Figma" },
        { id: "tool-5", name: "Photoshop" },
        { id: "tool-6", name: "Illustrator" },
        ],

        representativeExperience: "라이프스타일 브랜드 리뉴얼",

        representativeExperienceDescription:
        "브랜드 아이덴티티와 주요 서비스 화면을 새롭게 설계했습니다.",

        strength: strengthTypes[2],
    },

    {
        id: 3,
        createdAt: "2026-07-03T11:00:00",

        name: "박지민",
        job: "frontend",

        purposes: ["팀 빌딩"],

        affiliationType: "직장인",
        affiliation: "네이버",

        profileImage: null,

        techStacks: [
        { id: "skill-1", name: "React" },
        { id: "skill-2", name: "TypeScript" },
        { id: "skill-3", name: "Next.js" },
        ],

        interests: [],

        tools: [
        { id: "tool-7", name: "Git" },
        { id: "tool-8", name: "GitHub" },
        { id: "tool-9", name: "Slack" },
        ],

        representativeExperience: "사내 디자인 시스템 구축",

        representativeExperienceDescription:
        "React와 TypeScript 기반 공통 컴포넌트를 개발하고 문서화했습니다.",

        strength: strengthTypes[1],
    },

    {
        id: 4,
        createdAt: "2026-07-04T12:00:00",

        name: "이수현",
        job: "backend",

        purposes: ["팀 빌딩", "커피챗"],

        affiliationType: "직장인",
        affiliation: "카카오",

        profileImage: null,

        techStacks: [
        { id: "skill-4", name: "Spring" },
        { id: "skill-5", name: "Java" },
        { id: "skill-6", name: "MySQL" },
        ],

        interests: [],

        tools: [
        { id: "tool-10", name: "Git" },
        { id: "tool-11", name: "GitHub" },
        { id: "tool-12", name: "Jira" },
        ],

        representativeExperience: "대용량 API 서버 개발",

        representativeExperienceDescription:
        "대규모 요청을 안정적으로 처리하도록 API와 데이터베이스 구조를 개선했습니다.",

        strength: strengthTypes[3],
    },

    {
        id: 5,
        createdAt: "2026-07-05T13:00:00",

        name: "최민서",
        job: "designer",

        purposes: ["교류/네트워킹"],

        affiliationType: "프리랜서",
        affiliation: "UI/UX 디자이너",

        profileImage: null,

        techStacks: [],

        interests: [
        { id: "interest-7", name: "브랜딩" },
        { id: "interest-8", name: "UX" },
        { id: "interest-9", name: "UI 디자인" },
        ],

        tools: [
        { id: "tool-13", name: "Figma" },
        { id: "tool-14", name: "Photoshop" },
        { id: "tool-15", name: "Illustrator" },
        ],

        representativeExperience: "핀테크 앱 리디자인",

        representativeExperienceDescription:
        "사용자 흐름을 개선하고 디자인 시스템을 적용해 주요 화면을 리디자인했습니다.",

        strength: strengthTypes[3],
    },

    {
        id: 6,
        createdAt: "2026-07-06T14:00:00",

        name: "정하늘",
        job: "planner",

        purposes: ["팀 빌딩", "교류/네트워킹"],

        affiliationType: "취준생",
        affiliation: "서비스 기획",

        profileImage: null,

        techStacks: [],

        interests: [
        { id: "interest-10", name: "이커머스" },
        { id: "interest-11", name: "데이터 분석" },
        { id: "interest-12", name: "자동화 효율화" },
        ],

        tools: [
        { id: "tool-16", name: "Notion" },
        { id: "tool-17", name: "Figma" },
        { id: "tool-18", name: "GA4" },
        ],

        representativeExperience: "구독 관리 서비스 기획",

        representativeExperienceDescription:
        "사용자 문제를 정의하고 핵심 기능과 서비스 흐름을 설계했습니다.",

        strength: strengthTypes[0],
    },

    {
        id: 7,
        createdAt: "2026-07-07T15:00:00",

        name: "강민준",
        job: "frontend",

        purposes: ["커피챗"],

        affiliationType: "재학생",
        affiliation: "숭실대학교",

        profileImage: null,

        techStacks: [
        { id: "skill-7", name: "Vue" },
        { id: "skill-8", name: "JavaScript" },
        { id: "skill-9", name: "Nuxt.js" },
        ],

        interests: [],

        tools: [
        { id: "tool-19", name: "Git" },
        { id: "tool-20", name: "GitHub" },
        { id: "tool-21", name: "Notion" },
        ],

        representativeExperience: "학과 커뮤니티 웹 개발",

        representativeExperienceDescription:
        "Vue 기반으로 게시판과 사용자 프로필 기능을 구현했습니다.",

        strength: strengthTypes[2],
    },

    {
        id: 8,
        createdAt: "2026-07-08T16:00:00",

        name: "오지훈",
        job: "backend",

        purposes: ["팀 빌딩", "교류/네트워킹"],

        affiliationType: "직장인",
        affiliation: "배달의민족",

        profileImage: null,

        techStacks: [
        { id: "skill-10", name: "Kotlin" },
        { id: "skill-11", name: "Spring" },
        { id: "skill-12", name: "PostgreSQL" },
        ],

        interests: [],

        tools: [
        { id: "tool-22", name: "GitHub" },
        { id: "tool-23", name: "Jira" },
        { id: "tool-24", name: "Slack" },
        ],

        representativeExperience: "주문 처리 서버 개선",

        representativeExperienceDescription:
        "주문 처리 과정의 병목 구간을 개선해 응답 속도를 높였습니다.",

        strength: strengthTypes[3],
    },

    {
        id: 9,
        createdAt: "2026-07-09T09:30:00",

        name: "한예린",
        job: "designer",

        purposes: ["팀 빌딩", "커피챗"],

        affiliationType: "재학생",
        affiliation: "홍익대학교",

        profileImage: null,

        techStacks: [],

        interests: [
        { id: "interest-13", name: "UX 디자인" },
        { id: "interest-14", name: "모바일 앱" },
        { id: "interest-15", name: "사용자 리서치" },
        ],

        tools: [
        { id: "tool-25", name: "Figma" },
        { id: "tool-26", name: "Protopie" },
        { id: "tool-27", name: "MazeUT" },
        ],

        representativeExperience: "대학생 커뮤니티 UX 개선",

        representativeExperienceDescription:
        "사용성 테스트를 진행하고 핵심 화면의 정보 구조를 개선했습니다.",

        strength: strengthTypes[1],
    },

    {
        id: 10,
        createdAt: "2026-07-10T10:30:00",

        name: "윤도현",
        job: "planner",

        purposes: ["교류/네트워킹"],

        affiliationType: "휴학생",
        affiliation: "연세대학교",

        profileImage: null,

        techStacks: [],

        interests: [
        { id: "interest-16", name: "AI" },
        { id: "interest-17", name: "콘텐츠" },
        { id: "interest-18", name: "커뮤니티" },
        ],

        tools: [
        { id: "tool-28", name: "Notion" },
        { id: "tool-29", name: "Jira" },
        { id: "tool-30", name: "Miro" },
        ],

        representativeExperience: "콘텐츠 추천 서비스 기획",

        representativeExperienceDescription:
        "사용자 취향 데이터를 기반으로 추천 흐름과 기능을 기획했습니다.",

        strength: strengthTypes[2],
    },

    {
        id: 11,
        createdAt: "2026-07-11T11:30:00",

        name: "배서준",
        job: "frontend",

        purposes: ["팀 빌딩", "커피챗", "교류/네트워킹"],

        affiliationType: "취준생",
        affiliation: "프론트엔드 개발자",

        profileImage: null,

        techStacks: [
        { id: "skill-13", name: "React" },
        { id: "skill-14", name: "JavaScript" },
        { id: "skill-15", name: "TypeScript" },
        ],

        interests: [],

        tools: [
        { id: "tool-31", name: "Git" },
        { id: "tool-32", name: "GitHub" },
        { id: "tool-33", name: "Figma" },
        ],

        representativeExperience: "사이드 프로젝트 프론트엔드 개발",

        representativeExperienceDescription:
        "반응형 화면과 사용자 인증 흐름을 구현했습니다.",

        strength: strengthTypes[0],
    },

    {
        id: 12,
        createdAt: "2026-07-12T12:30:00",

        name: "송지아",
        job: "backend",

        purposes: ["커피챗"],

        affiliationType: "프리랜서",
        affiliation: "백엔드 개발자",

        profileImage: null,

        techStacks: [
        { id: "skill-16", name: "Python" },
        { id: "skill-17", name: "Django" },
        { id: "skill-18", name: "MySQL" },
        ],

        interests: [],

        tools: [
        { id: "tool-34", name: "GitHub" },
        { id: "tool-35", name: "Notion" },
        { id: "tool-36", name: "Slack" },
        ],

        representativeExperience: "예약 서비스 API 개발",

        representativeExperienceDescription:
        "예약 생성과 취소, 사용자 인증 API를 구현했습니다.",

        strength: strengthTypes[1],
    },

    {
        id: 13,
        createdAt: "2026-07-13T13:30:00",

        name: "문채원",
        job: "designer",

        purposes: ["팀 빌딩"],

        affiliationType: "직장인",
        affiliation: "스타트업 디자이너",

        profileImage: null,

        techStacks: [],

        interests: [
        { id: "interest-19", name: "브랜딩" },
        { id: "interest-20", name: "UI 디자인" },
        { id: "interest-21", name: "디자인 시스템" },
        ],

        tools: [
        { id: "tool-37", name: "Figma" },
        { id: "tool-38", name: "Illustrator" },
        { id: "tool-39", name: "Framer" },
        ],

        representativeExperience: "스타트업 디자인 시스템 구축",

        representativeExperienceDescription:
        "서비스 전반에 적용할 공통 컴포넌트와 디자인 원칙을 정리했습니다.",

        strength: strengthTypes[3],
    },

    {
        id: 14,
        createdAt: "2026-07-14T14:30:00",

        name: "임태윤",
        job: "planner",

        purposes: ["커피챗", "교류/네트워킹"],

        affiliationType: "직장인",
        affiliation: "핀테크 스타트업",

        profileImage: null,

        techStacks: [],

        interests: [
        { id: "interest-22", name: "핀테크" },
        { id: "interest-23", name: "데이터 분석" },
        { id: "interest-24", name: "서비스 기획" },
        ],

        tools: [
        { id: "tool-40", name: "Notion" },
        { id: "tool-41", name: "Jira" },
        { id: "tool-42", name: "Amplitude" },
        ],

        representativeExperience: "간편결제 서비스 개선",

        representativeExperienceDescription:
        "결제 이탈 데이터를 분석하고 사용자 흐름을 개선했습니다.",

        strength: strengthTypes[0],
    },

    {
        id: 15,
        createdAt: "2026-07-15T15:30:00",

        name: "조현우",
        job: "frontend",

        purposes: ["팀 빌딩", "교류/네트워킹"],

        affiliationType: "프리랜서",
        affiliation: "웹 프론트엔드 개발자",

        profileImage: null,

        techStacks: [
        { id: "skill-19", name: "Next.js" },
        { id: "skill-20", name: "TypeScript" },
        { id: "skill-21", name: "React" },
        ],

        interests: [],

        tools: [
        { id: "tool-43", name: "Git" },
        { id: "tool-44", name: "GitHub" },
        { id: "tool-45", name: "Slack" },
        ],

        representativeExperience: "기업 소개 웹사이트 개발",

        representativeExperienceDescription:
        "Next.js를 활용해 반응형 페이지와 콘텐츠 관리 기능을 구현했습니다.",

        strength: strengthTypes[2],
    },

    {
        id: 16,
        createdAt: "2026-07-16T16:30:00",

        name: "신다은",
        job: "backend",

        purposes: ["팀 빌딩", "커피챗", "교류/네트워킹"],

        affiliationType: "재학생",
        affiliation: "상명대학교",

        profileImage: null,

        techStacks: [
        { id: "skill-22", name: "Java" },
        { id: "skill-23", name: "Spring" },
        { id: "skill-24", name: "MySQL" },
        ],

        interests: [],

        tools: [
        { id: "tool-46", name: "GitHub" },
        { id: "tool-47", name: "Jira" },
        { id: "tool-48", name: "Notion" },
        ],

        representativeExperience: "팀 빌딩 플랫폼 서버 개발",

        representativeExperienceDescription:
        "회원 인증과 프로필 탐색 API를 개발했습니다.",

        strength: strengthTypes[1],
    },
    ];

    export default profiles;