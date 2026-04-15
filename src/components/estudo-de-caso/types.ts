export type AnswerLetter = '' | 'A' | 'B' | 'C' | 'D' | 'E';

export interface FormData {
  // Etapa 0 — Dados Básicos
  nomeClinica: string;
  responsavel: string;
  telefone: string;
  instagram: string;
  googleMaps: string;
  ticketMedio: string;
  faturamentoMensal: string;
  conversaoProcedimentos: string;
  // Blocos de perguntas (15 perguntas)
  q1: AnswerLetter; q2: AnswerLetter; q3: AnswerLetter; q4: AnswerLetter;
  q5: AnswerLetter; q6: AnswerLetter; q7: AnswerLetter; q8: AnswerLetter;
  q9: AnswerLetter; q10: AnswerLetter; q11: AnswerLetter; q12: AnswerLetter;
  q13: AnswerLetter;
  q14: string; // conversão % (campo livre)
  q15: AnswerLetter;
}

export type Phase = 'WELCOME' | 'FORM' | 'PROCESSING' | 'REPORT';
export type Status = 'ok' | 'warning' | 'critical';
export type Urgencia = 'baixa' | 'media' | 'alta';
export type STEPDimension = 'S' | 'T' | 'E' | 'P';
export type IMELevel = 'I' | 'M' | 'E';

export type BlocoId = 'demanda' | 'posicionamento' | 'atendimento' | 'conversao';

export interface STEPIMECell {
  step: STEPDimension;
  ime: IMELevel;
  score: number;
  label: string; // Iniciando / Avançando / Consolidado
}

export interface STEPIMEMatrix {
  cells: STEPIMECell[];
  stepAverages: Record<STEPDimension, number>;
  imeAverages: Record<IMELevel, number>;
  overallScore: number;
}

export const STEP_LABELS: Record<STEPDimension, { short: string; full: string }> = {
  S: { short: 'S', full: 'Status do Paciente/Processo' },
  T: { short: 'T', full: 'Membros da Equipe' },
  E: { short: 'E', full: 'Ambiente' },
  P: { short: 'P', full: 'Progresso à Meta' },
};

export const IME_LABELS: Record<IMELevel, { short: string; full: string }> = {
  I: { short: 'I', full: 'Implementação' },
  M: { short: 'M', full: 'Maturação' },
  E: { short: 'E', full: 'Escala' },
};

export interface PontoAnalise {
  titulo: string;
  descricao: string;
  impacto?: string;
  urgencia?: Urgencia;
}

export interface BlocoAnalise {
  score: number;
  status: Status;
  positivos: PontoAnalise[];
  negativos: PontoAnalise[];
}

export interface Financeiro {
  faturamentoMensal: string;
  ticketMedio: number;
  faturamentoMensalNum: number;
  conversaoAtual: number;
  leadsMesEstimado: number;
  procedimentosAtuais: number;
  
  // Novas métricas escaláveis
  receitaInvisivelMinimoIdeal: number;
  receitaInvisivelPotencialMaximo: number;
  procedimentosPerdidosMinimo: number;
  procedimentosPerdidosPotencial: number;
  projecaoMesAMes: number[]; // Array contendo o *ganho extra* (recuperado) do Mês 1 ao 12
  
  // Aliases compatíveis com o frontend principal
  faturamentoPerdidoMes: number;
  faturamentoPerdidoAno: number;
  procedimentosPerdidos: number;
}

export interface QuestionDef {
  id: keyof FormData;
  num: number;
  text: string;
  options: [string, string, string, string, string];
  bloco: BlocoId;
  isPercent?: boolean; // q14 is a percent input
}

export interface Relatorio {
  nomeClinica: string;
  responsavel: string;
  financeiro: Financeiro;
  blocos: Record<BlocoId, BlocoAnalise>;
  blocoScores: Record<BlocoId, number>;
  matrix: STEPIMEMatrix;
  overallScore: number;
  nivelRecomendado: 1 | 2 | 3;
  formData: FormData;
}

// ── BLOCO 1 — DEMANDA E ENTRADA ──
export const QUESTIONS_DEMANDA: QuestionDef[] = [
  { id: 'q1', num: 1, bloco: 'demanda',
    text: 'Volume de leads por mês',
    options: ['Não gera', 'Baixo (até 50)', 'Médio (50–150)', 'Alto (150–300)', 'Muito alto (+300)'] },
  { id: 'q2', num: 2, bloco: 'demanda',
    text: 'Origem dos leads',
    options: ['Não sabe', 'Só indicação', 'Misturado sem controle', 'Canais definidos', 'Estratégico e mensurado'] },
  { id: 'q3', num: 3, bloco: 'demanda',
    text: 'Previsibilidade de leads',
    options: ['Não gera', 'Totalmente instável', 'Oscila bastante', 'Relativamente estável', 'Totalmente previsível'] },
  { id: 'q4', num: 4, bloco: 'demanda',
    text: 'Qualidade dos leads',
    options: ['Só curioso/preço', 'Maioria desqualificada', 'Misto', 'Bons', 'Altamente qualificados'] },
];

// ── BLOCO 2 — POSICIONAMENTO E PERCEPÇÃO ──
export const QUESTIONS_POSICIONAMENTO: QuestionDef[] = [
  { id: 'q5', num: 5, bloco: 'posicionamento',
    text: 'Nível de autoridade percebida',
    options: ['Nenhuma', 'Baixa', 'Média', 'Boa', 'Alta autoridade'] },
  { id: 'q6', num: 6, bloco: 'posicionamento',
    text: 'Presença no Google (avaliações e gestão)',
    options: ['Não tem ou abandonado', 'Poucas avaliações', 'Médio, sem estratégia', 'Bem estruturado', 'Muito forte e ativo'] },
  { id: 'q7', num: 7, bloco: 'posicionamento',
    text: 'Qualidade da imagem (fotos, estética, branding)',
    options: ['Ruim ou inexistente', 'Amadora', 'Mediana', 'Boa', 'Profissional e estratégica'] },
  { id: 'q8', num: 8, bloco: 'posicionamento',
    text: 'Clareza do diferencial',
    options: ['Nenhum', 'Genérico', 'Existe, mas fraco', 'Claro', 'Muito forte'] },
];

// ── BLOCO 3 — ATENDIMENTO ──
export const QUESTIONS_ATENDIMENTO: QuestionDef[] = [
  { id: 'q9', num: 9, bloco: 'atendimento',
    text: 'Tempo médio de resposta',
    options: ['+6 horas', '2–6 horas', 'Até 2 horas', 'Até 30 min', 'Imediato'] },
  { id: 'q10', num: 10, bloco: 'atendimento',
    text: 'Processo de atendimento',
    options: ['Cada um faz de um jeito', 'Desorganizado', 'Parcial', 'Estruturado', 'Otimizado'] },
  { id: 'q11', num: 11, bloco: 'atendimento',
    text: 'Foco do atendimento',
    options: ['Só preço', 'Quase só preço', 'Misto', 'Valor', 'Consultivo/persuasivo'] },
  { id: 'q12', num: 12, bloco: 'atendimento',
    text: 'Tratamento de objeções',
    options: ['Não sabem lidar', 'Evitam', 'Médio', 'Bom', 'Estratégico'] },
];

// ── BLOCO 4 — CONVERSÃO ──
export const QUESTIONS_CONVERSAO: QuestionDef[] = [
  { id: 'q13', num: 13, bloco: 'conversao',
    text: 'Follow-up de leads',
    options: ['Não existe', 'Raramente', 'Às vezes', 'Frequente', 'Estruturado'] },
  { id: 'q14', num: 14, bloco: 'conversao', isPercent: true,
    text: 'Conversão de contato para agendamento',
    options: ['', '', '', '', ''] }, // not used, it's a percent input
  { id: 'q15', num: 15, bloco: 'conversao',
    text: 'Comparecimento em consulta',
    options: ['Muito baixo (<50%)', 'Baixo (50–60%)', 'Médio (60–70%)', 'Bom (70–85%)', 'Alto (>85%)'] },
];

export const ALL_QUESTIONS = [...QUESTIONS_DEMANDA, ...QUESTIONS_POSICIONAMENTO, ...QUESTIONS_ATENDIMENTO, ...QUESTIONS_CONVERSAO];

export const BLOCO_LABELS: Record<BlocoId, { badge: string; title: string }> = {
  demanda: { badge: 'BLOCO 1 — DEMANDA E ENTRADA', title: 'Volume, origem e qualidade dos leads' },
  posicionamento: { badge: 'BLOCO 2 — POSICIONAMENTO E PERCEPÇÃO', title: 'Como o mercado percebe a clínica' },
  atendimento: { badge: 'BLOCO 3 — ATENDIMENTO', title: 'Velocidade, processo e abordagem comercial' },
  conversao: { badge: 'BLOCO 4 — CONVERSÃO', title: 'Follow-up, conversão e comparecimento' },
};

export const FORM_STEPS = [
  { id: 0, badge: 'IDENTIFICAÇÃO', title: 'Dados básicos da operação' },
  { id: 1, badge: BLOCO_LABELS.demanda.badge, title: BLOCO_LABELS.demanda.title },
  { id: 2, badge: BLOCO_LABELS.posicionamento.badge, title: BLOCO_LABELS.posicionamento.title },
  { id: 3, badge: BLOCO_LABELS.atendimento.badge, title: BLOCO_LABELS.atendimento.title },
  { id: 4, badge: BLOCO_LABELS.conversao.badge, title: BLOCO_LABELS.conversao.title },
] as const;

export const STEP_FIELDS: Record<number, (keyof FormData)[]> = {
  0: ['nomeClinica', 'responsavel', 'telefone', 'instagram', 'googleMaps', 'ticketMedio', 'faturamentoMensal', 'conversaoProcedimentos'],
  1: ['q1', 'q2', 'q3', 'q4'],
  2: ['q5', 'q6', 'q7', 'q8'],
  3: ['q9', 'q10', 'q11', 'q12'],
  4: ['q13', 'q14', 'q15'],
};

export function getEmptyFormData(): FormData {
  return {
    nomeClinica: '', responsavel: '', telefone: '',
    instagram: '', googleMaps: '',
    ticketMedio: '', faturamentoMensal: '', conversaoProcedimentos: '',
    q1: '', q2: '', q3: '', q4: '',
    q5: '', q6: '', q7: '', q8: '',
    q9: '', q10: '', q11: '', q12: '',
    q13: '', q14: '', q15: '',
  };
}
