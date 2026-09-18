/**
 SEED DE DADOS — MENTORA: gerado pelo Cloud para testes e demonstração
 * ------------------------------------------------------------------
 * Popula a base de dados com um conjunto completo e variado de dados
 * de demonstração: mentores em todas as áreas, mentorados, ofertas,
 * posts (texto e imagem), comentários, likes, follows, disponibilidade,
 * sessões em todos os estados, pagamentos, conversas/mensagens,
 * favoritos e notificações.
 *
 * COMO USAR:
 * 1. Copia este ficheiro para dentro de mentora-backend/src/seed.js
 *    (mesma pasta onde está o server.js).
 * 2. Corre a partir da pasta mentora-backend:
 *      node src/seed.js
 * 3. Espera a mensagem "Seed concluído com sucesso!" no terminal.
 *
 * IMPORTANTE:
 * - CLEAR_EXISTING (abaixo) está a `true` por omissão: o script apaga
 *   TODOS os mentores/mentorados/posts/sessões/etc. já existentes antes
 *   de criar os novos, para começares com uma base limpa e consistente.
 *   Contas com role "admin" NUNCA são apagadas por este script.
 * - Todas as contas de mentor/mentee criadas aqui usam a MESMA password:
 *     Demo#123
 *   (fica registada no fim da execução, no terminal, para referência.)
 */

require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./config/database");

const User = require("./modules/users/user.model");
const MentorProfile = require("./modules/users/mentor.model");
const MenteeProfile = require("./modules/users/mentee.model");
const Offering = require("./modules/offerings/offering.model");
const Post = require("./modules/feed/post.model");
const Comment = require("./modules/feed/comment.model");
const Follow = require("./modules/follow/follow.model");
const { Availability, Session } = require("./modules/booking/booking.models");
const Payment = require("./modules/payments/payment.model");
const Conversation = require("./modules/chat/conversation.model");
const Message = require("./modules/chat/message.model");
const Favorite = require("./modules/favorites/favorite.model");
const Notification = require("./modules/notifications/notification.model");

const CLEAR_EXISTING = true;
const COMMON_PASSWORD = "Demo#123";

// ---------------------------------------------------------------
// Utilitários
// ---------------------------------------------------------------
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomSubset(arr, min, max) {
  const count = Math.min(arr.length, Math.floor(Math.random() * (max - min + 1)) + min);
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function dateStringOffset(daysFromToday) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const TIME_SLOTS = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

function avatarUrl(seed) {
  return `https://i.pravatar.cc/300?img=${seed}`;
}

function postImageUrl(keyword, lockId) {
  return `https://loremflickr.com/800/600/${keyword}?lock=${lockId}`;
}

// ---------------------------------------------------------------
// Dados de referência
// ---------------------------------------------------------------
const AREAS = [
  { name: "Programação/Desenvolvimento", keyword: "programming" },
  { name: "Design (UI/UX)", keyword: "design" },
  { name: "Marketing", keyword: "marketing" },
  { name: "Gestão de Produto", keyword: "product" },
  { name: "Gestão de Projetos", keyword: "teamwork" },
  { name: "Recursos Humanos", keyword: "office" },
  { name: "Vendas", keyword: "sales" },
  { name: "Finanças", keyword: "finance" },
  { name: "Empreendedorismo", keyword: "startup" },
  { name: "Carreira/Desenvolvimento Pessoal", keyword: "career" },
  { name: "Educação/Ensino", keyword: "teaching" },
  { name: "Saúde e Bem-estar", keyword: "wellness" },
  { name: "Idiomas", keyword: "language" },
  { name: "Direito", keyword: "law" },
  { name: "Escrita e Comunicação", keyword: "writing" },
];

const MENTOR_PEOPLE = [
  ["Rafael", "Costa"], ["Beatriz", "Almeida"], ["Tiago", "Ferreira"], ["Sofia", "Martins"],
  ["André", "Pereira"], ["Mariana", "Santos"], ["Diogo", "Carvalho"], ["Inês", "Rodrigues"],
  ["Bruno", "Gonçalves"], ["Catarina", "Lopes"], ["Ricardo", "Mendes"], ["Joana", "Teixeira"],
  ["Nuno", "Marques"], ["Patrícia", "Cunha"], ["Vasco", "Ribeiro"], ["Filipa", "Sousa"],
];

const MENTEE_PEOPLE = [
  ["Miguel", "Oliveira"], ["Ana", "Fonseca"], ["Pedro", "Nogueira"], "".length && null,
  ["Rita", "Correia"], ["Hugo", "Barros"], ["Lara", "Machado"], ["Simão", "Batista"],
  ["Carolina", "Pinho"], ["Tomás", "Vieira"], ["Marta", "Antunes"], ["Gonçalo", "Reis"],
].filter(Boolean);

const BIO_TEMPLATES = [
  "Mais de {years} anos de experiência em {area}, já ajudei dezenas de profissionais a evoluir na carreira.",
  "Apaixonado(a) por {area} — o meu objetivo é partilhar o que aprendi ao longo de {years} anos de percurso.",
  "Especialista em {area}, focado(a) em mentorias práticas e orientadas a resultados.",
  "Trabalho com {area} há {years} anos e adoro ajudar outras pessoas a atalhar caminho.",
];

const POST_TEXTS = [
  "Hoje refleti sobre como pequenos hábitos fazem toda a diferença a longo prazo. O que costumam fazer para se manterem consistentes?",
  "Partilho aqui uma dica que uso com todos os meus mentorados: definir um objetivo pequeno e mensurável por semana funciona muito melhor do que grandes planos vagos.",
  "Sessão de hoje foi inspiradora — adoro ver a evolução de quem começa do zero e ganha confiança passo a passo.",
  "Um erro comum que vejo com frequência: querer fazer tudo perfeito logo à primeira. O progresso vem da prática repetida, não da perfeição.",
  "Deixo aqui um recurso que recomendo sempre nas minhas sessões. Quem quiser saber mais, fico disponível no chat!",
  "A pergunta que mais me fazem: \"por onde começo?\". A resposta é sempre a mesma — começa já, mesmo que pequeno.",
];

const COMMENT_TEXTS = [
  "Muito bom, obrigado por partilhares!",
  "Isto ajudou-me imenso, já estou a aplicar.",
  "Concordo plenamente, é exatamente isso.",
  "Adorei a perspetiva, nunca tinha pensado assim.",
  "Podias explicar melhor este ponto numa próxima sessão?",
  "Sempre a inspirar com estas publicações!",
];

// ---------------------------------------------------------------
// Seed principal
// ---------------------------------------------------------------
async function seed() {
  await connectDB();

  if (CLEAR_EXISTING) {
    console.log("A limpar dados existentes (exceto admins)...");
    await User.deleteMany({ role: { $ne: "admin" } });
    await MentorProfile.deleteMany({});
    await MenteeProfile.deleteMany({});
    await Offering.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    await Follow.deleteMany({});
    await Availability.deleteMany({});
    await Session.deleteMany({});
    await Payment.deleteMany({});
    await Conversation.deleteMany({});
    await Message.deleteMany({});
    await Favorite.deleteMany({});
    await Notification.deleteMany({});
  }

  const passwordHash = await bcrypt.hash(COMMON_PASSWORD, 12);

  // -------------------------------------------------------------
  // 1. Mentores (um por área, cobrindo as 15 áreas + 1 extra)
  // -------------------------------------------------------------
  console.log("A criar mentores...");
  const mentors = []; // { user, profile, area }

  for (let i = 0; i < MENTOR_PEOPLE.length; i++) {
    const [name, surname] = MENTOR_PEOPLE[i];
    const area = AREAS[i % AREAS.length];
    const hasAvatar = i % 3 !== 0; // ~2/3 têm foto, resto fica só com iniciais

    const user = await User.create({
      name,
      surname,
      birthDate: new Date(1975 + randomInt(0, 25), randomInt(0, 11), randomInt(1, 28)),
      email: `${name.toLowerCase()}.${surname.toLowerCase()}@mentora-demo.com`,
      avatarUrl: hasAvatar ? avatarUrl(randomInt(1, 70)) : "",
      passwordHash,
      role: "mentor",
      status: "active",
    });

    // Distribuição de estados de aprovação: maioria verificados,
    // alguns pendentes, um par rejeitados — para testar as 3 filas do Admin
    let isVerified = true;
    let rejected = false;
    if (i % 7 === 5) {
      isVerified = false;
      rejected = false; // pendente
    } else if (i % 7 === 6) {
      isVerified = false;
      rejected = true; // rejeitado
    }

    const bioTemplate = randomItem(BIO_TEMPLATES);
    const bio = bioTemplate
      .replace("{area}", area.name)
      .replace("{years}", randomInt(3, 15));

    const profile = await MentorProfile.create({
      userId: user._id,
      areas: [area.name],
      bio,
      isVerified,
      rejected,
      avgRating: isVerified ? Number((3.5 + Math.random() * 1.5).toFixed(1)) : 0,
    });

    mentors.push({ user, profile, area });
  }

  // -------------------------------------------------------------
  // 2. Ofertas (1 a 3 por mentor)
  // -------------------------------------------------------------
  console.log("A criar ofertas...");
  const LEVELS = ["iniciante", "intermedio", "avancado"];
  const offeringsByMentor = new Map(); // mentorProfileId -> [offering]

  for (const { profile, area } of mentors) {
    const numOfferings = randomInt(1, 3);
    const offerings = [];

    for (let j = 0; j < numOfferings; j++) {
      const level = LEVELS[j % LEVELS.length];
      const offering = await Offering.create({
        mentorId: profile._id,
        title: `Mentoria de ${area.name} — ${level === "iniciante" ? "Primeiros passos" : level === "intermedio" ? "Aprofundamento" : "Avançado"}`,
        area: area.name,
        sessionPrice: randomInt(25, 90),
        description: `Sessão individual focada em ${area.name.toLowerCase()}, adaptada ao teu nível e objetivos.`,
        level,
      });
      offerings.push(offering);
    }

    offeringsByMentor.set(profile._id.toString(), offerings);
  }

  // -------------------------------------------------------------
  // 3. Disponibilidade (mentores verificados)
  // -------------------------------------------------------------
  console.log("A criar disponibilidade...");
  for (const { profile } of mentors) {
    if (!profile.isVerified) continue;

    await Availability.create({
      mentorId: profile._id,
      dayOfWeek: randomInt(1, 3),
      startTime: "09:00",
      endTime: "12:00",
    });
    await Availability.create({
      mentorId: profile._id,
      dayOfWeek: randomInt(4, 5),
      startTime: "14:00",
      endTime: "18:00",
    });
  }

  // -------------------------------------------------------------
  // 4. Mentorados
  // -------------------------------------------------------------
  console.log("A criar mentorados...");
  const mentees = []; // { user, profile }

  for (let i = 0; i < MENTEE_PEOPLE.length; i++) {
    const [name, surname] = MENTEE_PEOPLE[i];
    const hasAvatar = i % 2 === 0;

    const user = await User.create({
      name,
      surname,
      birthDate: new Date(1988 + randomInt(0, 15), randomInt(0, 11), randomInt(1, 28)),
      email: `${name.toLowerCase()}.${surname.toLowerCase()}@mentora-demo.com`,
      avatarUrl: hasAvatar ? avatarUrl(randomInt(1, 70)) : "",
      passwordHash,
      role: "mentee",
      status: i === MENTEE_PEOPLE.length - 1 ? "suspended" : "active", // um mentee já suspenso, para testar
    });

    const interests = randomSubset(AREAS.map((a) => a.name), 2, 4);

    const profile = await MenteeProfile.create({
      userId: user._id,
      interests,
      bio: "À procura de mentoria para dar o próximo passo na carreira.",
    });

    mentees.push({ user, profile });
  }

  // -------------------------------------------------------------
  // 5. Follows
  // -------------------------------------------------------------
  console.log("A criar follows...");
  const verifiedMentors = mentors.filter((m) => m.profile.isVerified);

  for (const { user } of mentees) {
    const followed = randomSubset(verifiedMentors, 1, 4);
    for (const mentor of followed) {
      try {
        await Follow.create({ followerId: user._id, mentorId: mentor.profile._id });
      } catch (e) {
        // ignora duplicados (índice único)
      }
    }
  }

  // -------------------------------------------------------------
  // 6. Posts + Comentários + Likes + Notificações
  // -------------------------------------------------------------
  console.log("A criar posts, comentários e likes...");
  const allUserIds = [...mentors.map((m) => m.user), ...mentees.map((m) => m.user)];
  const posts = [];

  for (const { user, profile, area } of mentors) {
    const numPosts = randomInt(1, 3);

    for (let p = 0; p < numPosts; p++) {
      const isImagePost = p % 2 === 0;

      const post = await Post.create({
        mentorId: profile._id,
        type: isImagePost ? "image" : "text",
        content: randomItem(POST_TEXTS),
        imageUrl: isImagePost ? postImageUrl(area.keyword, `${profile._id}${p}`) : "",
        likedBy: [],
        reported: false,
      });

      posts.push({ post, ownerUserId: user._id });
    }
  }

  // Likes e comentários espalhados pelos posts
  for (const { post, ownerUserId } of posts) {
    const likers = randomSubset(allUserIds, 0, 6).filter(
      (u) => u._id.toString() !== ownerUserId.toString()
    );
    post.likedBy = likers.map((u) => u._id);
    await post.save();

    for (const liker of likers.slice(0, 3)) {
      await Notification.create({
        type: "like",
        recipientId: ownerUserId,
        actorId: liker._id,
        postId: post._id,
      });
    }

    const commenters = randomSubset(allUserIds, 0, 3).filter(
      (u) => u._id.toString() !== ownerUserId.toString()
    );

    for (const commenter of commenters) {
      const comment = await Comment.create({
        postId: post._id,
        userId: commenter._id,
        text: randomItem(COMMENT_TEXTS),
        likedBy: randomSubset(allUserIds, 0, 3).map((u) => u._id),
        reported: false,
      });

      await Notification.create({
        type: "comment",
        recipientId: ownerUserId,
        actorId: commenter._id,
        postId: post._id,
      });

      // marca 1 em cada ~5 comentários como denunciado, para testar Moderação
      if (Math.random() < 0.2) {
        comment.reported = true;
        await comment.save();
      }
    }
  }

  // marca 1-2 posts como denunciados também
  const postsToReport = randomSubset(posts, 1, 2);
  for (const { post } of postsToReport) {
    post.reported = true;
    await post.save();
  }

  // -------------------------------------------------------------
  // 7. Sessões + Pagamentos + Conversas/Mensagens + Favoritos
  // -------------------------------------------------------------
  console.log("A criar sessões, pagamentos, conversas e favoritos...");

  const STATUSES_DISTRIBUTION = [
    "completed", "completed", "confirmed_past", "confirmed_future",
    "pending", "cancelled",
  ];

  let statusIndex = 0;

  for (const { user: menteeUser } of mentees) {
    const numSessions = randomInt(1, 3);
    const chosenMentors = randomSubset(verifiedMentors, 1, numSessions);

    for (const mentor of chosenMentors) {
      const offerings = offeringsByMentor.get(mentor.profile._id.toString());
      if (!offerings || offerings.length === 0) continue;
      const offering = randomItem(offerings);

      const kind = STATUSES_DISTRIBUTION[statusIndex % STATUSES_DISTRIBUTION.length];
      statusIndex++;

      let status = "pending";
      let date = dateStringOffset(randomInt(3, 20));
      let rating;
      let reviewText;

      if (kind === "completed") {
        status = "completed";
        date = dateStringOffset(-randomInt(3, 40));
        rating = randomInt(3, 5);
        reviewText = "Sessão muito útil, recomendo!";
      } else if (kind === "confirmed_past") {
        // fica "confirmed" persistido mas a data já passou —
        // testa o cálculo dinâmico de resolveDisplayStatus/isSessionCompleted
        status = "confirmed";
        date = dateStringOffset(-randomInt(1, 10));
      } else if (kind === "confirmed_future") {
        status = "confirmed";
        date = dateStringOffset(randomInt(3, 15));
      } else if (kind === "pending") {
        status = "pending";
        date = dateStringOffset(randomInt(5, 20));
      } else if (kind === "cancelled") {
        status = "cancelled";
        date = dateStringOffset(randomInt(5, 20));
      }

      const session = await Session.create({
        mentorId: mentor.profile._id,
        menteeId: menteeUser._id,
        offeringId: offering._id,
        date,
        time: randomItem(TIME_SLOTS),
        status,
        rating,
        reviewText,
      });

      // Pagamento para tudo o que não seja "pending" nem "cancelled"
      if (status === "completed" || status === "confirmed") {
        await Payment.create({
          sessionId: session._id,
          stripePaymentId: `pi_demo_${session._id}`,
          amount: offering.sessionPrice,
          status: "paid",
          paidAt: new Date(),
        });
      }

      // Conversa + mensagens para sessões pagas
      if (status === "completed" || status === "confirmed") {
        let conversation = await Conversation.findOne({
          offeringId: offering._id,
          menteeId: menteeUser._id,
        });

        if (!conversation) {
          conversation = await Conversation.create({
            offeringId: offering._id,
            menteeId: menteeUser._id,
            unreadByMentor: Math.random() < 0.3,
            unreadByMentee: Math.random() < 0.3,
          });
        }

        await Message.create({
          conversationId: conversation._id,
          senderId: mentor.user._id,
          text: "Sessão marcada! Usa este chat para combinar os detalhes antes da tua sessão.",
        });
        await Message.create({
          conversationId: conversation._id,
          senderId: menteeUser._id,
          text: "Perfeito, obrigado! Vemo-nos na sessão.",
        });
      }

      // Favoritos: só para sessões completed/confirmed com data já passada
      if (
        (status === "completed" || status === "confirmed") &&
        new Date(`${date}T00:00:00`) < new Date() &&
        Math.random() < 0.5
      ) {
        try {
          await Favorite.create({ menteeId: menteeUser._id, offeringId: offering._id });
        } catch (e) {
          // ignora duplicados
        }
      }
    }
  }

  console.log("\nSeed concluído com sucesso!");
  console.log(`Mentores criados: ${mentors.length}`);
  console.log(`Mentorados criados: ${mentees.length}`);
  console.log(`Password comum para todas as contas criadas: ${COMMON_PASSWORD}`);
  console.log("Exemplo de login: " + mentors[0].user.email + " / " + COMMON_PASSWORD);
}

seed()
  .then(() => {
    console.log("A fechar ligação...");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Erro ao correr o seed:", err);
    process.exit(1);
  });
