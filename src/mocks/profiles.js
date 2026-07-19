const strengthTypes = [
    {
        title: "실행력 MAX 리더",
        description:
            "목표를 정하면 끝까지 실행해요.",
        icon: null,
    },
    {
        title: "소통왕",
        description: "협업을 즐겨요.",
        icon: null,
    },
    {
        title: "아이디어 뱅크",
        description:
            "새로운 아이디어를 좋아해요.",
        icon: null,
    },
    {
        title: "꼼꼼한 분석가",
        description:
            "디테일을 중요하게 생각해요.",
        icon: null,
    },
];

const createTags = (
    profileId,
    type,
    names,
) =>
    names.map((name, index) => ({
        id: `${type}-${profileId}-${index + 1}`,
        name,
    }));

const createLinks = (profileId) => [
    {
        id: `link-blog-${profileId}`,
        type: "blog",
        label: "Blog",
        url: `https://example.com/blog/${profileId}`,
    },
    {
        id: `link-github-${profileId}`,
        type: "github",
        label: "GitHub",
        url: "https://github.com",
    },
    {
        id: `link-behance-${profileId}`,
        type: "behance",
        label: "Behance",
        url: "https://www.behance.net",
    },
    {
        id: `link-instagram-${profileId}`,
        type: "instagram",
        label: "Instagram",
        url: "https://www.instagram.com",
    },
    {
        id: `link-email-${profileId}`,
        type: "email",
        label: "Email",
        url: `mailto:user${profileId}@example.com`,
    },
];

const createExperiences = (
    profileId,
    representativeTitle,
    representativeDescription,
) => [
    {
        id: `experience-${profileId}-1`,
        isRepresentative: true,
        title: representativeTitle,
        summary: representativeDescription,
        description:
            `${representativeDescription} 프로젝트의 목표를 정리하고 필요한 기능을 설계했습니다. 팀원들과 지속적으로 의견을 나누며 결과물을 개선했습니다.`,
        url: `https://example.com/project/${profileId}/1`,
        linkLabel: "프로젝트 보러 가기",
    },
    {
        id: `experience-${profileId}-2`,
        isRepresentative: false,
        title: "팀 프로젝트 참여",
        summary:
            "팀원들과 함께 서비스를 기획하고 제작했습니다.",
        description:
            "프로젝트 초기 기획부터 결과물 제작까지 참여했습니다. 팀원들과 역할을 나누고 정기적으로 진행 상황을 공유했습니다.",
        url: `https://example.com/project/${profileId}/2`,
        linkLabel: "서비스 보러 가기",
    },
    {
        id: `experience-${profileId}-3`,
        isRepresentative: false,
        title: "개인 프로젝트",
        summary:
            "관심 분야를 바탕으로 개인 프로젝트를 진행했습니다.",
        description:
            "사용자에게 필요한 기능을 직접 정의하고 설계부터 구현까지 진행했습니다. 프로젝트를 통해 새로운 도구와 기술을 학습했습니다.",
        url: `https://example.com/project/${profileId}/3`,
        linkLabel: "프로젝트 상세 보기",
    },
];

const PROFILE_DATA = [
    {
        id: 1,
        createdAt: "2026-07-01T09:00:00",
        name: "이유진",
        job: "planner",
        purposes: ["팀 빌딩", "커피챗"],
        affiliationType: "재학생",
        affiliation: "성균관대학교",
        techStacks: [],
        interests: [
            "서비스 기획",
            "AI",
            "UX",
        ],
        tools: ["Notion", "Jira", "Figma"],
        representativeExperience:
            "교내 창업 프로젝트 PM",
        representativeExperienceDescription:
            "사용자 리서치부터 기능 정의와 일정 관리까지 프로젝트 전반을 기획했습니다.",
        strengthIndex: 0,
    },
    {
        id: 2,
        createdAt: "2026-07-02T10:00:00",
        name: "김서연",
        job: "designer",
        purposes: [
            "커피챗",
            "교류/네트워킹",
        ],
        affiliationType: "프리랜서",
        affiliation: "브랜드 디자이너",
        techStacks: [],
        interests: [
            "브랜딩",
            "UI 디자인",
            "사용자 리서치",
        ],
        tools: [
            "Figma",
            "Photoshop",
            "Illustrator",
        ],
        representativeExperience:
            "라이프스타일 브랜드 리뉴얼",
        representativeExperienceDescription:
            "브랜드 아이덴티티와 주요 서비스 화면을 새롭게 설계했습니다.",
        strengthIndex: 2,
    },
    {
        id: 3,
        createdAt: "2026-07-03T11:00:00",
        name: "박지민",
        job: "frontend",
        purposes: ["팀 빌딩"],
        affiliationType: "직장인",
        affiliation: "네이버",
        techStacks: [
            "React",
            "TypeScript",
            "Next.js",
        ],
        interests: [],
        tools: ["Git", "GitHub", "Slack"],
        representativeExperience:
            "사내 디자인 시스템 구축",
        representativeExperienceDescription:
            "React와 TypeScript 기반 공통 컴포넌트를 개발하고 문서화했습니다.",
        strengthIndex: 1,
    },
    {
        id: 4,
        createdAt: "2026-07-04T12:00:00",
        name: "이수현",
        job: "backend",
        purposes: ["팀 빌딩", "커피챗"],
        affiliationType: "직장인",
        affiliation: "카카오",
        techStacks: [
            "Spring",
            "Java",
            "MySQL",
        ],
        interests: [],
        tools: ["Git", "GitHub", "Jira"],
        representativeExperience:
            "대용량 API 서버 개발",
        representativeExperienceDescription:
            "대규모 요청을 안정적으로 처리하도록 API와 데이터베이스 구조를 개선했습니다.",
        strengthIndex: 3,
    },
    {
        id: 5,
        createdAt: "2026-07-05T13:00:00",
        name: "최민서",
        job: "designer",
        purposes: ["교류/네트워킹"],
        affiliationType: "프리랜서",
        affiliation: "UI/UX 디자이너",
        techStacks: [],
        interests: [
            "브랜딩",
            "UX",
            "UI 디자인",
        ],
        tools: [
            "Figma",
            "Photoshop",
            "Illustrator",
        ],
        representativeExperience:
            "핀테크 앱 리디자인",
        representativeExperienceDescription:
            "사용자 흐름을 개선하고 디자인 시스템을 적용해 주요 화면을 리디자인했습니다.",
        strengthIndex: 3,
    },
    {
        id: 6,
        createdAt: "2026-07-06T14:00:00",
        name: "정하늘",
        job: "planner",
        purposes: [
            "팀 빌딩",
            "교류/네트워킹",
        ],
        affiliationType: "취준생",
        affiliation: "서비스 기획",
        techStacks: [],
        interests: [
            "이커머스",
            "데이터 분석",
            "자동화 효율화",
        ],
        tools: ["Notion", "Figma", "GA4"],
        representativeExperience:
            "구독 관리 서비스 기획",
        representativeExperienceDescription:
            "사용자 문제를 정의하고 핵심 기능과 서비스 흐름을 설계했습니다.",
        strengthIndex: 0,
    },
    {
        id: 7,
        createdAt: "2026-07-07T15:00:00",
        name: "강민준",
        job: "frontend",
        purposes: ["커피챗"],
        affiliationType: "재학생",
        affiliation: "숭실대학교",
        techStacks: [
            "Vue",
            "JavaScript",
            "Nuxt.js",
        ],
        interests: [],
        tools: ["Git", "GitHub", "Notion"],
        representativeExperience:
            "학과 커뮤니티 웹 개발",
        representativeExperienceDescription:
            "Vue 기반으로 게시판과 사용자 프로필 기능을 구현했습니다.",
        strengthIndex: 2,
    },
    {
        id: 8,
        createdAt: "2026-07-08T16:00:00",
        name: "오지훈",
        job: "backend",
        purposes: [
            "팀 빌딩",
            "교류/네트워킹",
        ],
        affiliationType: "직장인",
        affiliation: "배달의민족",
        techStacks: [
            "Kotlin",
            "Spring",
            "PostgreSQL",
        ],
        interests: [],
        tools: ["GitHub", "Jira", "Slack"],
        representativeExperience:
            "주문 처리 서버 개선",
        representativeExperienceDescription:
            "주문 처리 과정의 병목 구간을 개선해 응답 속도를 높였습니다.",
        strengthIndex: 3,
    },
    {
        id: 9,
        createdAt: "2026-07-09T09:30:00",
        name: "한예린",
        job: "designer",
        purposes: ["팀 빌딩", "커피챗"],
        affiliationType: "재학생",
        affiliation: "홍익대학교",
        techStacks: [],
        interests: [
            "UX 디자인",
            "모바일 앱",
            "사용자 리서치",
        ],
        tools: [
            "Figma",
            "Protopie",
            "MazeUT",
        ],
        representativeExperience:
            "대학생 커뮤니티 UX 개선",
        representativeExperienceDescription:
            "사용성 테스트를 진행하고 핵심 화면의 정보 구조를 개선했습니다.",
        strengthIndex: 1,
    },
    {
        id: 10,
        createdAt: "2026-07-10T10:30:00",
        name: "윤도현",
        job: "planner",
        purposes: ["교류/네트워킹"],
        affiliationType: "휴학생",
        affiliation: "연세대학교",
        techStacks: [],
        interests: [
            "AI",
            "콘텐츠",
            "커뮤니티",
        ],
        tools: ["Notion", "Jira", "Miro"],
        representativeExperience:
            "콘텐츠 추천 서비스 기획",
        representativeExperienceDescription:
            "사용자 취향 데이터를 기반으로 추천 흐름과 기능을 기획했습니다.",
        strengthIndex: 2,
    },
    {
        id: 11,
        createdAt: "2026-07-11T11:30:00",
        name: "배서준",
        job: "frontend",
        purposes: [
            "팀 빌딩",
            "커피챗",
            "교류/네트워킹",
        ],
        affiliationType: "취준생",
        affiliation: "프론트엔드 개발자",
        techStacks: [
            "React",
            "JavaScript",
            "TypeScript",
        ],
        interests: [],
        tools: ["Git", "GitHub", "Figma"],
        representativeExperience:
            "사이드 프로젝트 프론트엔드 개발",
        representativeExperienceDescription:
            "반응형 화면과 사용자 인증 흐름을 구현했습니다.",
        strengthIndex: 0,
    },
    {
        id: 12,
        createdAt: "2026-07-12T12:30:00",
        name: "송지아",
        job: "backend",
        purposes: ["커피챗"],
        affiliationType: "프리랜서",
        affiliation: "백엔드 개발자",
        techStacks: [
            "Python",
            "Django",
            "MySQL",
        ],
        interests: [],
        tools: [
            "GitHub",
            "Notion",
            "Slack",
        ],
        representativeExperience:
            "예약 서비스 API 개발",
        representativeExperienceDescription:
            "예약 생성과 취소, 사용자 인증 API를 구현했습니다.",
        strengthIndex: 1,
    },
    {
        id: 13,
        createdAt: "2026-07-13T13:30:00",
        name: "문채원",
        job: "designer",
        purposes: ["팀 빌딩"],
        affiliationType: "직장인",
        affiliation: "스타트업 디자이너",
        techStacks: [],
        interests: [
            "브랜딩",
            "UI 디자인",
            "디자인 시스템",
        ],
        tools: [
            "Figma",
            "Illustrator",
            "Framer",
        ],
        representativeExperience:
            "스타트업 디자인 시스템 구축",
        representativeExperienceDescription:
            "서비스 전반에 적용할 공통 컴포넌트와 디자인 원칙을 정리했습니다.",
        strengthIndex: 3,
    },
    {
        id: 14,
        createdAt: "2026-07-14T14:30:00",
        name: "임태윤",
        job: "planner",
        purposes: [
            "커피챗",
            "교류/네트워킹",
        ],
        affiliationType: "직장인",
        affiliation: "핀테크 스타트업",
        techStacks: [],
        interests: [
            "핀테크",
            "데이터 분석",
            "서비스 기획",
        ],
        tools: [
            "Notion",
            "Jira",
            "Amplitude",
        ],
        representativeExperience:
            "간편결제 서비스 개선",
        representativeExperienceDescription:
            "결제 이탈 데이터를 분석하고 사용자 흐름을 개선했습니다.",
        strengthIndex: 0,
    },
    {
        id: 15,
        createdAt: "2026-07-15T15:30:00",
        name: "조현우",
        job: "frontend",
        purposes: [
            "팀 빌딩",
            "교류/네트워킹",
        ],
        affiliationType: "프리랜서",
        affiliation:
            "웹 프론트엔드 개발자",
        techStacks: [
            "Next.js",
            "TypeScript",
            "React",
        ],
        interests: [],
        tools: ["Git", "GitHub", "Slack"],
        representativeExperience:
            "기업 소개 웹사이트 개발",
        representativeExperienceDescription:
            "Next.js를 활용해 반응형 페이지와 콘텐츠 관리 기능을 구현했습니다.",
        strengthIndex: 2,
    },
    {
        id: 16,
        createdAt: "2026-07-16T16:30:00",
        name: "신다은",
        job: "backend",
        purposes: [
            "팀 빌딩",
            "커피챗",
            "교류/네트워킹",
        ],
        affiliationType: "재학생",
        affiliation: "상명대학교",
        techStacks: [
            "Java",
            "Spring",
            "MySQL",
        ],
        interests: [],
        tools: [
            "GitHub",
            "Jira",
            "Notion",
        ],
        representativeExperience:
            "팀 빌딩 플랫폼 서버 개발",
        representativeExperienceDescription:
            "회원 인증과 프로필 탐색 API를 개발했습니다.",
        strengthIndex: 1,
    },
];

const profiles = PROFILE_DATA.map(
    (profile) => ({
        id: profile.id,
        createdAt: profile.createdAt,

        name: profile.name,
        job: profile.job,
        purposes: profile.purposes,

        affiliationType:
            profile.affiliationType,
        affiliation: profile.affiliation,

        profileImage: null,

        techStacks: createTags(
            profile.id,
            "skill",
            profile.techStacks,
        ),

        interests: createTags(
            profile.id,
            "interest",
            profile.interests,
        ),

        tools: createTags(
            profile.id,
            "tool",
            profile.tools,
        ),

        introduction:
            `${profile.name}입니다. 다양한 사람들과 경험을 나누고 함께 좋은 서비스를 만들고 싶습니다.`,

        representativeExperience:
            profile.representativeExperience,

        representativeExperienceDescription:
            profile.representativeExperienceDescription,

        links: createLinks(profile.id),

        experiences: createExperiences(
            profile.id,
            profile.representativeExperience,
            profile.representativeExperienceDescription,
        ),

        strength:
            strengthTypes[
                profile.strengthIndex
            ],
    }),
);

export default profiles;