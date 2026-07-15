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

    const baseProfiles = [
    {
        id: 1,
        createdAt: "2026-07-01T09:00:00",

        name: "이유진",
        job: "planner",

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
        createdAt: "2026-07-04T14:30:00",

        name: "박지민",
        job: "frontend",

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
        { id: "tool-4", name: "Git" },
        { id: "tool-5", name: "GitHub" },
        { id: "tool-6", name: "Slack" },
        ],

        representativeExperience: "사내 디자인 시스템 구축",

        representativeExperienceDescription:
        "React와 TypeScript 기반의 공통 컴포넌트를 개발하고 문서화했습니다.",

        strength: strengthTypes[1],
    },

    {
        id: 3,
        createdAt: "2026-07-08T10:15:00",

        name: "이수현",
        job: "backend",

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
        { id: "tool-7", name: "Git" },
        { id: "tool-8", name: "GitHub" },
        { id: "tool-9", name: "Jira" },
        ],

        representativeExperience: "대용량 API 서버 개발",

        representativeExperienceDescription:
        "대규모 요청을 안정적으로 처리하도록 API와 데이터베이스 구조를 개선했습니다.",

        strength: strengthTypes[2],
    },

    {
        id: 4,
        createdAt: "2026-07-12T18:00:00",

        name: "최민서",
        job: "designer",

        affiliationType: "프리랜서",
        affiliation: "UI/UX 디자이너",

        profileImage: null,

        techStacks: [],

        interests: [
        { id: "interest-4", name: "브랜딩" },
        { id: "interest-5", name: "UX" },
        { id: "interest-6", name: "UI 디자인" },
        ],

        tools: [
        { id: "tool-10", name: "Figma" },
        { id: "tool-11", name: "Photoshop" },
        { id: "tool-12", name: "Illustrator" },
        ],

        representativeExperience: "핀테크 앱 리디자인",

        representativeExperienceDescription:
        "사용자 흐름을 개선하고 디자인 시스템을 적용해 주요 화면을 리디자인했습니다.",

        strength: strengthTypes[3],
    },
    ];

    const profiles = Array.from(
    { length: 16 },
    (_, index) => {
        const base =
        baseProfiles[index % baseProfiles.length];

        return {
        ...base,

        id: index + 1,

        name: `${base.name}${index + 1}`,

        representativeExperience:
            `${base.representativeExperience} ${index + 1}`,

        representativeExperienceDescription:
            base.representativeExperienceDescription,

        createdAt: new Date(
            2026,
            6,
            index + 1,
            9 + (index % 8),
            0,
            0,
        ).toISOString(),
        };
    },
    );

    export default profiles;