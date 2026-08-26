/** Copy da página de vendas "Mesclada e Otimizada" em /pro2. Independente de CAMPANHA e PRO_COPY. */
export const PRO2_COPY = {
  brand: "Jogador PRO System",
  selo: "Treinos guiados para quem quer evoluir no futebol sem sair de casa",
  headline:
    "Mais velocidade, mais controle de bola e mais confiança em campo — treinando 10 a 20 minutos por dia, dentro de casa.",
  sub: "Você abre o app, vê o treino do dia e simplesmente faz. Sem procurar vídeo no YouTube, sem improviso, sem depender de campo todos os dias.",
  heroCta: "Quero ser Jogador PRO",
  heroCtaSecundario: "Ver planos",
  heroCtaPlano: "anual" as const,
  linhaPreco: "A partir de R$16,42/mês no plano anual · Pix ou cartão",
  comparacao:
    "Menos que uma mensalidade de escolinha — e aqui você treina todos os dias, não só uma vez por semana.",
  notaIdade: "A partir de 14 anos. Abaixo disso, com acompanhamento de um responsável.",

  barra: {
    prefixo: "14 dias de garantia",
    sufixo: "Acesso liberado na aprovação do Pix ou cartão. Cancele quando quiser.",
  },
  faixaTopo: "Microtreinos de 10 a 20 minutos para fazer em casa",

  provaRapida: {
    destaque: "+2.469 jogadores",
    texto: "já treinam com o Jogador PRO System — e seguem a mesma jornada guiada, do zero ao Elite.",
  },

  dor: {
    eyebrow: "O problema",
    title: "Se você joga bola mas sente que não evolui... o problema não é falta de esforço.",
    linhas: [
      "Você treina, mas continua travando no mesmo drible. Chega pro jogo com a sensação de que todo mundo evoluiu — menos você.",
      "Não é falta de vontade. É treinar sem plano, sem sequência, sem saber se o que você faz hoje realmente leva a algum lugar.",
      "Você abre o YouTube. Procura um exercício. No dia seguinte, procura outro. Depois outro. E continua sem saber: “o que eu devo treinar hoje?”",
    ],
    bullets: [
      "Você quer treinar, mas não sabe o que fazer em casa",
      "Cada dia é um exercício diferente, sem sequência, sem progresso real",
      "Não tem campo, academia ou personal por perto",
      "Cansa rápido e não vê diferença no próximo jogo",
    ],
    fecho:
      "O problema não é você. É a falta de um plano que caiba na sua rotina — e que realmente leve a algum lugar.",
  },

  publico: {
    eyebrow: "Antes de continuar",
    title: "Para quem é (e para quem não é)",
    sim: {
      titulo: "É pra você se",
      itens: [
        "Você joga bola (várzea, escolinha, time de base, only for fun) e quer evoluir de verdade",
        "Você não tem campo ou tempo pra treinar todo dia com bola",
        "Você já tentou treinar sozinho e não conseguiu manter consistência",
      ],
    },
    nao: {
      titulo: "Não é pra você se",
      itens: [
        "Você procura um substituto para treino técnico com professor/campo (o sistema complementa, não substitui)",
        "Você não está disposto a treinar pelo menos 10 minutos, alguns dias por semana",
      ],
    },
  },

  app: {
    eyebrow: "O app por dentro",
    title: "É isto que você abre todo dia.",
    sub: "Nada de PDF solto ou vídeo perdido em grupo. Um app de verdade: treino do dia, timer guiado e progresso salvo — tudo no seu celular, de onde você estiver.",
    telas: [
      {
        nome: "Treino de hoje",
        body: "Seu treino já está pronto. Veja o exercício, o tempo e a sequência da sessão.",
      },
      {
        nome: "Jornada",
        body: "Saiba onde você está e o que vem depois. Jornada guiada de 12 meses (52 semanas), organizada em mesociclos: Fundação, Domínio, Potência e Elite.",
      },
      {
        nome: "Biblioteca",
        body: "Treinos filtrados por categoria e objetivo — casa, campo, força, explosão, core.",
      },
      {
        nome: "Progresso",
        body: "Histórico, streak, XP e patentes para manter sua consistência.",
      },
    ],
    callout:
      "Se você já caiu em curso de perna de pau — PDF genérico ou vídeo revendido como “método” — repara na diferença: aqui é estrutura de verdade, com progresso que você acompanha todo dia, não um arquivo esquecido na pasta de downloads.",
  },

  treinos: {
    eyebrow: "Dentro do sistema",
    title: "Treinos reais que já estão dentro do app",
    sub: "Cada sessão vem com exercícios, tempo e execução guiada — pensada pra fazer em casa. Nada de improviso.",
    colunas: ["Treino", "Nível", "Duração", "Exercícios"],
    itens: [
      { nome: "⚙️ Base + Mobilidade", nivel: "Iniciante", duracao: "14 min", exercicios: "6" },
      { nome: "⚽ Controle de Bola", nivel: "Iniciante", duracao: "16 min", exercicios: "5" },
      { nome: "⚡ Explosão + Core", nivel: "Intermediário", duracao: "12 min", exercicios: "5" },
      { nome: "🫁 Resistência de Jogo", nivel: "Avançado", duracao: "22 min", exercicios: "5" },
      { nome: "🦵 Força de Pernas", nivel: "Avançado", duracao: "20 min", exercicios: "5" },
      { nome: "🔥 Modo Rápido", nivel: "Iniciante", duracao: "10 min", exercicios: "4" },
      { nome: "🏟️ Pré-partida", nivel: "Intermediário", duracao: "10 min", exercicios: "5" },
      { nome: "🔄 Pós-jogo", nivel: "—", duracao: "—", exercicios: "—" },
      { nome: "🏆 Performance Total", nivel: "PRO", duracao: "25 min", exercicios: "6" },
    ],
    cta: "Quero acessar todos os treinos",
  },

  recebe: {
    eyebrow: "Está tudo incluso",
    title: "Tudo que muda no seu treino em casa a partir de hoje",
    itens: [
      "Jornada guiada completa de 12 meses — 52 semanas em 4 mesociclos",
      "Treinos de 10 a 20 minutos por dia",
      "Controle de bola e fundamentos",
      "Força, explosão e core",
      "Resistência de jogo",
      "Biblioteca completa com filtros por categoria",
      "Modo Rápido para dias sem tempo",
      "Protocolos de pré-jogo e pós-jogo",
      "Histórico, streak, XP e patentes salvos na nuvem",
      "Acesso pelo celular, tablet ou computador",
      "Novos treinos e ciclos sem pagar nada a mais",
    ],
    fecho: "Um sistema. Um plano. Um treino por vez.",
  },

  provaSocial: {
    eyebrow: "Quem já treina",
    title: "O que os alunos mandam depois dos treinos",
    sub: "Mensagens reais de alunos que treinam no dia a dia, muitos deles em casa.",
    rodape: "Mais de 2.469 jogadores já treinam com o sistema.",
  },

  bonus: {
    eyebrow: "Bônus exclusivos",
    title: "E ainda tem de bônus, sem pagar nada a mais:",
    itens: [
      {
        titulo: "Bônus 1 — Modo Rápido",
        body: "Sessão de 10 minutos, montada na hora pros dias sem tempo. Você nunca mais perde o dia de treino por falta de tempo.",
      },
      {
        titulo: "Bônus 2 — Pré-partida e pós-jogo",
        body: "Ativação rápida antes de entrar em campo e recuperação guiada depois do jogo.",
      },
      {
        titulo: "Bônus 3 — Progresso gamificado",
        body: "Streak, XP e patentes que mostram sua evolução treino após treino — e seguram o hábito nos dias difíceis.",
      },
      {
        titulo: "Bônus 4 — Desafio Jogador PRO (30 dias)",
        body: "Um desafio para começar sua rotina e não deixar o treino para depois.",
      },
      {
        titulo: "Bônus 5 — Mapa da Evolução",
        body: "Uma orientação simples para entender o que desenvolver ao longo da sua jornada.",
      },
    ],
  },

  oferta: {
    eyebrow: "A oferta",
    title: "Acesso completo ao Jogador PRO System",
    sub: "Mesmo acesso completo em todos os planos. Sem fidelidade, cancele quando quiser.",
    recebeLabel: "Você recebe, em qualquer plano:",
    recebe: [
      "Jornada guiada completa de 12 meses",
      "Biblioteca + modos pré-partida e pós-jogo",
      "Histórico, streak e evolução na nuvem",
      "Atualizações e ciclos novos, sem custo adicional",
    ],
    urgencia: "Condição de lançamento por tempo limitado — os valores abaixo valem enquanto esta oferta estiver no ar.",
    itens: [
      {
        id: "mensal" as const,
        nome: "Mensal",
        badge: "",
        de: "",
        preco: "R$47",
        periodo: "por mês · sem fidelidade",
        parcelas: "Cancele quando quiser",
        inclui: ["Acesso completo", "Cancele quando quiser", "Garantia de 14 dias"],
        cta: "Começar no mensal",
      },
      {
        id: "semestral" as const,
        nome: "Semestral",
        badge: "Mais escolhido",
        de: "De R$282",
        preco: "R$147",
        periodo: "por 6 meses",
        parcelas: "Equivale a R$24,50/mês · em até 6x no cartão",
        inclui: ["Acesso completo", "Ciclos de Fundação e Domínio", "Garantia de 14 dias"],
        cta: "Quero começar agora — R$147",
      },
      {
        id: "anual" as const,
        nome: "Anual",
        badge: "Melhor valor",
        de: "De R$564",
        preco: "R$197",
        periodo: "por 12 meses",
        parcelas: "Equivale a R$16,42/mês · em até 12x no cartão",
        inclui: ["Acesso completo", "Jornada de 12 meses inteira", "Garantia de 14 dias"],
        cta: "Quero o plano anual",
      },
    ],
  },

  garantia: {
    titulo: "Você não precisa decidir no escuro",
    body: "Entre, veja os treinos, comece sua jornada, teste o sistema. Testou e não é pra você? Peça o reembolso em até 14 dias, conforme os termos da garantia. Assinatura sem fidelidade: você cancela quando quiser, sem multa.",
    curta: "14 dias de garantia · cancele quando quiser",
  },

  faq: {
    eyebrow: "Dúvidas",
    title: "Perguntas frequentes",
    itens: [
      {
        pergunta: "Preciso ter campo para treinar?",
        resposta:
          "Não. O sistema possui treinos desenvolvidos para diferentes ambientes, incluindo opções para fazer em casa.",
      },
      {
        pergunta: "Preciso de equipamentos?",
        resposta:
          "Não para os treinos desenvolvidos para casa. Quando um exercício exigir algo específico, isso fica indicado no próprio treino.",
      },
      {
        pergunta: "E se eu não tiver espaço em casa?",
        resposta:
          "Os treinos cabem em um espaço pequeno — o tamanho de um quarto já é suficiente pra maioria das sessões.",
      },
      {
        pergunta: "Quanto tempo preciso treinar por dia?",
        resposta:
          "Entre 10 e 20 minutos, dependendo do treino do dia. Nos dias corridos, o Modo Rápido resolve em 10 minutos.",
      },
      {
        pergunta: "Serve para a minha idade?",
        resposta: "A partir de 14 anos. Abaixo disso, com acompanhamento de um responsável.",
      },
      {
        pergunta: "Serve para qualquer nível?",
        resposta:
          "O Jogador PRO possui treinos com diferentes níveis de dificuldade. Escolha os que fazem sentido para o seu estágio atual.",
      },
      {
        pergunta: "Funciona para goleiro?",
        resposta:
          "Os treinos de força, explosão, resistência e mobilidade servem para qualquer posição, inclusive goleiro. Não existe, hoje, uma trilha exclusiva de fundamentos de goleiro dentro do sistema.",
      },
      {
        pergunta: "Quais são as formas de pagamento?",
        resposta: "Pix ou cartão, com parcelamento em até 12x no plano anual.",
      },
      {
        pergunta: "Como faço para cancelar?",
        resposta: "Direto no app ou pelo suporte, quando quiser, sem multa e sem burocracia.",
      },
      {
        pergunta: "Consigo usar no celular?",
        resposta:
          "Sim. O app funciona no celular, tablet e computador, com seu progresso salvo na nuvem.",
      },
      {
        pergunta: "O que acontece depois dos 12 meses?",
        resposta:
          "Seu acesso continua enquanto a assinatura estiver ativa, com os novos ciclos e atualizações incluídos. Sem fidelidade: você cancela quando quiser.",
      },
      {
        pergunta: "E se eu não gostar?",
        resposta: "Você conta com 14 dias de garantia, conforme os termos da oferta.",
      },
    ],
  },

  final: {
    title: "Você pode continuar treinando sem rumo...",
    linhas: [
      "...ou começar hoje a evoluir de verdade, em minutos por dia, dentro de casa.",
      "10–20 minutos por dia. Um treino por vez. Um caminho claro para evoluir.",
    ],
    cta: "Quero ser Jogador PRO",
    ctaSecundario: "Ver planos",
    hint: "14 dias de garantia · Cancele quando quiser · Acesso imediato após o pagamento",
    ps: "P.S.: Lembrando: são 14 dias de garantia incondicional. Se não for pra você, é só pedir o reembolso. O único risco aqui é continuar treinando sem plano.",
  },

  footerTagline: "microtreinos guiados para evoluir no jogo",
} as const;
