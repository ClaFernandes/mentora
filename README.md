# Mentora

Comunidade de mentoria paga que funciona também como rede social: profissionais experientes (mentores) publicam conteúdo, constroem audiência através de um feed, e oferecem sessões pagas de orientação em suas áreas de atuação para mentorados que os seguem.

> Projeto final do curso Full-Stack Developer (TechOf).

## Funcionalidades

- **Autenticação** com três papéis: mentor, mentorado e admin
- **Perfil de admin**: aprovação/rejeição de mentores, moderação de conteúdo (remover ou rejeitar denúncia de post/comentário, suspender/reativar ou apagar conta de mentor/mentorado), gestão de outros administradores, painel de estatísticas (mentores, mentorados, sessões concluídas, receita, com gráfico mensal)
- **Perfil de mentor**: áreas de interesse (definidas no onboarding), uma ou mais ofertas de mentoria (cada uma com título, área, preço e descrição opcional — geridas depois no perfil), agenda de horários disponíveis (definida no perfil após o cadastro), selo de "mentor verificado" após aprovação do admin
- **Perfil de mentorado** (público, enxuto): foto, bio, interesses, mentores que segue, contador de sessões concluídas
- **Feed social**: posts em texto/imagem, curtidas, comentários, sistema de seguir
- **Busca e filtro de mentores**: por área, preço, avaliação, e busca por texto no título das ofertas
- **Agendamento com pagamento**: fluxo de 5 passos (escolher oferta → escolher data no calendário → escolher horário → confirmar → pagar) via Stripe
- **Chat simples** entre mentor e mentorado
- **Avaliação de sessão** pelo mentorado ao final
- **Painel de administração**: aprovação de mentores, moderação de conteúdo, estatísticas da plataforma

## Tecnologias

**Frontend**
- React + Vite
- React Router
- Context API (autenticação, tema, fluxo de agendamento)
- CSS, por página/componente
- Stripe.js 

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- Autenticação: bcryptjs + JWT
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

## Estado atual

**Em desenvolvimento** — frontend finalizado, com dados mockados; backend em andamento.

## Autora

Desenvolvido por **Clarice Fernandes** — projeto final do curso Full-Stack Developer (TechOf), sob orientação do Prof. Nuno Marques.
