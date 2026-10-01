// Pilares, problemas comuns, prática, ferramentas, professor, questionário, trilhas e checklist.

export const pillars = [
  {
    id: 'som', title: 'Som', short: 'A identidade do flautista.',
    what: 'A qualidade, a estabilidade e a flexibilidade do som em todos os registros e dinâmicas.',
    why: 'É a primeira coisa que o ouvinte percebe. Tudo o que você toca passa pelo seu som.',
    exercises: ['Notas longas com crescendo e diminuendo', 'Exercícios de Moyse em semitons descendentes', 'Harmônicos', 'Melodias lentas'],
    mistakes: ['Forçar o volume', 'Tensão nos lábios', 'Estudar o som sem escutar'],
    signs: ['Som estável em p e f', 'Menos ar desperdiçado', 'Registros mais homogêneos'],
    methods: ['moyse-sonorite', 'wye-pratica'],
  },
  {
    id: 'respiracao', title: 'Respiração', short: 'A matéria-prima do som.',
    what: 'Inspiração eficiente e administração do ar ao longo das frases.',
    why: 'Sem ar organizado, não há som estável, frase longa nem tranquilidade no palco.',
    exercises: ['Expiração controlada em tempos crescentes', 'Inspirações rápidas e silenciosas', 'Planejamento de respirações na partitura'],
    mistakes: ['Levantar os ombros', 'Encher demais e criar tensão', 'Respirar só quando falta ar'],
    signs: ['Frases mais longas com conforto', 'Respirações sem ruído', 'Menos cansaço'],
    methods: ['wye-pratica'],
  },
  {
    id: 'articulacao', title: 'Articulação', short: 'A dicção da flauta.',
    what: 'Ataques, staccato, legato, acentos, duplo e triplo golpe de língua.',
    why: 'É o que torna a música clara e compreensível — como a dicção na fala.',
    exercises: ['Notas repetidas com metrônomo', 'Padrões de articulação em escalas', 'Duplo golpe só com a sílaba de trás'],
    mistakes: ['Língua batendo com força', 'Parar o ar entre notas curtas', 'Sílabas desiguais no duplo'],
    signs: ['Ataques limpos e iguais', 'Staccato com som cheio', 'Duplo golpe regular'],
    methods: ['wye-pratica', 'taffanel-gaubert'],
  },
  {
    id: 'afinacao', title: 'Afinação', short: 'Ouvir antes de olhar.',
    what: 'A capacidade de ajustar a altura das notas continuamente, sozinho e em grupo.',
    why: 'Afinação é escuta em ação. Em grupo, é condição para fazer música junto.',
    exercises: ['Notas longas com drone', 'Intervalos com afinador ocasional', 'Escalas lentas com nota pedal'],
    mistakes: ['Tocar olhando o afinador o tempo todo', 'Corrigir só com o ajuste da cabeça', 'Ignorar tendências de cada nota'],
    signs: ['Percebe e corrige desvios sozinho', 'Afinação estável em dinâmicas diferentes'],
    methods: ['wye-pratica', 'moyse-sonorite'],
  },
  {
    id: 'tecnica', title: 'Técnica', short: 'Liberdade construída com controle.',
    what: 'Coordenação, regularidade e eficiência dos dedos, da língua e do ar.',
    why: 'Técnica é a ferramenta que permite tocar o que você imagina.',
    exercises: ['Escalas e arpejos', 'Exercícios diários de Taffanel & Gaubert', 'Reichert', 'Ritmos pontuados'],
    mistakes: ['Velocidade antes do controle', 'Dedos levantados demais', 'Tensão nas mãos'],
    signs: ['Passagens regulares', 'Menos esforço', 'Andamentos sobem naturalmente'],
    methods: ['taffanel-gaubert', 'reichert', 'andersen'],
  },
  {
    id: 'leitura', title: 'Leitura', short: 'Transformar símbolos em som.',
    what: 'Ler ritmo, notas, articulações e dinâmicas — e ler à primeira vista com fluência.',
    why: 'Uma boa leitura acelera todo o aprendizado e é essencial para tocar em grupo.',
    exercises: ['Leitura diária de material mais fácil', 'Solfejo rítmico', 'Duetos'],
    mistakes: ['Decorar tudo de ouvido e não ler', 'Parar a cada erro na leitura à primeira vista'],
    signs: ['Lê mais rápido', 'Entende a estrutura antes de tocar'],
    methods: ['rubank', 'altes', 'cavally'],
  },
  {
    id: 'interpretacao', title: 'Interpretação', short: 'Decisões musicais fundamentadas.',
    what: 'Fraseado, caráter, estilo, cores, vibrato e narrativa.',
    why: 'É a razão de todo o resto: fazer música, comunicar.',
    exercises: ['Cantar a frase', 'Gravar versões diferentes', 'Ouvir gravações comparadas'],
    mistakes: ['Tocar só as notas', 'Copiar um intérprete sem entender', 'Exagerar efeitos'],
    signs: ['Escolhas conscientes', 'Frases com direção', 'Caráter claro'],
    methods: ['moyse-interpretation', 'quantz-versuch'],
  },
  {
    id: 'repertorio', title: 'Repertório', short: 'O mapa das obras que formam o flautista.',
    what: 'Conhecimento e prática de obras de diferentes épocas, estilos e formações.',
    why: 'O repertório é onde técnica e música se encontram — e onde você se descobre como artista.',
    exercises: ['Uma obra de cada período por ano', 'Ouvir o repertório completo de um compositor', 'Música de câmara'],
    mistakes: ['Escolher obras difíceis demais cedo', 'Tocar sempre o mesmo estilo'],
    signs: ['Repertório variado', 'Consegue preparar uma obra com autonomia'],
    methods: ['andersen', 'karg-elert'],
  },
];

export const problems = [
  {
    id: 'som-soproso', title: 'Meu som está soproso.',
    causes: ['Abertura dos lábios grande demais', 'Direção do ar fora da borda', 'Porta-lábio muito coberto ou descoberto', 'Ar sem velocidade (ou com tensão)', 'Sapatilhas vazando (problema do instrumento)'],
    observe: ['Use um espelho: a abertura dos lábios é pequena e centralizada?', 'O som melhora em alguma nota específica?', 'O chiado diminui com menos volume?'],
    strategies: ['Notas longas no registro médio, buscando “o centro” do som', 'Exercícios com apenas a cabeça da flauta', 'Variar levemente a direção do ar e ouvir', 'Moyse — De la sonorité; Wye — vol. 1'],
    avoid: ['Soprar mais forte para “esconder” o ar', 'Apertar os lábios'],
    help: 'Se o som continua soproso após semanas de estudo atento, peça a um professor para avaliar a embocadura — e a um técnico para verificar vedação das sapatilhas.',
  },
  {
    id: 'agudo', title: 'Meu agudo não sai.',
    causes: ['Ar lento ou mal direcionado', 'Tensão na garganta ou nos lábios', 'Digitação imprecisa', 'Excesso de pressão do porta-lábio'],
    observe: ['O agudo sai em harmônicos?', 'A nota sai em dinâmica forte e não em piano?', 'Você está levantando os ombros?'],
    strategies: ['Harmônicos a partir das notas graves', 'Escalas lentas subindo ao agudo', 'Abertura menor e ar mais rápido — sem força'],
    avoid: ['Pressionar a flauta contra o lábio', 'Forçar com o volume'],
    help: 'Procure orientação se houver dor, cansaço excessivo ou se a dificuldade persistir por meses.',
  },
  {
    id: 'sem-ar', title: 'Fico sem ar.',
    causes: ['Inspiração curta ou alta (ombros)', 'Abertura de lábios grande, desperdiçando ar', 'Respirações mal planejadas', 'Tensão'],
    observe: ['Quanto tempo você sustenta uma nota em mf?', 'Onde você está respirando na música?', 'O som está soproso?'],
    strategies: ['Planejar respirações na partitura', 'Exercícios de expiração controlada', 'Trabalhar a eficiência do som (menos ar perdido)'],
    avoid: ['Esperar faltar ar para respirar', 'Encher demais o pulmão e travar'],
    help: 'Se houver tontura frequente ou desconforto, procure orientação — e, se necessário, avaliação médica.',
  },
  {
    id: 'lingua-dedos', title: 'Minha língua não acompanha meus dedos.',
    causes: ['Falta de coordenação treinada', 'Andamento acima do controle', 'Língua com movimento grande'],
    observe: ['O problema aparece em notas repetidas ou só em escalas?', 'Em qual andamento começa?'],
    strategies: ['Notas repetidas com metrônomo', 'Escalas em ritmos variados', 'Tocar com articulação e depois só ligado, comparando'],
    avoid: ['Acelerar para ver se sai', 'Treinar sempre no mesmo andamento'],
    help: 'Se nenhum ajuste de andamento resolve, um professor pode identificar a origem (dedos ou língua).',
  },
  {
    id: 'rapido', title: 'Não consigo tocar rápido.',
    causes: ['Dedos levantados demais', 'Tensão nas mãos', 'Falta de estudo lento e regular', 'Leitura insegura do trecho'],
    observe: ['Observe os dedos em vídeo', 'A passagem está segura em andamento lento?'],
    strategies: ['Estudo lento com metrônomo e subida gradual', 'Ritmos pontuados e agrupamentos', 'Estudar de trás para frente', 'Grupos de notas com pausa (chunking)'],
    avoid: ['Repetir rápido e errado', 'Tocar sempre do início'],
    help: 'Persistindo dor, tensão ou estagnação, peça orientação: pode ser postura das mãos.',
  },
  {
    id: 'afinacao-oscila', title: 'Minha afinação oscila.',
    causes: ['Ar instável', 'Mudanças de dinâmica sem ajuste', 'Embocadura que se move demais', 'Pouca escuta'],
    observe: ['Em quais notas oscila?', 'Ela sobe no forte e cai no piano?'],
    strategies: ['Notas longas com drone', 'Dinâmicas com afinador ocasional', 'Ouvir gravações do próprio estudo'],
    avoid: ['Olhar o afinador o tempo todo', 'Corrigir só movendo a cabeça da flauta'],
    help: 'Professores ajudam a identificar tendências específicas do seu instrumento e da sua embocadura.',
  },
  {
    id: 'piano', title: 'Não consigo tocar piano.',
    causes: ['Diminuir a velocidade do ar demais', 'Abertura de lábios grande', 'Medo de a nota não sair'],
    observe: ['O som desaparece ou fica soproso?', 'A afinação cai?'],
    strategies: ['Diminuendos lentos em notas longas', 'Abertura menor com ar ainda rápido', 'Melodias lentas em piano'],
    avoid: ['Simplesmente soprar menos', 'Fechar a garganta'],
    help: 'O piano é uma habilidade avançada; peça orientação para ajustar a embocadura.',
  },
  {
    id: 'registros', title: 'Meu som muda entre os registros.',
    causes: ['Embocadura rígida', 'Mudança brusca de pressão', 'Falta de exercícios de homogeneidade'],
    observe: ['Em qual passagem de registro o som muda mais?'],
    strategies: ['Moyse — notas ligadas entre registros', 'Harmônicos', 'Oitavas lentas'],
    avoid: ['Forçar o grave', 'Apertar no agudo'],
    help: 'Um professor pode observar movimentos de lábio e mandíbula que você não percebe.',
  },
  {
    id: 'nao-evoluo', title: 'Estudo bastante, mas não evoluo.',
    causes: ['Estudo sem objetivo claro', 'Repetição mecânica', 'Nunca gravar', 'Material inadequado ao nível', 'Cansaço'],
    observe: ['Você sabe o objetivo de cada exercício?', 'Quando foi a última vez que você se gravou?'],
    strategies: ['Definir 1 objetivo por sessão', 'Gravar e ouvir', 'Diário de estudo', 'Rever o plano com um professor'],
    avoid: ['Estudar mais horas sem mudar o método', 'Tocar só o que já sabe'],
    help: 'Este é um dos melhores momentos para buscar acompanhamento individual: um plano bem feito muda tudo.',
  },
  {
    id: 'interpretar', title: 'Consigo tocar as notas, mas não consigo interpretar.',
    causes: ['Atenção só às notas', 'Pouca escuta de referências', 'Falta de análise da obra'],
    observe: ['Você sabe dizer o caráter da peça em uma frase?', 'Onde está o ponto culminante de cada frase?'],
    strategies: ['Cantar antes de tocar', 'Ouvir gravações comparadas', 'Escrever o caráter de cada seção', 'Gravar versões diferentes'],
    avoid: ['Copiar uma gravação', 'Efeitos sem motivo'],
    help: 'Interpretação se desenvolve muito com conversa e troca — aulas e masterclasses ajudam.',
  },
];

export const principles = [
  { id: 'planejamento', title: 'Planejamento', text: 'Saiba o que vai estudar antes de pegar a flauta.' },
  { id: 'rotina', title: 'Rotina', text: 'Uma estrutura fixa libera energia para o que importa.' },
  { id: 'objetivos', title: 'Objetivos', text: 'Um objetivo concreto por sessão: “trecho X a 80 com som limpo”.' },
  { id: 'lento', title: 'Estudo lento', text: 'Devagar o suficiente para não errar. Precisão primeiro.' },
  { id: 'metronomo', title: 'Metrônomo', text: 'Mede o progresso e revela irregularidades.' },
  { id: 'repeticao', title: 'Repetição', text: 'Repetir certo, com atenção. Repetir errado consolida o erro.' },
  { id: 'gravacao', title: 'Gravação', text: 'O gravador é o professor que está sempre disponível.' },
  { id: 'revisao', title: 'Revisão', text: 'Volte ao que já aprendeu. Consolidar também é evoluir.' },
  { id: 'divisao', title: 'Divisão de trechos', text: 'Pequenos blocos, depois conexões, depois o todo.' },
  { id: 'erros', title: 'Estudo de erros', text: 'Todo erro tem uma causa. Encontre-a antes de repetir.' },
  { id: 'descanso', title: 'Descanso', text: 'Pausas curtas mantêm a atenção e protegem o corpo.' },
  { id: 'consistencia', title: 'Consistência', text: '30 minutos todos os dias valem mais que 4 horas no domingo.' },
];

// Rotinas exemplificativas. blocks: [minutos, atividade, foco]
export const routines = [
  { minutes: 15, title: '15 minutos', subtitle: 'Para dias corridos — sem perder o vínculo.', blocks: [[4, 'Notas longas', 'som'], [5, 'Uma escala em articulações diferentes', 'tecnica'], [6, 'Um trecho da peça atual', 'musica']] },
  { minutes: 30, title: '30 minutos', subtitle: 'O mínimo consistente para evoluir.', blocks: [[6, 'Som: notas longas e harmônicos', 'som'], [8, 'Escalas e arpejos', 'tecnica'], [6, 'Estudo (método)', 'estudo'], [10, 'Repertório', 'musica']] },
  { minutes: 45, title: '45 minutos', subtitle: 'Equilíbrio entre fundamento e música.', blocks: [[8, 'Som', 'som'], [5, 'Articulação', 'tecnica'], [10, 'Escalas / exercícios diários', 'tecnica'], [10, 'Estudo', 'estudo'], [12, 'Repertório', 'musica']] },
  { minutes: 60, title: '60 minutos', subtitle: 'Rotina completa com pausa.', blocks: [[10, 'Som e flexibilidade', 'som'], [10, 'Escalas, arpejos e articulação', 'tecnica'], [5, 'Pausa', 'pausa'], [15, 'Estudo', 'estudo'], [20, 'Repertório e gravação', 'musica']] },
  { minutes: 90, title: '90 minutos', subtitle: 'Para quem se prepara para objetivos maiores.', blocks: [[15, 'Som (Moyse / Wye)', 'som'], [15, 'Técnica diária', 'tecnica'], [5, 'Pausa', 'pausa'], [15, 'Estudo', 'estudo'], [10, 'Leitura à primeira vista', 'leitura'], [25, 'Repertório', 'musica'], [5, 'Gravação e anotações', 'musica']] },
  { minutes: 120, title: '120 minutos', subtitle: 'Em dois blocos, com descanso real.', blocks: [[15, 'Som', 'som'], [20, 'Técnica e articulação', 'tecnica'], [10, 'Pausa', 'pausa'], [20, 'Estudos', 'estudo'], [10, 'Leitura / excertos', 'leitura'], [35, 'Repertório (trechos e passagem completa)', 'musica'], [10, 'Gravação, escuta e plano do dia seguinte', 'musica']] },
];

export const ROUTINE_LABELS = { som: 'Som', tecnica: 'Técnica', estudo: 'Estudos', musica: 'Música', leitura: 'Leitura', pausa: 'Pausa' };

export const musicSteps = [
  { title: 'Ouvir', text: 'Ouça gravações diferentes. Forme uma ideia sonora da obra.' },
  { title: 'Ler', text: 'Leia a partitura sem tocar: tonalidade, compasso, andamento, indicações.' },
  { title: 'Analisar', text: 'Forma, frases, harmonia, pontos culminantes, caráter das seções.' },
  { title: 'Dividir', text: 'Separe em trechos pequenos. Identifique os mais difíceis.' },
  { title: 'Estudar devagar', text: 'Andamento em que não há erro. Precisão e som desde o primeiro dia.' },
  { title: 'Trabalhar ritmo', text: 'Conte, cante, bata palmas. Ritmo seguro libera o resto.' },
  { title: 'Articulação', text: 'Respeite cada indicação: ligaduras, pontos, acentos.' },
  { title: 'Afinação', text: 'Notas longas nos pontos críticos; drone quando possível.' },
  { title: 'Dinâmica', text: 'Construa planos sonoros e contrastes reais.' },
  { title: 'Fraseado', text: 'Direção, respiração, ponto culminante de cada frase.' },
  { title: 'Gravar', text: 'Grave trechos e a obra inteira.' },
  { title: 'Ouvir', text: 'Ouça como ouvinte, não como quem tocou.' },
  { title: 'Corrigir', text: 'Anote problemas e volte aos passos necessários.' },
  { title: 'Interpretar', text: 'Decisões conscientes de caráter, cor e tempo.' },
  { title: 'Performar', text: 'Toque para alguém. Simule a situação real.' },
];

export const tools = [
  { title: 'Afinadores', text: 'Para verificar tendências e treinar a escuta. Prefira os que oferecem drone (nota contínua) para afinar ouvindo.', examples: 'Afinadores digitais de mão e aplicativos de afinação (muitos combinam afinador, metrônomo e drone).' },
  { title: 'Metrônomos', text: 'Para medir e construir regularidade. Úteis: subdivisões, acentos configuráveis e clique em tempos diferentes.', examples: 'Metrônomos físicos ou aplicativos com subdivisão e treino de tempo.' },
  { title: 'Gravadores', text: 'O celular já é um ótimo gravador. Grave com frequência e ouça com atenção.', examples: 'Gravador do celular; gravadores portáteis; softwares de áudio como o Audacity (gratuito).' },
  { title: 'Aplicativos de partitura', text: 'Para organizar partituras, anotar e escrever música.', examples: 'Editores de partitura (ex.: MuseScore, gratuito) e leitores de PDF com anotação em tablet.' },
  { title: 'Bibliotecas', text: 'Acervos de partituras em domínio público e catálogos de editoras.', examples: 'IMSLP (Petrucci Music Library); bibliotecas de conservatórios e universidades.' },
  { title: 'Playbacks', text: 'Acompanhamentos para estudar repertório com piano ou orquestra.', examples: 'Gravações de acompanhamento publicadas por editoras e aplicativos de acompanhamento.' },
  { title: 'Diários de estudo', text: 'Registrar o que foi estudado, os andamentos e as percepções.', examples: 'Um caderno simples funciona muito bem; aplicativos de anotação também.' },
  { title: 'Ferramentas de análise', text: 'Visualizar o som (espectro, afinação ao longo do tempo) para estudos específicos.', examples: 'Softwares de análise de áudio, como o Sonic Visualiser (gratuito).' },
];

export const teacherPoints = [
  { title: 'Acompanhamento', text: 'Alguém que observa sua evolução ao longo do tempo e percebe padrões.' },
  { title: 'Correção', text: 'Detalhes de embocadura, postura e respiração que você não percebe sozinho.' },
  { title: 'Planejamento', text: 'O que estudar, em que ordem e por quê.' },
  { title: 'Repertório', text: 'Obras certas para o momento certo.' },
  { title: 'Feedback', text: 'Uma escuta experiente e honesta.' },
  { title: 'Desenvolvimento individual', text: 'Cada flautista tem um corpo, um som e um objetivo.' },
  { title: 'Prevenção de hábitos inadequados', text: 'Corrigir cedo é muito mais fácil que corrigir depois.' },
  { title: 'Interpretação', text: 'Conversas sobre música que ampliam suas escolhas.' },
];

export const philosophy = [
  'Todo flautista começa em algum lugar.',
  'Não existe evolução verdadeira sem fundamento.',
  'Estudar mais não significa necessariamente estudar melhor.',
  'Velocidade é consequência de controle.',
  'Técnica é uma ferramenta para a música.',
  'O objetivo não é apenas tocar músicas difíceis.',
  'O objetivo é desenvolver liberdade para fazer música.',
];

// Questionário "Descubra seu nível". Cada opção vale 0–3.
export const quiz = [
  { q: 'Há quanto tempo você toca flauta transversal?', options: ['Ainda não comecei ou menos de 6 meses', 'Entre 6 meses e 2 anos', 'Entre 2 e 5 anos', 'Mais de 5 anos de estudo regular'] },
  { q: 'Como está o seu som?', options: ['Ainda busco um som estável', 'Estável no registro médio e grave', 'Consistente nos três registros', 'Controlo cores e dinâmicas em toda a extensão'] },
  { q: 'Até onde vai sua extensão confortável?', options: ['Primeira oitava', 'Até o registro médio-agudo (Mi, Fá agudos)', 'Até o Lá/Si agudos', 'Toda a extensão, incluindo o Dó super-agudo'] },
  { q: 'E as escalas?', options: ['Conheço poucas ou nenhuma', 'Algumas maiores em uma ou duas oitavas', 'Maiores e menores em quase todas as tonalidades', 'Todas, em diversas articulações e andamentos'] },
  { q: 'Que tipo de estudo (método) você toca?', options: ['Ainda nenhum / método iniciante', 'Gariboldi, Köhler vol. 1 ou similar', 'Köhler vol. 2–3, Andersen op. 33 / 41', 'Andersen op. 15 / 60, Karg-Elert, Boehm'] },
  { q: 'Articulação: como está o duplo golpe de língua?', options: ['Ainda não sei o que é', 'Estou começando', 'Uso em andamentos moderados', 'Uso com fluência e regularidade'] },
  { q: 'Leitura musical:', options: ['Estou aprendendo a ler', 'Leio devagar, com esforço', 'Leio bem peças do meu nível', 'Leio à primeira vista com fluência'] },
  { q: 'Que repertório você toca?', options: ['Melodias simples', 'Peças fáceis e sonatas barrocas simples', 'Sonatas, Fauré, Syrinx...', 'Concertos de Mozart, Prokofiev, Poulenc...'] },
];

export const quizResults = [
  { id: 'primeiros-passos', title: 'Primeiros passos', min: 0, text: 'Você está construindo a base: som, postura, primeiras notas e leitura. É a fase mais importante da jornada — tudo o que vem depois depende dela.', next: ['Primeiro som e embocadura', 'Notas longas diárias', 'Primeiras músicas de cor'], href: '#primeiros-passos' },
  { id: 'fundamental', title: 'Fundamental', min: 7, text: 'Você já toca e lê, e agora precisa de estrutura: som em todos os registros, escalas, articulação e uma rotina organizada.', next: ['Rotina de 30–45 minutos', 'Escalas maiores e menores', 'Gariboldi / Köhler vol. 1'], href: '#fundamentos' },
  { id: 'intermediario', title: 'Intermediário', min: 13, text: 'A técnica está crescendo e o repertório se abre. É hora de unir mecanismo, estudos e interpretação.', next: ['Taffanel & Gaubert / Reichert', 'Andersen op. 33 / 41', 'Sonatas e repertório francês'], href: '#tecnica' },
  { id: 'avancado', title: 'Avançado', min: 19, text: 'Você tem recursos técnicos amplos. O foco passa a ser refinamento, interpretação, performance e autonomia artística.', next: ['Grandes estudos e caprichos', 'Concertos e repertório de audição', 'Estratégias de performance'], href: '#horizonte' },
];

export const goals = [
  { id: 'hobby', title: 'Quero tocar por hobby', path: ['Som confortável e postura saudável', 'Leitura funcional', 'Repertório que você ama (popular, trilhas, clássicos curtos)', 'Rotina curta e consistente (15–30 min)', 'Tocar com amigos e em grupos'], focus: 'Prazer, consistência e repertório significativo.' },
  { id: 'igreja', title: 'Quero tocar na igreja', path: ['Som estável e afinação', 'Leitura e cifras / transposição básica', 'Tocar com acompanhamento (teclado, violão, grupo)', 'Ornamentação simples e improvisação de contracantos', 'Preparação semanal de repertório'], focus: 'Afinação em grupo, leitura e segurança.' },
  { id: 'classico', title: 'Quero tocar repertório clássico', path: ['Fundamentos sólidos', 'Escalas em todas as tonalidades', 'Estudos progressivos (Köhler, Andersen)', 'Sonatas barrocas → obras românticas e francesas', 'Estilo e interpretação'], focus: 'Fundamento, estilo e uma progressão cuidadosa de repertório.' },
  { id: 'orquestra', title: 'Quero entrar em uma orquestra', path: ['Som que se projeta e se mistura', 'Afinação em grupo e escuta', 'Leitura à primeira vista', 'Excertos orquestrais', 'Experiência em orquestras jovens / comunitárias'], focus: 'Afinação, leitura, excertos e trabalho em grupo.' },
  { id: 'faculdade', title: 'Quero fazer faculdade', path: ['Conhecer o edital da instituição', 'Repertório de prova (peças e estudos)', 'Escalas e leitura à primeira vista', 'Teoria, percepção e solfejo', 'Simulações de prova'], focus: 'Planejamento com antecedência e preparação completa (instrumento + teoria).' },
  { id: 'audicoes', title: 'Quero me preparar para audições', path: ['Repertório exigido (ex.: concerto de Mozart)', 'Excertos orquestrais', 'Simulações com gravação', 'Gestão do nervosismo', 'Pico de performance planejado'], focus: 'Consistência sob pressão.' },
  { id: 'tecnica', title: 'Quero melhorar minha técnica', path: ['Diagnóstico: dedos, língua ou coordenação?', 'Escalas e exercícios diários', 'Estudo lento com metrônomo', 'Estudos de Andersen / Reichert', 'Aplicação no repertório'], focus: 'Controle antes de velocidade.' },
  { id: 'som', title: 'Quero melhorar meu som', path: ['Imagem sonora (ouvir referências)', 'Notas longas e harmônicos', 'Moyse — De la sonorité', 'Wye — vol. 1', 'Melodias lentas e cores'], focus: 'Atenção diária e escuta, poucos minutos com qualidade.' },
  { id: 'interpretacao', title: 'Quero melhorar minha interpretação', path: ['Ouvir muito e comparar', 'Análise da obra', 'Cantar as frases', 'Estilo e contexto histórico', 'Gravar versões diferentes'], focus: 'Escuta, conhecimento e decisões conscientes.' },
  { id: 'professor', title: 'Quero me tornar professor', path: ['Base técnica e musical sólida', 'Conhecer métodos e repertório progressivo', 'Pedagogia e didática', 'Observar aulas e lecionar com supervisão', 'Formação contínua'], focus: 'Entender o processo de aprendizagem — o seu e o dos outros.' },
];

export const checklist = [
  { group: 'Primeiros passos', items: ['Montagem e conservação', 'Postura', 'Produção sonora', 'Notas básicas', 'Leitura básica'] },
  { group: 'Fundamentos', items: ['Notas longas diárias', 'Respiração organizada', 'Legato', 'Staccato', 'Escalas maiores (1 oitava)', 'Afinação com drone'] },
  { group: 'Técnica', items: ['Escalas maiores e menores', 'Escala cromática', 'Arpejos', 'Registro agudo', 'Articulação dupla', 'Articulação tripla'] },
  { group: 'Música', items: ['Vibrato', 'Fraseado', 'Estudos', 'Repertório', 'Tocar em público'] },
];

// Técnicas (métodos) de estudo — como estudar com mais qualidade.
export const studyTechniques = [
  { id: 'ciclos', icon: 'timer', title: 'Ciclos de foco', short: '25 min de estudo + 5 min de pausa.', how: 'Estude em blocos curtos e intensos, com pausas reais (longe da flauta). A cada 4 ciclos, uma pausa maior. Use o cronômetro abaixo.' },
  { id: 'lento', icon: 'turtle', title: 'Estudo lento', short: 'Devagar o suficiente para não errar.', how: 'Encontre o andamento em que a passagem sai perfeita 3 vezes seguidas. Só então avance.' },
  { id: 'escada', icon: 'ladder', title: 'Escada do metrônomo', short: '+4 no metrônomo a cada acerto; −8 a cada erro.', how: 'Suba o andamento em pequenos passos. Errou? Volte dois degraus. A velocidade aparece sem tensão.' },
  { id: 'tres-certas', icon: 'check', title: 'Regra das 3 certas', short: 'Três vezes certas seguidas antes de seguir.', how: 'Se errar na segunda ou terceira, o contador volta a zero. Repetir certo é o que fixa.' },
  { id: 'blocos', icon: 'blocks', title: 'Blocos pequenos', short: 'Divida em trechos de 2 a 4 compassos.', how: 'Estude cada bloco separado, depois junte de dois em dois. O todo nasce das conexões.' },
  { id: 'reverso', icon: 'reverse', title: 'Encadeamento reverso', short: 'Comece pelo final do trecho.', how: 'Toque o último compasso, depois os dois últimos, e assim por diante. Você sempre termina no que já sabe.' },
  { id: 'ritmos', icon: 'rhythm', title: 'Variações rítmicas', short: 'Pontuado, invertido, em grupos.', how: 'Toque passagens rápidas em ritmos diferentes: longo-curto, curto-longo, grupos de 3 e 4. Os dedos ficam regulares.' },
  { id: 'intercalado', icon: 'shuffle', title: 'Prática intercalada', short: 'Alterne assuntos dentro da sessão.', how: 'Em vez de 40 minutos no mesmo trecho, alterne blocos (som → escala → trecho → som). O cérebro retém mais.' },
  { id: 'espacada', icon: 'calendar', title: 'Repetição espaçada', short: 'Revise em 1, 3 e 7 dias.', how: 'O que você aprendeu hoje volta amanhã, depois em 3 dias e em uma semana. Consolidar é evoluir.' },
  { id: 'mental', icon: 'mind', title: 'Prática mental', short: 'Estude sem a flauta.', how: 'Ouça a música por dentro, imagine os dedos e a respiração. Funciona muito bem para memorização e palco.' },
  { id: 'gravacao', icon: 'mic', title: 'Gravar e ouvir', short: 'O gravador é o professor sempre disponível.', how: 'Grave, espere alguns minutos e ouça como ouvinte. Anote um único ponto para corrigir.' },
  { id: 'diario', icon: 'book', title: 'Diário de estudo', short: 'O que estudou, andamento e uma observação.', how: 'Três linhas por dia bastam. Em um mês você enxerga o próprio progresso.' },
];
