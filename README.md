# Mentora

Comunidade de mentoria paga que funciona também como rede social: profissionais experientes (mentores) publicam conteúdo, constroem audiência através de um feed, e oferecem sessões pagas de orientação em suas áreas de atuação para mentorados que os seguem.

> Projeto final do curso Full-Stack Developer (TechOf).

## Funcionalidades

- **Autenticação** com três papéis: mentor, mentorado e admin
- **Perfil de mentor**: áreas de interesse, ofertas de mentoria (título/área/preço/descrição), agenda de disponibilidade, selo de "mentor verificado"
- **Perfil de mentorado**: bio, mentores seguidos, contador de sessões concluídas
- **Feed social**: posts em texto/imagem, curtidas, comentários, seguir
- **Busca e filtro de mentores**: por área, preço, avaliação, e busca por texto no título das ofertas
- **Agendamento com pagamento**: fluxo de 3 passos (escolher oferta → escolher horário → pagar) via Stripe
- **Chat simples** entre mentor e mentorado após confirmação da sessão
- **Avaliação de sessão** pelo mentorado ao final
- **Painel de administração**: aprovação de mentores, moderação de conteúdo, estatísticas da plataforma

## Tecnologias

**Frontend**
- React + Vite
- React Router
- Context API (autenticação, tema, fluxo de agendamento)
- CSS puro, por página/componente
- Stripe.js 

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- Autenticação: bcryptjs + JWT
- Validação: express-validator
- Stripe (Payment Intents)
- Cloudinary (upload de imagens)
- Nodemailer + Mailtrap SMTP (e-mails transacionais)

## Identidade visual

| Cor | Hex |
|---|---|
| Grafite | `#2B2D33` |
| Mostarda | `#D2A02A` |
| Verde-sálvia | `#7A9E93` |
| Creme | `#F6F1EA` |

Tipografia: **Manrope** (títulos) + **Inter** (texto corrido). Suporte a tema claro e escuro, persistido via `localStorage`.

## Estrutura
Resumo:
```
/frontend
  /src
    /pages        páginas da aplicação (landing, auth, onboarding, feed, mentores, perfil, booking, chat, admin)
    /components   componentes partilhados (Header, Footer, Avatar, RatingStars, EmptyState)
    /layouts      AppLayout (área logada) e LandingLayout (pública)
    /context      AuthContext, BookingContext
    /hooks        useAuth, useTheme
    /routes       ProtectedRoute, AppRoutes
    /services     chamadas à API por módulo
    /mocks        dados mockados (mockData.js — apagar quando o backend entrar)
    /utils        constants.js (catálogo de áreas de mentoria)
    /styles       theme.css, global.css

/backend
  /src
    /modules      auth, users (mentor + offering), feed, booking, payments, chat, admin
    /config       conexão MongoDB, configuração Stripe
    /middlewares  tratamento de erros, validação
```

## Estado atual

**Em desenvolvimento** — frontend em andamento, com dados mockados, backend ainda por desenvolver e conectar.

## Autora

Desenvolvido por **Clarice Fernandes** — projeto final do curso Full-Stack Developer (TechOf), sob orientação do Prof. Nuno Marques.
