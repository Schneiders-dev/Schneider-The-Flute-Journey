// Provas da jornada. Em cada pergunta, a PRIMEIRA opção é a correta (o servidor embaralha).
// A correção acontece no servidor — o navegador nunca recebe o gabarito.
// `visual`: ilustração opcional (mesmas chaves usadas no conteúdo: 'staff:legato', 'fingering:B', ...).

export const QUIZ_RULES = { perStation: 5, secondsPerQuestion: 15, passMin: 4 };

export const stationQuizzes = {
  inicio: [
    { q: 'Como nasce o som na flauta transversal?', options: ['O ar soprado se divide na borda do orifício do bocal', 'Uma palheta vibra dentro da cabeça', 'Os lábios vibram dentro do bocal, como no trompete', 'As chaves vibram quando pressionadas'] },
    { q: 'Mesmo sendo geralmente de metal, a flauta pertence à família…', options: ['Das madeiras', 'Dos metais', 'Das cordas', 'Da percussão'] },
    { q: 'Quais são as três partes da flauta?', options: ['Cabeça, corpo e pé', 'Bocal, tubo e campana', 'Palheta, corpo e pé', 'Cabeça, braço e pé'] },
    { q: 'Onde fica o porta-lábio?', options: ['Na cabeça', 'No corpo', 'No pé', 'Entre o corpo e o pé'] },
    { q: 'Em que parte ficam as chaves das notas mais graves?', options: ['No pé', 'Na cabeça', 'No porta-lábio', 'Na coroa'], visual: 'flute-parts' },
    { q: 'Como se chamam as “almofadas” que fecham os orifícios sob as chaves?', options: ['Sapatilhas', 'Roletes', 'Molas', 'Anéis'] },
  ],
  'primeiro-contato': [
    { q: 'Ao montar a flauta, por onde devemos segurar as partes?', options: ['Pelas regiões lisas, sem mecanismo', 'Pelas chaves, para ter firmeza', 'Pelo porta-lábio', 'Tanto faz'] },
    { q: 'Como encaixar as partes?', options: ['Com leve rotação, sem forçar', 'Empurrando com força, em linha reta', 'Batendo levemente na mesa', 'Usando óleo nos encaixes'] },
    { q: 'O que fazer depois de tocar?', options: ['Secar o interior com vareta e pano e guardar no estojo', 'Lavar a flauta com água e sabão', 'Deixar montada para secar ao ar', 'Passar óleo nas sapatilhas'] },
    { q: 'Qual é a principal ideia da boa postura?', options: ['A flauta vem até você, sem tensão no corpo', 'Levantar bem os ombros', 'Inclinar a cabeça na direção da flauta', 'Segurar a flauta com força'] },
    { q: 'Quais são os principais pontos de apoio da flauta?', options: ['Queixo/lábio, base do indicador esquerdo e polegar direito', 'Os dez dedos sobre as chaves', 'Ombro esquerdo e polegar esquerdo', 'Apenas as duas mãos'], visual: 'support-points' },
    { q: 'Dedos muito levantados das chaves…', options: ['Custam tempo e precisão', 'Deixam o som mais bonito', 'Ajudam no agudo', 'Não fazem diferença'] },
  ],
  'primeiro-som': [
    { q: 'O que é embocadura?', options: ['A forma dos lábios e o direcionamento do ar', 'O nome do orifício do pé', 'A posição dos dedos', 'Um tipo de articulação'], visual: 'embouchure' },
    { q: 'Qual é um bom primeiro exercício de som?', options: ['Tocar só com a cabeça da flauta', 'Tocar a escala cromática completa', 'Começar pelo registro agudo', 'Tocar o mais forte possível'] },
    { q: 'Como deve ser a abertura dos lábios?', options: ['Pequena e flexível', 'Grande, para passar mais ar', 'Totalmente fechada', 'Com os lábios tensos'] },
    { q: 'Ao inspirar, os ombros devem…', options: ['Permanecer relaxados', 'Subir bem alto', 'Ir para a frente', 'Ficar tensos'], visual: 'breath' },
    { q: 'Qual nota está representada na digitação?', options: ['Si', 'Lá', 'Sol', 'Fá'], visual: 'fingering:B' },
    { q: 'Qual nota está escrita na pauta?', options: ['Sol', 'Lá', 'Si', 'Mi'], visual: 'note:G4' },
  ],
  fundamentos: [
    { q: 'Para que serve o metrônomo?', options: ['Medir e construir a regularidade do pulso', 'Afinar a flauta', 'Medir a intensidade do som', 'Substituir o professor'], visual: 'metronome' },
    { q: 'Quantos tempos dura esta figura num compasso 4/4?', options: ['4', '2', '1', '3'], visual: 'note:whole' },
    { q: 'Qual a melhor forma de treinar leitura à primeira vista?', options: ['Ler diariamente material um pouco mais fácil que o seu nível', 'Ler só peças muito difíceis', 'Decorar tudo de ouvido', 'Ler uma vez por mês'] },
    { q: 'O que dá liberdade ao fraseado?', options: ['Um ritmo sólido', 'Tocar sempre rápido', 'Ignorar as pausas', 'Usar muito vibrato'] },
    { q: 'Qual é a figura que vale metade da semínima?', options: ['Colcheia', 'Mínima', 'Semibreve', 'Pausa'] },
    { q: 'O som de um flautista depende principalmente…', options: ['Da embocadura, do ar e da imagem sonora que ele tem', 'Apenas da marca da flauta', 'Apenas da força do sopro', 'Do tamanho das mãos'] },
  ],
  'construcao-som': [
    { q: 'O que são “long tones”?', options: ['Notas longas, sustentadas com atenção ao som', 'Escalas rápidas', 'Notas curtas e destacadas', 'Trinados longos'], visual: 'staff:long-tone' },
    { q: 'O que indica este sinal?', options: ['Crescendo, depois diminuendo', 'Repetir o trecho', 'Acelerar e desacelerar', 'Respirar'], visual: 'staff:long-tone' },
    { q: 'Ao fazer crescendo na flauta, a tendência é…', options: ['A afinação subir — é preciso ajustar o ar', 'A afinação cair', 'O som ficar sempre mais grave', 'Nada mudar'] },
    { q: 'O que significa “p”?', options: ['Piano: suave', 'Forte', 'Pausa', 'Presto: rápido'], visual: 'dyn:p' },
    { q: 'Um bom long tone tem…', options: ['Início limpo, som estável e final controlado', 'Ataque explosivo', 'Muito vibrato desde o início', 'Final abrupto'] },
    { q: 'Quantas notas por dia é um bom começo para long tones?', options: ['Poucas, com atenção total (ex.: 5)', 'Todas as notas da flauta, sem pausa', 'Uma por semana', 'Só as agudas'] },
  ],
  respiracao: [
    { q: 'Respirar bem na flauta é…', options: ['Inspirar com eficiência e administrar o ar na frase', 'Encher o pulmão até travar', 'Respirar só quando falta ar', 'Respirar pelo nariz durante a nota'] },
    { q: 'O que indica a vírgula acima da pauta?', options: ['Respiração', 'Staccato', 'Fermata', 'Repetição'], visual: 'staff:breath' },
    { q: 'Onde se sente a expansão na inspiração?', options: ['Ao redor da cintura e das costelas', 'Apenas nos ombros', 'No pescoço', 'Nas bochechas'], visual: 'breath' },
    { q: '“Apoio” se refere a…', options: ['Controle estável do fluxo de ar, sem rigidez', 'Apoiar a flauta no ombro', 'Apertar o abdômen ao máximo', 'Segurar o ar na garganta'] },
    { q: 'Um bom hábito antes de tocar uma peça é…', options: ['Marcar as respirações na partitura', 'Respirar sempre no fim do compasso', 'Nunca respirar no meio da frase, mesmo sem ar', 'Tocar sem planejar'] },
    { q: 'Um sinal comum de que o ar está sendo desperdiçado é…', options: ['Som soproso', 'Som muito focado', 'Afinação estável', 'Frases longas sem esforço'] },
  ],
  articulacao: [
    { q: 'O que indicam os pontos sobre as notas?', options: ['Staccato (destacado)', 'Legato (ligado)', 'Acento', 'Trinado'], visual: 'staff:staccato' },
    { q: 'O que indica a curva sobre as notas?', options: ['Legato: tocar ligado', 'Respiração', 'Staccato', 'Repetição'], visual: 'staff:legato' },
    { q: 'Qual sílaba se usa no ataque simples?', options: ['“Tu” ou “du”', '“Ha”', '“Ki-ki”', '“Mm”'] },
    { q: 'Como deve ser a língua no ataque?', options: ['Libera o ar, sem bater', 'Bate com força nos dentes', 'Fica parada fora da boca', 'Não participa do ataque'] },
    { q: 'No staccato, o som deve ser…', options: ['Curto, mas cheio', 'Curto e fraco', 'Longo e ligado', 'Sem ar'] },
    { q: 'O que indica o sinal “>” sobre a nota?', options: ['Acento', 'Diminuendo', 'Staccato', 'Respiração'], visual: 'staff:accent' },
  ],
  afinacao: [
    { q: 'Afinar é principalmente…', options: ['Ouvir e ajustar continuamente', 'Olhar o afinador o tempo todo', 'Mexer só na cabeça da flauta', 'Tocar mais forte'], visual: 'tuner' },
    { q: 'Quando duas notas estão desafinadas, ouvimos…', options: ['Batimentos: o som “ondula”', 'Um som mais limpo', 'Nada diferente', 'Um eco'] },
    { q: 'Qual escala está escrita?', options: ['Dó maior', 'Sol maior', 'Fá maior', 'Lá menor'], visual: 'staff:c-major' },
    { q: 'O que é um arpejo?', options: ['As notas de um acorde tocadas uma de cada vez', 'Uma escala cromática', 'Um tipo de trinado', 'Uma nota longa'], visual: 'staff:arpeggio' },
    { q: 'Para treinar afinação, um ótimo recurso é…', options: ['Tocar com uma nota pedal (drone)', 'Tocar sempre sozinho, sem referência', 'Só usar o metrônomo', 'Tocar o mais rápido possível'] },
    { q: 'Quantos sustenidos tem Sol maior?', options: ['1 (Fá♯)', 'Nenhum', '2', '1 bemol'] },
  ],
  tecnica: [
    { q: 'O que são harmônicos na flauta?', options: ['Notas diferentes com a mesma digitação, mudando o ar', 'Notas tocadas por dois flautistas', 'Notas com vibrato', 'Notas do pé da flauta'], visual: 'staff:harmonics' },
    { q: 'Para o registro agudo, o mais importante é…', options: ['Ar rápido e direcionado, sem força', 'Pressionar a flauta contra o lábio', 'Tocar sempre fortíssimo', 'Apertar a garganta'] },
    { q: 'Velocidade é consequência de…', options: ['Controle', 'Força', 'Pressa', 'Sorte'] },
    { q: 'Estudar em ritmos pontuados ajuda a…', options: ['Coordenar dedos e língua e regularizar passagens', 'Afinar a flauta', 'Melhorar o vibrato', 'Respirar menos'], visual: 'staff:dotted' },
    { q: 'Se a passagem perde qualidade ao subir o metrônomo, você deve…', options: ['Voltar alguns pontos de andamento', 'Acelerar ainda mais', 'Parar de usar metrônomo', 'Tocar mais forte'] },
  ],
  escalas: [
    { q: 'Quantas formas de escala menor estudamos?', options: ['Três: natural, harmônica e melódica', 'Uma', 'Duas', 'Quatro'] },
    { q: 'A escala cromática percorre…', options: ['Todos os semitons', 'Só as notas naturais', 'Só as notas do acorde', 'Apenas tons inteiros'], visual: 'staff:chromatic' },
    { q: 'Qual escala está escrita?', options: ['Lá menor', 'Dó maior', 'Sol maior', 'Ré menor'], visual: 'staff:a-minor' },
    { q: 'Escalas em terças desenvolvem…', options: ['Coordenação e visão da tonalidade', 'Apenas o vibrato', 'Apenas a respiração', 'O registro grave'] },
    { q: 'Uma escala bem tocada tem…', options: ['Som igual, dedos regulares e afinação cuidadosa', 'Velocidade máxima', 'Acentos aleatórios', 'Respirações a cada nota'] },
  ],
  estudos: [
    { q: 'Duplo golpe de língua usa quais sílabas?', options: ['“Tu-cu” (ou “du-gu”)', '“Tu-tu”', '“Ha-ha”', '“La-la”'] },
    { q: 'No duplo golpe, a sílaba geralmente mais fraca no início é…', options: ['A de trás (“cu”/“gu”)', 'A da frente (“tu”)', 'As duas igualmente', 'Nenhuma'] },
    { q: 'O triplo golpe é usado sobretudo em…', options: ['Tercinas rápidas', 'Notas longas', 'Trinados', 'Escalas lentas'] },
    { q: 'Qual autor escreveu estudos op. 15, op. 30 e op. 33 muito usados por flautistas?', options: ['Joachim Andersen', 'Theobald Boehm', 'Johann J. Quantz', 'Marcel Moyse'] },
    { q: 'Um bom jeito de estudar um estudo difícil é…', options: ['Por trechos, devagar, e depois como peça inteira', 'Sempre do início ao fim, rápido', 'Só ler sem tocar', 'Pular os trechos difíceis'] },
  ],
  repertorio: [
    { q: 'Um bom repertório para o seu momento tem…', options: ['Desafios possíveis e muita música', 'Só obras virtuosísticas', 'Só obras muito fáceis', 'Só obras que você já sabe'] },
    { q: 'Händel e Bach pertencem a qual período?', options: ['Barroco', 'Romântico', 'Moderno', 'Clássico'] },
    { q: 'Qual destas obras é para flauta solo, de Debussy?', options: ['Syrinx', 'Fantaisie op. 79', 'Concerto K. 313', 'Carinhoso'] },
    { q: 'Pixinguinha e Joaquim Callado estão ligados a qual gênero?', options: ['Choro', 'Samba-enredo', 'Bossa nova', 'Frevo'] },
    { q: 'O Concerto em Sol maior K. 313 é de…', options: ['Mozart', 'Bach', 'Debussy', 'Telemann'] },
  ],
  interpretacao: [
    { q: 'O que é fraseado?', options: ['Organizar as notas em frases com direção', 'Tocar sempre ligado', 'Respirar a cada compasso', 'Usar o metrônomo'], visual: 'staff:phrase' },
    { q: 'O vibrato deve ser…', options: ['Um recurso expressivo, usado com intenção', 'Usado o tempo todo, igual', 'Proibido', 'Só para notas graves'], visual: 'vibrato' },
    { q: 'O que indica este sinal?', options: ['Fermata: sustentar a nota além do valor', 'Staccato', 'Respiração', 'Acento'], visual: 'staff:fermata' },
    { q: 'Timbre é…', options: ['A cor/qualidade do som', 'O volume do som', 'A velocidade', 'A afinação'] },
    { q: 'Um ótimo exercício de interpretação é…', options: ['Cantar a frase antes de tocar', 'Tocar sempre sem dinâmica', 'Copiar exatamente uma gravação', 'Ignorar o estilo'] },
  ],
  intermediario: [
    { q: 'No nível intermediário, o objetivo central é…', options: ['Unir técnica e interpretação', 'Só aumentar a velocidade', 'Parar de estudar som', 'Tocar apenas escalas'] },
    { q: 'Estudos típicos desse momento incluem…', options: ['Köhler e Andersen op. 33/41', 'Apenas métodos iniciantes', 'Só concertos virtuosísticos', 'Nenhum estudo'] },
    { q: 'O som nesse nível deve estar…', options: ['Consistente na maior parte da extensão', 'Só no grave', 'Só no agudo', 'Instável'] },
    { q: 'Que repertório costuma começar a aparecer?', options: ['Sonatas e peças de concerto', 'Só canções infantis', 'Só excertos de orquestra', 'Nenhum'] },
    { q: 'A rotina de estudo deve…', options: ['Incluir som, técnica, estudos e repertório', 'Ser só repertório', 'Ser só escalas', 'Ser improvisada todos os dias'] },
  ],
  avancado: [
    { q: 'No nível avançado, as escalas e arpejos devem estar…', options: ['Em todas as tonalidades', 'Só em Dó maior', 'Só nas maiores', 'Não são mais necessárias'] },
    { q: 'Qual destes é um estudo/coleção avançado?', options: ['Andersen op. 15', 'Rubank Elementary', 'Gariboldi op. 131', 'A Beginner’s Book'] },
    { q: 'O que passa a ganhar mais autonomia?', options: ['As escolhas interpretativas', 'A dependência do professor', 'O uso do afinador', 'A memorização'] },
    { q: 'Os concertos de Mozart para flauta são frequentes em…', options: ['Audições de orquestra', 'Primeiras aulas', 'Provas de teoria', 'Recitais infantis'] },
    { q: 'Um flautista avançado deve saber…', options: ['Planejar o próprio estudo', 'Estudar só o que gosta', 'Evitar gravar-se', 'Pular os fundamentos'] },
  ],
  performance: [
    { q: 'Uma boa preparação para recital inclui…', options: ['Simulações e gravações', 'Tocar a peça pela primeira vez no palco', 'Não dormir antes', 'Mudar o repertório na véspera'] },
    { q: 'Excertos orquestrais são…', options: ['Trechos de obras orquestrais pedidos em audições', 'Peças para flauta solo', 'Exercícios de respiração', 'Métodos iniciantes'] },
    { q: 'Para lidar com o nervosismo, ajuda…', options: ['Preparação, rotina e experiência de palco', 'Evitar tocar para pessoas', 'Tocar mais rápido', 'Ignorar a respiração'] },
    { q: 'A música de câmara desenvolve principalmente…', options: ['Escuta e trabalho em grupo', 'Só a técnica individual', 'Só a leitura', 'Só o agudo'] },
    { q: 'Tocar para alguém é…', options: ['Outra forma de estudar', 'Perda de tempo', 'Só para profissionais', 'Desnecessário'] },
  ],
  formacao: [
    { q: 'A formação artística vai além do instrumento: inclui…', options: ['História, análise, estilo e pedagogia', 'Apenas velocidade', 'Apenas um método', 'Só repertório popular'] },
    { q: 'Quem inventou o sistema de chaves da flauta moderna?', options: ['Theobald Boehm', 'Marcel Moyse', 'Paul Taffanel', 'Joachim Andersen'] },
    { q: 'Paul Taffanel é associado a…', options: ['Escola francesa de flauta', 'Invenção do saxofone', 'Choro brasileiro', 'Música eletrônica'] },
    { q: 'O tratado de Quantz (1752) é fonte importante sobre…', options: ['A prática musical do século XVIII', 'A flauta de Boehm', 'O jazz', 'A música contemporânea'] },
    { q: 'Na formação artística, a jornada…', options: ['Não termina: é curiosidade permanente', 'Termina no diploma', 'Termina no primeiro recital', 'Termina ao tocar rápido'] },
  ],
};

// Prova de nivelamento: conhecimento (valem 1 se correta) + autoavaliação (0–3).
export const placementTest = [
  { kind: 'self', q: 'Há quanto tempo você toca flauta transversal?', options: ['Ainda não comecei ou menos de 6 meses', 'Entre 6 meses e 2 anos', 'Entre 2 e 5 anos', 'Mais de 5 anos de estudo regular'] },
  { kind: 'self', q: 'Até onde vai sua extensão confortável?', options: ['Ainda busco um som estável', 'Primeira oitava (Ré a Ré)', 'Até o Mi/Fá do registro agudo', 'Até o Dó agudo (3ª oitava)'] },
  { kind: 'self', q: 'Quais escalas você toca com segurança?', options: ['Nenhuma ainda', 'Algumas maiores, uma oitava', 'Maiores e menores em várias tonalidades', 'Todas, em diversas articulações'] },
  { kind: 'self', q: 'O que você consegue tocar com segurança?', options: ['Ainda nenhuma música', 'Melodias simples', 'Estudos como Köhler / Gariboldi e sonatas barrocas', 'Concertos e estudos de Andersen'], visual: '' },
  { kind: 'know', q: 'Qual nota está escrita?', options: ['Lá', 'Sol', 'Si', 'Dó'], visual: 'note:A4' },
  { kind: 'know', q: 'Qual nota está escrita?', options: ['Ré', 'Mi', 'Dó', 'Fá'], visual: 'note:D5' },
  { kind: 'know', q: 'Qual nota esta digitação produz?', options: ['Sol', 'Lá', 'Si', 'Fá'], visual: 'fingering:G' },
  { kind: 'know', q: 'O que indicam os pontos?', options: ['Staccato', 'Legato', 'Acento', 'Fermata'], visual: 'staff:staccato' },
  { kind: 'know', q: 'Onde fica o orifício de embocadura?', options: ['Na cabeça, no porta-lábio', 'No pé', 'No meio do corpo', 'Sob a primeira chave'], visual: 'flute-parts' },
  { kind: 'know', q: 'Duplo golpe de língua usa…', options: ['“Tu-cu”', '“Tu-tu”', '“Ha-ha”', 'Só os lábios'] },
  { kind: 'know', q: 'Qual escala está escrita?', options: ['Dó maior', 'Lá menor', 'Sol maior', 'Ré maior'], visual: 'staff:c-major' },
  { kind: 'know', q: 'O que é afinar?', options: ['Ouvir e ajustar a altura das notas', 'Tocar mais forte', 'Apertar as chaves', 'Usar vibrato'] },
];

// Pontuação → etapa inicial (nunca além da última etapa gratuita).
export function placementStart(scoreSelf, scoreKnow) {
  const total = scoreSelf + scoreKnow; // 0..12 + 0..8 = 0..20
  if (scoreSelf <= 1 && scoreKnow <= 3) return 1; // começa do início
  if (total <= 7) return 2;
  if (total <= 10) return 4;
  if (total <= 13) return 6;
  return 8;
}
