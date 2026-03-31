import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clean old data
  await prisma.reaction.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()
  await prisma.meeting.deleteMany()
  await prisma.weekContent.deleteMany()
  await prisma.premiumEvent.deleteMany()
  await prisma.coupon.deleteMany()
  await prisma.pendingUser.deleteMany()
  await prisma.passwordResetToken.deleteMany()
  await prisma.user.deleteMany()

  // ===== ADMIN: Mardia (gestora) =====
  const adminPassword = await bcrypt.hash('admin123', 12)

  await prisma.user.upsert({
    where: { email: 'mardia@lecercle.com' },
    update: {},
    create: {
      email: 'mardia@lecercle.com',
      name: 'Mardia Alcantara',
      passwordHash: adminPassword,
      role: 'ADMIN',
      level: 'AVANCADO',
      subscriptionStatus: 'ACTIVE',
      subscriptionPlan: 'premium',
      onboardingDone: true,
      acceptedTerms: true,
      acceptedTermsAt: new Date(),
    },
  })

  // ===== MEMBRO DEMO: Mardia (cliente vendo como membro) =====
  const mardiaPassword = await bcrypt.hash('mardia123', 12)

  await prisma.user.upsert({
    where: { email: 'mardia@idiomascommardia.com' },
    update: {},
    create: {
      email: 'mardia@idiomascommardia.com',
      name: 'Mardia',
      passwordHash: mardiaPassword,
      role: 'MEMBER',
      level: 'INTERMEDIARIO',
      subscriptionStatus: 'ACTIVE',
      subscriptionPlan: 'premium',
      onboardingDone: true,
      acceptedTerms: true,
      acceptedTermsAt: new Date(),
      amountPaid: 899.90,
    },
  })

  // ===== MEMBROS: Isa e Thiago =====
  const isaPassword = await bcrypt.hash('isa12345', 12)
  const isa = await prisma.user.upsert({
    where: { email: 'isa@lecercle.com' },
    update: {},
    create: {
      email: 'isa@lecercle.com',
      name: 'Isadora Bevilaqua',
      passwordHash: isaPassword,
      role: 'MEMBER',
      level: 'INICIANTE',
      subscriptionStatus: 'ACTIVE',
      subscriptionPlan: 'yearly',
      onboardingDone: true,
      amountPaid: 419.90,
      acceptedTerms: true,
      acceptedTermsAt: new Date(),
    },
  })

  const thiagoPassword = await bcrypt.hash('thiago123', 12)
  const thiago = await prisma.user.upsert({
    where: { email: 'thiago@lecercle.com' },
    update: {},
    create: {
      email: 'thiago@lecercle.com',
      name: 'Thiago Reis',
      passwordHash: thiagoPassword,
      role: 'MEMBER',
      level: 'INTERMEDIARIO',
      subscriptionStatus: 'ACTIVE',
      subscriptionPlan: 'quarterly',
      onboardingDone: true,
      amountPaid: 127.70,
      couponUsed: 'BONJOUR20',
      acceptedTerms: true,
      acceptedTermsAt: new Date(),
    },
  })

  // ===== SEMANA 1: L'Art de Vivre =====
  await prisma.weekContent.upsert({
    where: { weekNumber: 1 },
    update: {},
    create: {
      weekNumber: 1,
      title: "L'Art de Vivre à Paris",
      description: "Explore a elegância do cotidiano francês através da moda, gastronomia e o conceito de flâneur.",
      level: 'INICIANTE',
      musicUrl: 'https://open.spotify.com/track/3CeCwYWvdfXbZLKhxaYOBN',
      videoUrl: 'https://www.youtube.com/embed/LB2Y6fKq5uo',
      vocabulary: [
        { word: 'Bonjour', translation: 'Bom dia / Olá' },
        { word: 'La Silhouette', translation: 'A Silhueta' },
        { word: 'Le Flâneur', translation: 'O Passeador' },
        { word: 'Éclatant', translation: 'Brilhante, Radiante' },
        { word: 'Savoir-faire', translation: 'Saber fazer' },
        { word: 'La Boulangerie', translation: 'A Padaria' },
      ],
      prompts: [
        'Comment vous appelez-vous? (Como você se chama?)',
        'Comment décririez-vous votre style en trois mots?',
        "Quel est votre café préféré?",
      ],
      exercise: 'Escreva 3 frases se apresentando em francês. Use: "Je m\'appelle...", "J\'habite à..." e "J\'aime...".',
      challengeText: 'Grave um áudio de 30 segundos se apresentando em francês e poste na comunidade!',
      isActive: false,
      publishedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    },
  })

  // ===== SEMANA 2: La Gastronomie =====
  await prisma.weekContent.upsert({
    where: { weekNumber: 2 },
    update: {},
    create: {
      weekNumber: 2,
      title: "La Gastronomie Française",
      description: "Descubra o vocabulário da culinária francesa: do croissant ao coq au vin. Aprenda a pedir em um restaurante e falar sobre suas preferências.",
      level: 'INICIANTE',
      musicUrl: 'https://open.spotify.com/track/6rqhFgbbKwnb9MLmUQDhG6',
      videoUrl: 'https://www.youtube.com/embed/rOjHhS5MtvA',
      vocabulary: [
        { word: 'Le Croissant', translation: 'O Croissant' },
        { word: 'Le Restaurant', translation: 'O Restaurante' },
        { word: 'L\'addition', translation: 'A Conta' },
        { word: 'Délicieux', translation: 'Delicioso' },
        { word: 'Le Fromage', translation: 'O Queijo' },
        { word: 'Le Vin', translation: 'O Vinho' },
        { word: 'Commander', translation: 'Pedir (no restaurante)' },
      ],
      prompts: [
        'Quel est votre plat français préféré?',
        'Décrivez votre repas idéal en français.',
        "Vous êtes au restaurant. Que commandez-vous?",
      ],
      exercise: 'Simule uma conversa em um restaurante francês. Escreva o diálogo entre você e o garçom usando pelo menos 4 palavras do vocabulário.',
      challengeText: 'Prepare uma receita francesa simples (um croque-monsieur, por exemplo) e descreva o processo em francês na comunidade!',
      isActive: false,
      publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
  })

  // ===== SEMANA 3: La Mode et le Style =====
  await prisma.weekContent.upsert({
    where: { weekNumber: 3 },
    update: {},
    create: {
      weekNumber: 3,
      title: "La Mode et le Style",
      description: "Mergulhe no mundo da moda francesa. De Coco Chanel a street style parisiense, aprenda a descrever roupas e expressar seu estilo pessoal.",
      level: 'INTERMEDIARIO',
      musicUrl: 'https://open.spotify.com/track/5uCax9HNcjBTbkSDWxARqe',
      videoUrl: 'https://www.youtube.com/embed/0gXvVUg2-bY',
      vocabulary: [
        { word: 'La Robe', translation: 'O Vestido' },
        { word: 'Les Chaussures', translation: 'Os Sapatos' },
        { word: 'Élégant(e)', translation: 'Elegante' },
        { word: 'Le Style', translation: 'O Estilo' },
        { word: 'Porter', translation: 'Vestir / Usar' },
        { word: 'La Haute Couture', translation: 'A Alta Costura' },
        { word: 'Tendance', translation: 'Tendência' },
      ],
      prompts: [
        'Décrivez votre tenue préférée en français.',
        'Quel est votre designer français préféré et pourquoi?',
        "Comment est le style dans votre ville?",
      ],
      exercise: 'Descreva 3 looks diferentes (casual, trabalho e festa) usando o vocabulário da semana. Use adjetivos para descrever cada peça.',
      challengeText: 'Poste uma foto do seu look do dia na comunidade com a descrição em francês! Use pelo menos 3 palavras novas.',
      isActive: false,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  })

  // ===== SEMANA 4: La Culture et les Arts (ATIVA) =====
  const week4 = await prisma.weekContent.upsert({
    where: { weekNumber: 4 },
    update: {},
    create: {
      weekNumber: 4,
      title: "La Culture et les Arts",
      description: "Explore o universo cultural francês: cinema, literatura, música e artes plásticas. Aprenda a expressar opiniões e debater sobre cultura.",
      level: 'INTERMEDIARIO',
      musicUrl: 'https://open.spotify.com/track/2LTlO3NuNVN70lp2ZbLswZ',
      videoUrl: 'https://www.youtube.com/embed/AXnqkVTFUqs',
      vocabulary: [
        { word: 'Le Cinéma', translation: 'O Cinema' },
        { word: 'Le Tableau', translation: 'O Quadro / Pintura' },
        { word: 'Le Musée', translation: 'O Museu' },
        { word: 'Magnifique', translation: 'Magnífico' },
        { word: 'L\'Exposition', translation: 'A Exposição' },
        { word: 'Le Chef-d\'œuvre', translation: 'A Obra-prima' },
        { word: 'Impressionnant', translation: 'Impressionante' },
        { word: 'La Chanson', translation: 'A Canção' },
      ],
      prompts: [
        'Quel est votre film français préféré?',
        'Si vous pouviez visiter un musée à Paris, lequel choisiriez-vous?',
        "Décrivez une œuvre d'art qui vous touche.",
      ],
      exercise: 'Escreva uma mini-resenha (5 frases) sobre um filme ou livro francês que você conhece. Use adjetivos como "magnifique", "impressionnant", etc.',
      challengeText: 'Assista a um curta-metragem francês no YouTube e compartilhe sua opinião na comunidade em francês!',
      isActive: true,
      publishedAt: new Date(),
    },
  })

  // ===== ENCONTROS =====
  const nextThursday = new Date()
  nextThursday.setDate(nextThursday.getDate() + ((4 - nextThursday.getDay() + 7) % 7 || 7))
  nextThursday.setHours(19, 30, 0, 0)

  await prisma.meeting.upsert({
    where: { id: 'meeting-seed-1' },
    update: {},
    create: {
      id: 'meeting-seed-1',
      title: 'Conversação: Cinema Francês',
      level: 'INICIANTE',
      scheduledAt: nextThursday,
      duration: 60,
      meetingUrl: 'https://meet.google.com/abc-defg-hij',
      maxParticipants: 8,
      description: 'Vamos conversar sobre filmes franceses clássicos e modernos. Traga seu filme favorito para discutir!',
      weekContentId: week4.id,
    },
  })

  const nextSaturday = new Date()
  nextSaturday.setDate(nextSaturday.getDate() + ((6 - nextSaturday.getDay() + 7) % 7 || 7))
  nextSaturday.setHours(10, 0, 0, 0)

  await prisma.meeting.upsert({
    where: { id: 'meeting-seed-2' },
    update: {},
    create: {
      id: 'meeting-seed-2',
      title: 'Clube de Leitura: Le Petit Prince',
      level: 'INTERMEDIARIO',
      scheduledAt: nextSaturday,
      duration: 90,
      meetingUrl: 'https://meet.google.com/xyz-abcd-efg',
      maxParticipants: 6,
      description: 'Leitura e discussão dos capítulos 1-5 de "O Pequeno Príncipe" em francês.',
    },
  })

  const nextWednesday = new Date()
  nextWednesday.setDate(nextWednesday.getDate() + ((3 - nextWednesday.getDay() + 7) % 7 || 7))
  nextWednesday.setHours(20, 0, 0, 0)

  await prisma.meeting.upsert({
    where: { id: 'meeting-seed-3' },
    update: {},
    create: {
      id: 'meeting-seed-3',
      title: 'Atelier de Pronúncia',
      level: 'INICIANTE',
      scheduledAt: nextWednesday,
      duration: 45,
      meetingUrl: 'https://meet.google.com/pqr-stuv-wxy',
      maxParticipants: 10,
      description: 'Foco em pronúncia dos sons mais difíceis do francês: R, U, nasais. Exercícios práticos e correção ao vivo.',
    },
  })

  // ===== POSTS NA COMUNIDADE =====
  await prisma.post.upsert({
    where: { id: 'post-seed-1' },
    update: {},
    create: {
      id: 'post-seed-1',
      content: 'Gente, acabei de assistir "Amélie Poulain" pela terceira vez e toda vez descubro algo novo! O vocabulário da semana sobre cultura me ajudou a entender várias expressões que antes passavam despercebidas. Alguém mais ama esse filme? 🎬✨',
      type: 'PRATICA',
      level: 'INICIANTE',
      authorId: isa.id,
    },
  })

  await prisma.post.upsert({
    where: { id: 'post-seed-2' },
    update: {},
    create: {
      id: 'post-seed-2',
      content: 'Dúvida: qual a diferença entre "c\'est" e "il est"? Sempre me confundo na hora de descrever coisas. Alguém tem uma dica prática? 🤔',
      type: 'DUVIDA',
      level: 'INICIANTE',
      authorId: thiago.id,
    },
  })

  await prisma.post.upsert({
    where: { id: 'post-seed-3' },
    update: {},
    create: {
      id: 'post-seed-3',
      content: 'Fiz o desafio da semana! Gravei um áudio me apresentando e descrevendo meu look. Foi difícil mas muito divertido. Quem mais vai participar? 💪🇫🇷',
      type: 'DESAFIO',
      level: 'INTERMEDIARIO',
      authorId: isa.id,
      isFeatured: true,
    },
  })

  await prisma.post.upsert({
    where: { id: 'post-seed-4' },
    update: {},
    create: {
      id: 'post-seed-4',
      content: 'O encontro de conversação de quinta foi incrível! Mardia criou um ambiente super acolhedor. Consegui falar frases inteiras sem travar. Progresso! 🥳',
      type: 'DISCUSSAO',
      authorId: thiago.id,
    },
  })

  // ===== EVENTO PREMIUM =====
  const eventDate = new Date()
  eventDate.setMonth(eventDate.getMonth() + 1)
  eventDate.setHours(14, 0, 0, 0)

  await prisma.premiumEvent.upsert({
    where: { id: 'event-seed-1' },
    update: {},
    create: {
      id: 'event-seed-1',
      title: 'Café & Conversação: Encontro Presencial',
      description: 'Um encontro exclusivo para membros Premium em um café francês. Prática de conversação, networking e imersão cultural em um ambiente acolhedor.',
      city: 'São Paulo',
      date: eventDate,
      maxSpots: 15,
      spotsLeft: 12,
    },
  })

  // ===== CUPOM DEMO =====
  await prisma.coupon.upsert({
    where: { code: 'BONJOUR20' },
    update: {},
    create: {
      code: 'BONJOUR20',
      discountType: 'PERCENTAGE',
      discountValue: 20,
      maxUses: 50,
      currentUses: 3,
      isActive: true,
    },
  })

  // ===== PRODUTO DIGITAL: Resumos Verbais =====
  await prisma.digitalProduct.upsert({
    where: { slug: 'resumos-verbais' },
    update: {},
    create: {
      slug: 'resumos-verbais',
      title: 'Resumos Verbais',
      description: 'Os principais tempos verbais do francês num só lugar! E-book com explicações, exercícios, correções e 3 vídeo aulas.',
      price: 47.00,
      fileUrl: '/uploads/produtos/resumos-verbais.pdf',
      fileName: 'Resumos-Verbais-Le-Cercle.pdf',
      isActive: true,
    },
  })

  // ===== PRODUTO DIGITAL: Guia DELF B2 =====
  await prisma.digitalProduct.upsert({
    where: { slug: 'guia-delf-b2' },
    update: {},
    create: {
      slug: 'guia-delf-b2',
      title: 'Guia do DELF B2',
      description: 'E-book que destrincha e organiza a prova do DELF B2, a certificação que a maioria das universidades francófonas pede. Explicação sobre cada parte da prova e roteiros de como fazer cada uma delas.',
      price: 39.90,
      fileUrl: '/uploads/produtos/guia-delf-b2.pdf',
      fileName: 'Guia-DELF-B2-Le-Cercle.pdf',
      isActive: true,
    },
  })

  // ===== CLUBE: Francês Básico =====
  const clubBasico = await prisma.club.upsert({
    where: { slug: 'frances-basico' },
    update: {},
    create: {
      slug: 'frances-basico',
      name: 'Francês Básico',
      description: 'Conteúdo fundamental para quem está começando no francês. Acessível a todos os planos.',
      minPlan: 'monthly',
      sortOrder: 1,
    },
  })

  const clubPremium = await prisma.club.upsert({
    where: { slug: 'experiencias-premium' },
    update: {},
    create: {
      slug: 'experiencias-premium',
      name: 'Experiências Premium',
      description: 'Conteúdo exclusivo para membros Premium. Masterclasses, entrevistas e imersões culturais.',
      minPlan: 'premium',
      sortOrder: 2,
    },
  })

  // ===== CURSO: Primeiros Passos no Francês =====
  // ===== CURSO 1: Présent de l'Indicatif (YouTube) =====
  const curso1 = await prisma.course.upsert({
    where: { slug: 'present-de-lindicatif' },
    update: {},
    create: {
      slug: 'present-de-lindicatif',
      title: 'Curso Présent de l\'Indicatif',
      description: 'Tudo que você precisa saber sobre o principal e mais utilizado tempo verbal da língua francesa. O primeiro que a gente aprende: o presente!',
      level: 'INICIANTE',
      clubId: clubBasico.id,
      isFree: true,
      isPublished: true,
      sortOrder: 1,
    },
  })

  const aulasPresent = [
    { slug: 'aula-0-introducao', title: 'Aula 0 — Introdução', videoUrl: 'https://youtu.be/b6T6-fvox8I', duration: 10, sortOrder: 1 },
    { slug: 'aula-1-present', title: 'Aula 1 — Présent de l\'indicatif', videoUrl: 'https://youtu.be/loi51vXe3H0', duration: 15, sortOrder: 2 },
    { slug: 'aula-2-grupo-1', title: 'Aula 2 — Verbos do 1º grupo', videoUrl: 'https://youtu.be/SN50sYAjrd4', duration: 12, sortOrder: 3 },
    { slug: 'aula-3-grupo-2', title: 'Aula 3 — Verbos do 2º grupo', videoUrl: 'https://youtu.be/5km6rmM-3h0', duration: 14, sortOrder: 4 },
    { slug: 'aula-4-grupo-3', title: 'Aula 4 — Verbos do 3º grupo', videoUrl: 'https://youtu.be/7Xb-B3K7cMU', duration: 16, sortOrder: 5 },
    { slug: 'aula-5-revisao', title: 'Aula 5 — Revisão e prática', videoUrl: 'https://youtu.be/R44zqzlkK2s', duration: 13, sortOrder: 6 },
  ]

  for (const aula of aulasPresent) {
    await prisma.lesson.upsert({
      where: { courseId_slug: { courseId: curso1.id, slug: aula.slug } },
      update: {},
      create: {
        slug: aula.slug,
        title: aula.title,
        videoUrl: aula.videoUrl,
        duration: aula.duration,
        courseId: curso1.id,
        sortOrder: aula.sortOrder,
        isPublished: true,
      },
    })
  }

  // ===== CURSO 2: Material Présent de l'Indicatif (link externo) =====
  const curso2 = await prisma.course.upsert({
    where: { slug: 'material-present-indicatif' },
    update: {},
    create: {
      slug: 'material-present-indicatif',
      title: 'Material: Présent de l\'Indicatif',
      description: 'Apresentação completa com explicações visuais sobre o presente do indicativo em francês. Material complementar ao curso em vídeo.',
      level: 'INICIANTE',
      clubId: clubBasico.id,
      isFree: true,
      isPublished: true,
      sortOrder: 2,
    },
  })

  await prisma.lesson.upsert({
    where: { courseId_slug: { courseId: curso2.id, slug: 'apresentacao-completa' } },
    update: {},
    create: {
      slug: 'apresentacao-completa',
      title: 'Présent de l\'Indicatif — Apresentação Completa',
      videoUrl: 'https://www.canva.com/design/DAFs205OVsA/q4I5cxQDRlU5zFgURJb21A/view?utm_content=DAFs205OVsA&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hcced075809',
      materialUrl: 'https://www.canva.com/design/DAFs205OVsA/q4I5cxQDRlU5zFgURJb21A/view?utm_content=DAFs205OVsA&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hcced075809',
      materialName: 'Apresentação Canva',
      content: 'Clique no botão abaixo para abrir o material completo sobre o Présent de l\'Indicatif. A apresentação abre em uma nova aba.',
      duration: 30,
      courseId: curso2.id,
      sortOrder: 1,
      isPublished: true,
    },
  })

  console.log('')
  console.log('=== SEED CONCLUÍDO ===')
  console.log('')
  console.log('ADMIN (gestora):')
  console.log('  Email: mardia@lecercle.com')
  console.log('  Senha: admin123')
  console.log('')
  console.log('MEMBRO DEMO (Mardia como aluna):')
  console.log('  Email: mardia@idiomascommardia.com')
  console.log('  Senha: mardia123')
  console.log('')
  console.log('MEMBROS:')
  console.log('  Isadora: isa@lecercle.com / isa12345')
  console.log('  Thiago: thiago@lecercle.com / thiago123')
  console.log('')
  console.log('CUPOM: BONJOUR20 (20% off)')
  console.log('')
  console.log('BIBLIOTECA: 4 semanas de conteúdo')
  console.log('  Semana 1: L\'Art de Vivre à Paris')
  console.log('  Semana 2: La Gastronomie Française')
  console.log('  Semana 3: La Mode et le Style')
  console.log('  Semana 4: La Culture et les Arts (ATIVA)')
  console.log('')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
