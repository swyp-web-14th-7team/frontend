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
        name: "이유진",
        job: "planner",
        affiliationType: "재학생",
        affiliation: "oo대학교",
        profileImage: null,
        techStacks: [],
        interests: [
        { id: 1, name: "기획" },
        { id: 2, name: "AI" },
        { id: 3, name: "UX" },
        ],
        representativeExperience: "oo 서비스 PM",
        strength: strengthTypes[0],
    },

    {
        id: 2,
        name: "박지민",
        job: "frontend",
        affiliationType: "직장인",
        affiliation: "네이버",
        profileImage: null,
        techStacks: [
        { id: 1, name: "React" },
        { id: 2, name: "TypeScript" },
        { id: 3, name: "Next.js" },
        ],
        interests: [],
        representativeExperience: "사내 디자인 시스템 구축",
        strength: strengthTypes[1],
    },

    {
        id: 3,
        name: "이수현",
        job: "backend",
        affiliationType: "직장인",
        affiliation: "카카오",
        profileImage: null,
        techStacks: [
        { id: 1, name: "Spring" },
        { id: 2, name: "Java" },
        { id: 3, name: "MySQL" },
        ],
        interests: [],
        representativeExperience: "대용량 API 서버 개발",
        strength: strengthTypes[2],
    },

    {
        id: 4,
        name: "최민서",
        job: "designer",
        affiliationType: "프리랜서",
        affiliation: "UI/UX",
        profileImage: null,
        techStacks: [],
        interests: [
        { id: 1, name: "Figma" },
        { id: 2, name: "UX" },
        { id: 3, name: "브랜딩" },
        ],
        representativeExperience: "핀테크 앱 리디자인",
        strength: strengthTypes[3],
    },
    ];

    const extraProfiles = Array.from({ length: 12 }, (_, index) => {
    const base = profiles[index % profiles.length];

    return {
        ...base,
        id: index + 5,
        name: `${base.name}${index + 1}`,
        representativeExperience: `${base.representativeExperience} ${index + 1}`,
    };
    });

    export default [...profiles, ...extraProfiles];