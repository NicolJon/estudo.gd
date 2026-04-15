import type { FormData, Relatorio, BlocoAnalise, PontoAnalise, AnswerLetter, BlocoId, QuestionDef, STEPDimension, IMELevel, STEPIMECell, STEPIMEMatrix } from './types';
import { QUESTIONS_DEMANDA, QUESTIONS_POSICIONAMENTO, QUESTIONS_ATENDIMENTO, QUESTIONS_CONVERSAO } from './types';

function extrairNumeroDoTexto(texto: string): number {
  const cleaned = texto.replace(/[R$.\s%]/g, '').replace(',', '.');
  const match = cleaned.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

const LETTER_SCORE: Record<string, number> = { A: 0, B: 25, C: 50, D: 75, E: 100 };

function letterToScore(letter: AnswerLetter): number {
  return LETTER_SCORE[letter] ?? 0;
}

export function calcularFinanceiro(r: FormData) {
  const ticketMedio = extrairNumeroDoTexto(r.ticketMedio) || 5000;
  const faturamentoMensalNum = extrairNumeroDoTexto(r.faturamentoMensal) || 50000;
  const conversaoRaw = extrairNumeroDoTexto(r.conversaoProcedimentos);
  const conversaoAtual = conversaoRaw > 0 ? conversaoRaw / 100 : 0.08;

  const procedimentosAtuais = Math.round(faturamentoMensalNum / ticketMedio);
  const leadsMesEstimado = Math.round(procedimentosAtuais / conversaoAtual);

  // -- MINIMO IDEAL (40% de conversao de leads) --
  const metaMinimoProcedimentos = Math.round(leadsMesEstimado * 0.40);
  const metaMinimoFaturamento = metaMinimoProcedimentos * ticketMedio;
  const receitaInvisivelMinimoIdeal = Math.max(metaMinimoFaturamento - faturamentoMensalNum, 0);
  const procedimentosPerdidosMinimo = Math.max(metaMinimoProcedimentos - procedimentosAtuais, 0);

  // -- POTENCIAL MÁXIMO ESCALÁVEL (80% de conversao de leads) --
  const metaMaximoProcedimentos = Math.round(leadsMesEstimado * 0.80);
  const metaMaximoFaturamento = metaMaximoProcedimentos * ticketMedio;
  const receitaInvisivelPotencialMaximo = Math.max(metaMaximoFaturamento - faturamentoMensalNum, 0);
  const procedimentosPerdidosPotencial = Math.max(metaMaximoProcedimentos - procedimentosAtuais, 0);

  // -- PROJEÇÃO MÊS A MÊS --
  const projecaoMesAMes: number[] = new Array(12).fill(0);
  
  const metaM3 = receitaInvisivelMinimoIdeal;
  const metaM6 = receitaInvisivelPotencialMaximo;
  const metaM12 = receitaInvisivelPotencialMaximo * 1.5;

  // Calculando Mês 1, Mês 2 e Mês 3 (Index 0, 1, 2)
  let acertoM1 = metaM3 / 3;
  if (acertoM1 > 0 && acertoM1 < ticketMedio) {
    // Regra: Se estipulado um salto fracionado de menos de 1 ticket, forcar pelo menos a conquista de 1 procedure extra
    acertoM1 = ticketMedio; 
  }
  
  projecaoMesAMes[0] = acertoM1;
  projecaoMesAMes[1] = Math.max(acertoM1 * 1.05, (metaM3 / 3) * 2);
  projecaoMesAMes[2] = Math.max(metaM3, projecaoMesAMes[1] * 1.05);
  
  // Para meses 4 a 6 (Interpolação de M3 até M6)
  const diffM3_M6 = metaM6 - projecaoMesAMes[2];
  projecaoMesAMes[3] = projecaoMesAMes[2] + diffM3_M6 * 0.33;
  projecaoMesAMes[4] = projecaoMesAMes[2] + diffM3_M6 * 0.66;
  projecaoMesAMes[5] = metaM6;

  // Para meses 7 a 12 (Interpolação de M6 até M12)
  const diffM6_M12 = metaM12 - metaM6;
  for (let i = 6; i < 12; i++) {
     projecaoMesAMes[i] = metaM6 + diffM6_M12 * ((i - 5) / 6);
  }

  // Remove casas decimais do faturamento
  for (let i = 0; i < 12; i++) {
     projecaoMesAMes[i] = Math.round(projecaoMesAMes[i]);
  }

  // -- Aliases compatíveis --
  const faturamentoPerdidoMes = receitaInvisivelMinimoIdeal;
  const faturamentoPerdidoAno = receitaInvisivelMinimoIdeal * 12;
  const procedimentosPerdidos = procedimentosPerdidosMinimo;

  return {
    faturamentoMensal: r.faturamentoMensal,
    ticketMedio,
    faturamentoMensalNum,
    conversaoAtual,
    leadsMesEstimado,
    procedimentosAtuais,
    
    receitaInvisivelMinimoIdeal,
    receitaInvisivelPotencialMaximo,
    procedimentosPerdidosMinimo,
    procedimentosPerdidosPotencial,
    projecaoMesAMes,

    faturamentoPerdidoMes,
    faturamentoPerdidoAno,
    procedimentosPerdidos,
  };
}

// ── STEP × IME Matrix ──
// Map: Blocos → STEP columns
//   Demanda → S (Status do Processo)
//   Posicionamento → T (Membros da Equipe / percepção)
//   Atendimento → E (Ambiente / experiência)
//   Conversão → P (Progresso à Meta)
// Within each bloco, questions map to IME rows by progression:
//   1st question → I (Implementação)
//   2nd question → M (Maturação)
//   3rd+4th avg  → E (Escala)  [or 3rd only if 3 questions]

const BLOCO_TO_STEP: Record<BlocoId, STEPDimension> = {
  demanda: 'S',
  posicionamento: 'T',
  atendimento: 'E',
  conversao: 'P',
};

function classifyScore(score: number): string {
  if (score >= 66) return 'Consolidado';
  if (score >= 36) return 'Avançando';
  return 'Iniciando';
}

function calcularMatrix(formData: FormData): STEPIMEMatrix {
  const cells: STEPIMECell[] = [];
  const blocoQuestions: Record<BlocoId, QuestionDef[]> = {
    demanda: QUESTIONS_DEMANDA,
    posicionamento: QUESTIONS_POSICIONAMENTO,
    atendimento: QUESTIONS_ATENDIMENTO,
    conversao: QUESTIONS_CONVERSAO,
  };

  const blocoIds: BlocoId[] = ['demanda', 'posicionamento', 'atendimento', 'conversao'];

  for (const blocoId of blocoIds) {
    const questions = blocoQuestions[blocoId];
    const step = BLOCO_TO_STEP[blocoId];
    const scores: number[] = [];

    for (const q of questions) {
      if (q.isPercent) {
        // Map q14 percent to a score (0-100 scale, cap at 35% = 100)
        const pct = extrairNumeroDoTexto(formData[q.id] as string);
        scores.push(Math.min(Math.round((pct / 35) * 100), 100));
      } else {
        const answer = formData[q.id] as AnswerLetter;
        scores.push(answer ? letterToScore(answer) : 0);
      }
    }

    // A eficiência do setor é a média total das perguntas daquele bloco
    const rawSum = scores.reduce((a, b) => a + b, 0);
    const avg = scores.length > 0 ? Math.round(rawSum / scores.length) : 0;

    let targetIme: IMELevel = 'I';
    let label = 'Implementação';

    if (avg > 75) {
      targetIme = 'E';
      label = 'Escala';
    } else if (avg > 45) {
      targetIme = 'M';
      label = 'Maturação';
    } else {
      targetIme = 'I';
      label = 'Implementação';
    }

    cells.push({
      step,
      ime: targetIme,
      score: avg,
      label,
    });
  }

  // Averages per STEP
  const steps: STEPDimension[] = ['S', 'T', 'E', 'P'];
  const imes: IMELevel[] = ['I', 'M', 'E'];
  const stepAverages = {} as Record<STEPDimension, number>;
  for (const s of steps) {
    const sc = cells.filter(c => c.step === s);
    stepAverages[s] = sc.length > 0 ? Math.round(sc.reduce((a, c) => a + c.score, 0) / sc.length) : 0;
  }

  const imeAverages = {} as Record<IMELevel, number>;
  for (const i of imes) {
    const sc = cells.filter(c => c.ime === i);
    imeAverages[i] = sc.length > 0 ? Math.round(sc.reduce((a, c) => a + c.score, 0) / sc.length) : 0;
  }

  const overallScore = cells.length > 0
    ? Math.round(cells.reduce((a, c) => a + c.score, 0) / cells.length)
    : 0;

  return { cells, stepAverages, imeAverages, overallScore };
}

// ── Bloco Analysis ──

function analisarBloco(formData: FormData, questions: QuestionDef[]): BlocoAnalise {
  const positivos: PontoAnalise[] = [];
  const negativos: PontoAnalise[] = [];
  let totalScore = 0;
  let count = 0;

  for (const q of questions) {
    if (q.isPercent) continue;
    const answer = formData[q.id] as AnswerLetter;
    if (!answer) continue;

    const score = letterToScore(answer);
    totalScore += score;
    count++;

    if (answer === 'A' || answer === 'B') {
      negativos.push({
        titulo: q.text,
        descricao: `Nível atual: ${q.options[['A','B','C','D','E'].indexOf(answer)]}. Ponto crítico que impacta diretamente os resultados.`,
        impacto: 'Compromete a operação nesta dimensão.',
        urgencia: answer === 'A' ? 'alta' : 'media',
      });
    } else if (answer === 'D' || answer === 'E') {
      positivos.push({
        titulo: q.text,
        descricao: `Nível atual: ${q.options[['A','B','C','D','E'].indexOf(answer)]}. Ponto forte consolidado.`,
      });
    }
  }

  const avgScore = count > 0 ? Math.round(totalScore / count) : 50;
  const status = avgScore >= 70 ? 'ok' as const : avgScore >= 45 ? 'warning' as const : 'critical' as const;

  return { score: avgScore, status, positivos, negativos };
}

function determinarNivel(conversaoAtual: number): 1 | 2 | 3 {
  if (conversaoAtual <= 0.45) return 1;
  if (conversaoAtual <= 0.70) return 2;
  return 3;
}

export function gerarRelatorio(formData: FormData): Relatorio {
  const financeiro = calcularFinanceiro(formData);
  const matrix = calcularMatrix(formData);

  const blocos: Record<BlocoId, BlocoAnalise> = {
    demanda: analisarBloco(formData, QUESTIONS_DEMANDA),
    posicionamento: analisarBloco(formData, QUESTIONS_POSICIONAMENTO),
    atendimento: analisarBloco(formData, QUESTIONS_ATENDIMENTO),
    conversao: analisarBloco(formData, QUESTIONS_CONVERSAO),
  };

  const blocoScores: Record<BlocoId, number> = {
    demanda: blocos.demanda.score,
    posicionamento: blocos.posicionamento.score,
    atendimento: blocos.atendimento.score,
    conversao: blocos.conversao.score,
  };

  const nivelRecomendado = determinarNivel(financeiro.conversaoAtual);

  return {
    nomeClinica: formData.nomeClinica,
    responsavel: formData.responsavel,
    financeiro,
    blocos,
    blocoScores,
    matrix,
    overallScore: matrix.overallScore,
    nivelRecomendado,
    formData,
  };
}

export function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 });
}
