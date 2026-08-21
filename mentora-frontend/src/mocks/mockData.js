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
    {
        id: "9",
        name: "Marta Oliveira",
        avatarUrl: "https://i.pravatar.cc/150?img=33",
        bio: "Product manager com experiência em produtos B2B SaaS.",
        offerings: [
            {
                id: "o12",
                title: "Mentoria de Gestão de Produto",
                area: "Gestão de Produto",
                sessionPrice: 55,
                description: "Roadmap, priorização e discovery de produto para PMs em início de carreira.",
            },
        ],
        isVerified: true,
        avgRating: 4.7,
    },
    {
        id: "10",
        name: "Pedro Almeida",
        avatarUrl: "https://i.pravatar.cc/150?img=68",
        bio: "Especialista em vendas B2B com mais de 10 anos de experiência.",
        offerings: [
            {
                id: "o13",
                title: "Mentoria de Técnicas de Vendas",
                area: "Vendas",
                sessionPrice: 35,
                description: "Prospecção, negociação e fecho de vendas para quem está a começar.",
            },
        ],
        isVerified: true,
        avgRating: 4.4,
    },
    {
        id: "11",
        name: "Sara Mendes",
        avatarUrl: "https://i.pravatar.cc/150?img=41",
        bio: "Copywriter e consultora de comunicação para marcas pessoais.",
        offerings: [
            {
                id: "o14",
                title: "Mentoria de Escrita e Copywriting",
                area: "Escrita e Comunicação",
                sessionPrice: 30,
                description: "Como escrever textos que convertem, para redes sociais e portfólio.",
            },
            {
                id: "o15",
                title: "Construção de Marca Pessoal",
                area: "Carreira/Desenvolvimento Pessoal",
                sessionPrice: 45,
                description: "Posicionamento e narrativa profissional para LinkedIn e portfólio.",
            },
        ],
        isVerified: true,
        avgRating: 4.8,
    },
    {
        id: "12",
        name: "Daniel Rocha",
        avatarUrl: "https://i.pravatar.cc/150?img=53",
        bio: "Engenheiro de software sénior, também atua como product manager técnico.",
        offerings: [
            {
                id: "o16",
                title: "Mentoria de Arquitetura de Software",
                area: "Programação/Desenvolvimento",
                sessionPrice: 80,
                description: "Sessões avançadas sobre design de sistemas, escalabilidade e boas práticas.",
            },
            {
                id: "o17",
                title: "Transição para Gestão de Produto",
                area: "Gestão de Produto",
                sessionPrice: 60,
                description: "Para devs que querem migrar de carreira técnica para produto.",
            },
        ],
        isVerified: true,
        avgRating: 4.3,
    },
];

export const MOCK_MENTEES = [
    {
        id: "m1",
        name: "Rita Sousa",
        avatarUrl: "https://i.pravatar.cc/150?img=45",
        bio: "Em transição de carreira para produto digital.",
    },
    {
        id: "m2",
        name: "Bruno Teixeira",
        avatarUrl: "https://i.pravatar.cc/150?img=15",
        bio: "Início de carreira em desenvolvimento web.",
    },
    {
        id: "m3",
        name: "Inês Carvalho",
        avatarUrl: "https://i.pravatar.cc/150?img=47",
        bio: "A construir uma marca pessoal em marketing digital.",
    },
];

export const MOCK_POSTS = [
    {
        id: "p1",
        authorId: "1",
        type: "text",
        content: "Acabei de terminar mais uma sessão de mentoria sobre React Hooks — adoro ver a cara de quem finalmente percebe o useEffect!",
        imageUrl: "",
        likedBy: ["mock-user-mentee", "m2"],
        createdAt: "2026-08-19T14:30:00.000Z",
    },
    {
        id: "p2",
        authorId: "3",
        type: "text",
        content: "Dica rápida de marketing digital: antes de investir em anúncios pagos, garante que o teu funil orgânico já está a converter. Poupa-te dinheiro e frustração.",
        imageUrl: "",
        likedBy: ["m1", "m3", "mock-user-mentee"],
        createdAt: "2026-08-20T09:15:00.000Z",
    },
    {
        id: "p3",
        authorId: "mock-user-mentor",
        type: "text",
        content: "O meu primeiro post na Mentora! Ansiosa para conhecer os mentorados por aqui.",
        imageUrl: "",
        likedBy: ["m1"],
        createdAt: "2026-08-20T16:00:00.000Z",
    },
    {
        id: "p4",
        authorId: "8",
        type: "text",
        content: "Empreender não é sobre ter a ideia perfeita, é sobre validar rápido e errar barato. Falamos mais sobre isto na próxima sessão.",
        imageUrl: "",
        likedBy: ["m2", "m3"],
        createdAt: "2026-08-20T18:45:00.000Z",
    },
    {
        id: "p5",
        authorId: "2",
        type: "text",
        content: "Portfólio bom não é o que tem mais projetos, é o que conta a melhor história sobre como pensas. Qualidade > quantidade.",
        imageUrl: "",
        likedBy: ["mock-user-mentee", "m1", "m2", "m3"],
        createdAt: "2026-08-21T08:00:00.000Z",
    },
];

export const MOCK_COMMENTS = [
    {
        id: "c1",
        postId: "p1",
        authorId: "mock-user-mentee",
        text: "Isso comigo foi exatamente assim! Obrigada pela sessão de ontem.",
        createdAt: "2026-08-19T15:00:00.000Z",
    },
    {
        id: "c2",
        postId: "p1",
        authorId: "m2",
        text: "useEffect ainda me assusta um bocadinho, mas estou a chegar lá.",
        createdAt: "2026-08-19T15:20:00.000Z",
    },
    {
        id: "c3",
        postId: "p2",
        authorId: "m3",
        text: "Precisava mesmo de ouvir isto hoje, obrigada!",
        createdAt: "2026-08-20T10:00:00.000Z",
    },
    {
        id: "c4",
        postId: "p5",
        authorId: "mock-user-mentee",
        text: "Vou aplicar isto no meu portfólio esta semana.",
        createdAt: "2026-08-21T08:30:00.000Z",
    },
];