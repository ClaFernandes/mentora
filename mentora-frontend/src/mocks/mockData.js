// Substituir por chamadas aos endpoints correspondentes no backend

export const MOCK_MENTEE_USER = {
    id: "mock-user-mentee",
    name: "Clarice Fernandes",
    email: "mentee@mail.com",
    role: "mentee",
    status: "active",
    avatarUrl: "",
    bio: "Desenvolvedora full-stack.",
    createdAt: "2026-01-10T00:00:00.000Z",
    menteeProfile: {
        interests: ["Programação/Desenvolvimento", "Marketing"],
        followingMentors: ["1", "3"],
    },
};

export const MOCK_MENTOR_USER = {
    id: "mock-user-mentor",
    name: "Clarice Fernandes",
    email: "mentor@mail.com",
    role: "mentor",
    status: "active",
    avatarUrl: "",
    bio: "Desenvolvedora full-stack e mentora.",
    createdAt: "2026-01-10T00:00:00.000Z",
    mentorProfile: {
        areas: ["Programação/Desenvolvimento"],
        offerings: [
            {
                id: "o-mock-1",
                title: "Mentoria de Desenvolvimento Web",
                area: "Programação/Desenvolvimento",
                sessionPrice: 45,
                description: "Sessões de mentoria em desenvolvimento full-stack, do zero ao primeiro emprego.",
            },
        ],
        isVerified: true,
        avgRating: 4.8,
    },
};

export const MOCK_ADMIN_USER = {
    id: "mock-user-admin",
    name: "Clarice Fernandes",
    email: "admin@mail.com",
    role: "admin",
    status: "active",
    avatarUrl: "",
    bio: "",
    createdAt: "2026-01-10T00:00:00.000Z",
};

export const MOCK_MENTORS = [
    {
        id: "1",
        name: "Ana Ribeiro",
        avatarUrl: "https://i.pravatar.cc/150?img=32",
        bio: "Engenheira de software com 8 anos de experiência em produtos web.",
        offerings: [
            {
                id: "o1",
                title: "Mentoria de Desenvolvimento Web",
                area: "Programação/Desenvolvimento",
                sessionPrice: 50,
                description: "Sessões práticas focadas em JavaScript moderno, React e boas práticas de código.",
            },
            {
                id: "o2",
                title: "Gestão de Projetos Ágeis",
                area: "Gestão de Projetos",
                sessionPrice: 65,
                description: "Orientação em metodologias ágeis (Scrum/Kanban) para equipas de produto.",
            },
        ],
        isVerified: true,
        avgRating: 4.9,
    },
    {
        id: "2",
        name: "Ricardo Silva",
        avatarUrl: "https://i.pravatar.cc/150?img=12",
        bio: "Designer UX/UI focado em produtos digitais e design systems.",
        offerings: [
            {
                id: "o3",
                title: "Mentoria de UI/UX Design",
                area: "Design (UI/UX)",
                sessionPrice: 40,
                description: "Revisão de portfólio, fundamentos de design systems e prototipagem.",
            },
        ],
        isVerified: true,
        avgRating: 4.8,
    },
    {
        id: "3",
        name: "Sofia Martins",
        avatarUrl: "https://i.pravatar.cc/150?img=48",
        bio: "Especialista em marketing digital e crescimento de marca.",
        offerings: [
            {
                id: "o4",
                title: "Estratégia de Marketing Digital",
                area: "Marketing",
                sessionPrice: 45,
                description: "Planeamento de campanhas, redes sociais e crescimento de marca.",
            },
        ],
        isVerified: true,
        avgRating: 5.0,
    },
    {
        id: "4",
        name: "Miguel Costa",
        avatarUrl: "https://i.pravatar.cc/150?img=51",
        bio: "Consultor financeiro com foco em finanças pessoais e investimento.",
        offerings: [
            {
                id: "o5",
                title: "Mentoria de Finanças Pessoais",
                area: "Finanças",
                sessionPrice: 60,
                description: "Orçamento, investimento e planeamento financeiro a longo prazo.",
            },
        ],
        isVerified: true,
        avgRating: 4.6,
    },
    {
        id: "5",
        name: "Beatriz Alves",
        avatarUrl: "https://i.pravatar.cc/150?img=44",
        bio: "Especialista em recrutamento e desenvolvimento de equipas.",
        offerings: [
            {
                id: "o6",
                title: "Mentoria de Recrutamento e RH",
                area: "Recursos Humanos",
                sessionPrice: 35,
                description: "Processos de recrutamento, employer branding e gestão de equipas.",
            },
        ],
        isVerified: true,
        avgRating: 4.7,
    },
    {
        id: "6",
        name: "Tiago Fernandes",
        avatarUrl: "https://i.pravatar.cc/150?img=59",
        bio: "Professor de idiomas, mentor novo na plataforma.",
        offerings: [
            {
                id: "o7",
                title: "Aulas de Inglês Conversacional",
                area: "Idiomas",
                sessionPrice: 25,
                description: "Prática de conversação e preparação para entrevistas em inglês.",
            },
            {
                id: "o8",
                title: "Mentoria em Metodologias de Ensino",
                area: "Educação/Ensino",
                sessionPrice: 30,
                description: "Apoio a professores iniciantes na criação de planos de aula.",
            },
        ],
        isVerified: false,
        avgRating: 4.2,
    },
    {
        id: "7",
        name: "Carla Nunes",
        avatarUrl: "https://i.pravatar.cc/150?img=25",
        bio: "Advogada especializada em direito digital e contratos.",
        offerings: [
            {
                id: "o9",
                title: "Consultoria em Direito Digital",
                area: "Direito",
                sessionPrice: 70,
                description: "Contratos, proteção de dados e questões legais para startups.",
            },
        ],
        isVerified: true,
        avgRating: 4.9,
    },
    {
        id: "8",
        name: "João Pereira",
        avatarUrl: "https://i.pravatar.cc/150?img=14",
        bio: "Fundador de duas startups, mentor de empreendedorismo e carreira.",
        offerings: [
            {
                id: "o10",
                title: "Mentoria para Fundadores",
                area: "Empreendedorismo",
                sessionPrice: 55,
                description: "Validação de ideias, captação de investimento e crescimento inicial.",
            },
            {
                id: "o11",
                title: "Orientação de Carreira",
                area: "Carreira/Desenvolvimento Pessoal",
                sessionPrice: 40,
                description: "Planeamento de carreira, transições profissionais e networking.",
            },
        ],
        isVerified: true,
        avgRating: 4.5,
    },
];