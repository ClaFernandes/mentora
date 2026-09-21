# Mentora

Comunidade de mentoria paga que funciona também como rede social: profissionais experientes (mentores) publicam conteúdo, constroem audiência através de um feed, e oferecem sessões pagas de orientação em suas áreas de atuação para mentorados que os seguem.

> Projeto final do curso Full-Stack Developer (TechOf).

**Aplicação online:** _(link a acrescentar após a publicação)_

## Funcionalidades

- **Autenticação** com três papéis: mentor, mentorado e admin
- **Perfil de admin**: aprovação/rejeição de mentores, moderação de conteúdo (remover ou rejeitar denúncia de post/comentário, suspender/reativar ou apagar conta de mentor/mentorado), gestão de outros administradores, painel de estatísticas (mentores, mentorados, sessões concluídas, receita, com gráfico mensal)
- **Perfil de mentor**: áreas de interesse (definidas no onboarding), uma ou mais ofertas de mentoria (cada uma com título, área, preço e descrição opcional — geridas depois no perfil), agenda de horários disponíveis (definida no perfil após o cadastro), selo de "mentor verificado" após aprovação do admin
- **Perfil de mentorado** (público, enxuto): foto, bio, interesses, mentores que segue, contador de sessões concluídas
- **Feed social**: posts em texto/imagem, curtidas, comentários, sistema de seguir
- **Busca e filtro de mentores**: por área, preço, avaliação, e busca por texto no título das ofertas
- **Agendamento com pagamento**: fluxo de 5 passos (escolher oferta → escolher data no calendário → escolher horário → confirmar → pagar) via Stripe Checkout
- **Cancelamento com reembolso**: sessões podem ser canceladas até 24 horas antes da hora marcada, com reembolso automático do valor pago
- **Chat simples** entre mentor e mentorado
- **Avaliação de sessão** pelo mentorado ao final

## Tecnologias

**Frontend**

- React + Vite
- React Router
- Context API (autenticação, tema, fluxo de agendamento)
- CSS, por página/componente

**Backend**

- Node.js + Express
- MongoDB (Atlas) + Mongoose
- Autenticação: bcryptjs + JWT
- Stripe Checkout + webhooks
- Cloudinary (upload de imagens)
- Nodemailer + Mailtrap SMTP (e-mails transacionais)

## Identidade visual

| Cor          | Hex       |
| ------------ | --------- |
| Grafite      | `#2B2D33` |
| Mostarda     | `#D2A02A` |
| Verde-sálvia | `#7A9E93` |
| Creme        | `#F6F1EA` |

Tipografia: **Manrope** (títulos) + **Inter** (texto corrido). Suporte a tema claro e escuro, persistido via `localStorage`.

## Como executar localmente

### Pré-requisitos

- Node.js 18 ou superior
- Uma base de dados MongoDB (por exemplo, um cluster gratuito no MongoDB Atlas)
- Contas de teste no Stripe, Cloudinary e Mailtrap
- [Stripe CLI](https://docs.stripe.com/stripe-cli) para receber webhooks em local

### 1. Backend

```bash
cd mentora-backend
npm install
```

Cria um ficheiro `.env` na pasta `mentora-backend` com as variáveis abaixo (coloca os teus próprios valores):

```env
PORT=3000
MONGODB_URI=
JWT_SECRET=
FRONTEND_URL=http://localhost:5173

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

MAILTRAP_HOST=
MAILTRAP_PORT=
MAILTRAP_USER=
MAILTRAP_PASS=
```

Depois arranca o servidor:

```bash
npm run dev
```

A API fica disponível em `http://localhost:3000`.

### 2. Frontend

```bash
cd mentora-frontend
npm install
```

Cria um ficheiro `.env` na pasta `mentora-frontend`:

```env
VITE_API_URL=http://localhost:3000
```

Depois arranca a aplicação:

```bash
npm run dev
```

A aplicação fica disponível em `http://localhost:5173/mentora`.

### 3. Testar pagamentos com Stripe em local

Os pagamentos só ficam confirmados quando o webhook do Stripe chega ao backend. Em local, deixa isto a correr num terminal à parte:

```bash
stripe listen --forward-to localhost:3000/webhooks/stripe
```

O comando mostra um segredo que começa por `whsec_`. Copia-o para `STRIPE_WEBHOOK_SECRET` no `.env` do backend e reinicia o servidor.

> O Stripe está em modo de teste: nenhum pagamento é real. Usa apenas o cartão de teste abaixo.

No pagamento, usa o cartão de teste do Stripe:

| Campo    | Valor                 |
| -------- | --------------------- |
| Número   | `4242 4242 4242 4242` |
| Validade | qualquer data futura  |
| CVC      | qualquer 3 dígitos    |

## Contas de demonstração

Para experimentar a aplicação, podes criar uma conta nova no registo, como mentor ou como mentorado.

As credenciais de demonstração (incluindo o acesso de administrador) são fornecidas na documentação da entrega.

## Estado atual

Frontend e backend concluídos e integrados (MongoDB Atlas, Stripe em modo de teste, Cloudinary e Mailtrap). Em fase final de testes e publicação.

## Autora

Desenvolvido por **Clarice Fernandes** — projeto final do curso Full-Stack Developer (TechOf), sob orientação do Prof. Nuno Marques.
