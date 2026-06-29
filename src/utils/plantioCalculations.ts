import type { iPlanta } from "@/types/index";

/** Dias extras estimados para germinação quando a propagação é por semente. */
export const BUFFER_GERMINACAO_DIAS = 14;

export type TipoPropagacao = "semente" | "muda";

export interface DensidadeResultado {
  areaCm2: number;
  capacidadeMax: number;
  quantidade: number;
  superlotado: boolean;
  percentualUso: number;
  mensagem: string;
}

export interface PrevisaoColheita {
  diasTotais: number;
  dataColheita: Date;
  dataColheitaFormatada: string;
}

function parseIsoDate(iso: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso.trim())) return null;
  const [y, m, d] = iso.trim().split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatarDataBr(date: Date): string {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function hojeIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Capacidade por grade: cada planta ocupa espacamento_cm × espacamento_cm no canteiro.
 */
export function calcularDensidade(
  larguraCm: number,
  comprimentoCm: number,
  espacamentoCm: number,
  quantidade: number,
): DensidadeResultado {
  const areaCm2 = larguraCm * comprimentoCm;
  const areaPorPlanta = espacamentoCm * espacamentoCm;
  const capacidadeMax =
    areaPorPlanta > 0 ? Math.max(1, Math.floor(areaCm2 / areaPorPlanta)) : 0;
  const superlotado = quantidade > capacidadeMax;
  const percentualUso =
    capacidadeMax > 0 ? Math.min(100, Math.round((quantidade / capacidadeMax) * 100)) : 0;

  let mensagem: string;
  if (quantidade <= 0) {
    mensagem = "Informe a quantidade para validar a densidade.";
  } else if (superlotado) {
    mensagem = `Atenção: ${quantidade} plantas excedem a capacidade estimada (~${capacidadeMax}) para ${(areaCm2 / 10000).toFixed(2)} m² com espaçamento de ${espacamentoCm} cm.`;
  } else if (percentualUso >= 85) {
    mensagem = `Densidade alta (${percentualUso}% da capacidade). Monitore competição por luz e nutrientes.`;
  } else {
    mensagem = `Densidade adequada: ${quantidade} de ~${capacidadeMax} plantas possíveis (${percentualUso}% do espaço).`;
  }

  return {
    areaCm2,
    capacidadeMax,
    quantidade,
    superlotado,
    percentualUso,
    mensagem,
  };
}

export function calcularPrevisaoColheita(
  dataPlantioIso: string,
  cicloDias: number,
  tipoPropagacao: TipoPropagacao,
): PrevisaoColheita | null {
  const inicio = parseIsoDate(dataPlantioIso);
  if (!inicio || cicloDias <= 0) return null;

  const diasExtras = tipoPropagacao === "semente" ? BUFFER_GERMINACAO_DIAS : 0;
  const diasTotais = cicloDias + diasExtras;
  const dataColheita = new Date(inicio);
  dataColheita.setDate(dataColheita.getDate() + diasTotais);

  return {
    diasTotais,
    dataColheita,
    dataColheitaFormatada: formatarDataBr(dataColheita),
  };
}

export interface ConsorcioDestaque {
  texto: string;
  companheirasAtivas: string[];
}

export function montarConsorcio(
  planta: iPlanta,
  nomesPlantasAtivasNoCanteiro: string[],
): ConsorcioDestaque {
  const lista = planta.consorcio ?? [];
  const texto =
    lista.length > 0
      ? lista.join(", ")
      : "Sem sugestões de consórcio cadastradas para esta espécie.";

  const ativasSet = new Set(
    nomesPlantasAtivasNoCanteiro.map((n) => n.trim().toLowerCase()),
  );
  const companheirasAtivas = lista.filter((c) => ativasSet.has(c.trim().toLowerCase()));

  return { texto, companheirasAtivas };
}
