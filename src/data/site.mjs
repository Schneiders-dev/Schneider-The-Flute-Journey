// Configuração geral do site.
// Edite este arquivo para personalizar contato, URL pública e informações profissionais.
// Campos marcados com `placeholder: true` aparecem destacados no site até serem preenchidos.

export const site = {
  name: 'SCHNEIDER — THE FLUTE JOURNEY',
  shortName: 'Schneider',
  tagline: 'Uma jornada pela arte de aprender, estudar e tocar flauta transversal.',
  // URL pública definitiva (usada em canonical, Open Graph e sitemap).
  url: 'https://schneiders-dev.github.io/Schneider---The-Flute-Journey',
  locale: 'pt-BR',
  description:
    'Aulas de flauta transversal e um guia interativo para aprender, estudar e evoluir: primeiros sons, fundamentos, técnica, escalas, métodos, repertório, interpretação e os grandes pedagogos da flauta.',
  keywords: [
    'aulas de flauta transversal',
    'como aprender flauta transversal',
    'como estudar flauta',
    'métodos para flauta',
    'exercícios para flauta',
    'como melhorar o som da flauta',
    'como fazer vibrato na flauta',
    'como fazer staccato',
    'como tocar agudos na flauta',
    'como estudar escalas',
    'duplo golpe de língua',
    'estudos para flauta transversal',
  ],
};

// Contato — preencha para ativar os botões de WhatsApp / e-mail.
// whatsapp: apenas números com DDI e DDD, ex.: '5511999999999'
export const contact = {
  whatsapp: '5527997110720',
  email: '',
  instagram: 'https://www.instagram.com/schneiderflautist',
  youtube: '',
  city: '', // ex.: 'São Paulo — SP · aulas presenciais e online'
};

// Página "Conheça Schneider".
// IMPORTANTE: os itens com placeholder: true precisam ser escritos pelo próprio professor.
// O site não inventa biografia, formação ou experiência.
export const teacher = {
  name: 'Natan Schneider',
  role: 'Professor e idealizador de The Flute Journey',
  photo: 'assets/img/schneider.jpg', // opcional; se não existir, aparece um monograma
  intro:
    'Esta jornada foi organizada para que cada estudante entenda onde está, o que já construiu e qual é o próximo passo — com fundamento, clareza e música.',
  experience: [
    { label: 'Experiência artística', text: 'Descreva aqui sua trajetória como flautista: orquestras, grupos, recitais, gravações.', placeholder: true },
    { label: 'Formação', text: 'Descreva aqui sua formação: instituições, professores, cursos e masterclasses.', placeholder: true },
    { label: 'Experiência como professor', text: 'Descreva aqui há quanto tempo ensina, perfis de alunos e resultados de que se orgulha.', placeholder: true },
  ],
  methodology: [
    {
      title: 'Diagnóstico antes do plano',
      text: 'Cada aluno começa com uma escuta cuidadosa: som, respiração, postura, leitura, objetivos e rotina disponível. O plano nasce daí — não de um programa único para todos.',
    },
    {
      title: 'Fundamento como caminho',
      text: 'Som, respiração, articulação e afinação são trabalhados continuamente, em todos os níveis. A técnica existe para servir à música.',
    },
    {
      title: 'Aprender a estudar',
      text: 'O aluno aprende a planejar, gravar, ouvir, corrigir e medir a própria evolução. O objetivo é autonomia, não dependência.',
    },
    {
      title: 'Repertório com propósito',
      text: 'Cada obra é escolhida pelo que ela ensina e pelo que ela significa para o aluno — da primeira melodia ao recital.',
    },
  ],
  philosophy:
    'Um bom professor não deve criar dependência. Deve ensinar o aluno a compreender o próprio processo de aprendizagem.',
};

export const lessons = {
  formats: [
    { title: 'Aulas individuais', text: 'Atenção integral ao seu som, à sua técnica e ao seu objetivo. Cada aula parte de onde você está.' },
    { title: 'Frequência', text: 'Semanal (recomendada para construir consistência) ou quinzenal para quem já possui rotina estruturada de estudo.' },
    { title: 'Duração', text: 'Aulas de 50 a 60 minutos. Formatos especiais podem ser combinados para preparação de audições e recitais.' },
    { title: 'Acompanhamento', text: 'Entre as aulas: orientações de estudo, revisão de gravações e ajustes no plano quando necessário.' },
    { title: 'Materiais', text: 'Exercícios, rotinas e indicações de métodos e repertório organizados para o seu momento — sem apostilas genéricas.' },
    { title: 'Planejamento', text: 'Objetivos de curto, médio e longo prazo, revisados periodicamente. Você sempre sabe por que está estudando cada coisa.' },
  ],
  note: 'Valores, horários e modalidade (presencial ou online) são combinados no primeiro contato.',
};

// Área do seminário — expansível. Adicione novos seminários no início da lista.
// type: 'video' | 'pdf' | 'exercicio' | 'link' | 'material' | 'anotacao' | 'extra'
// url vazia = item marcado como "em breve".
export const seminars = [
  {
    id: 'seminario-1',
    title: 'Seminário de Flauta — Edição 1',
    date: '',
    description:
      'Material de apoio do seminário. Os conteúdos apresentados ao vivo estão organizados aqui para você continuar estudando no seu ritmo.',
    materials: [
      { type: 'exercicio', title: 'Rotina de sonoridade (long tones e harmônicos)', url: '#t-long-tones', description: 'O exercício-base apresentado no seminário, com variações por nível.' },
      { type: 'exercicio', title: 'Rotinas de estudo de 15 a 120 minutos', url: '#como-estudar', description: 'Modelos de organização do tempo de prática.' },
      { type: 'material', title: 'Como estudar uma música — passo a passo', url: '#estudar-musica', description: 'A sequência completa, do primeiro contato à performance.' },
      { type: 'material', title: 'Biblioteca de métodos comentada', url: '#metodos', description: 'Para que serve cada método e como ele entra na sua jornada.' },
      { type: 'video', title: 'Vídeos do seminário', url: '', description: 'Gravações e demonstrações — adicione os links aqui.' },
      { type: 'pdf', title: 'Slides e apostila do seminário (PDF)', url: '', description: 'Adicione aqui o PDF da apresentação.' },
      { type: 'anotacao', title: 'Anotações e perguntas frequentes', url: '', description: 'Respostas às perguntas feitas durante o seminário.' },
    ],
  },
];
