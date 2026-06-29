export interface iPlanta{
  id: number;
  nome: string;
  espacamento_cm: number;
  ciclo_dias: number;
  luz: 'Pleno' | 'Meia-sombra' | 'Sombra'; 
  rega: 'Baixa' | 'Moderada' | 'Frequente';
  estrato: 'Baixo' | 'Médio' | 'Alto' | 'Emergente';
  consorcio: string[]; //Array de plantas companheiras
  descricao_embrapa?: string; // Opcional
}

export interface iCanteiro {
  id: number | null;
  nome: string | null;
  largura: number | null;
  comprimento: number | null;
  tipo_solo: string | null ;
  horas_de_sol?: number | null; //Opcional para locais não analisados
  tem_cobertura: boolean | null;
}

export interface iPlantios {
  id: number;
  id_planta: number;
  id_canteiro: number;
  data_plantio: string; // ISO format recomendada para manipulação de datas
  quantidade: number;   // Importante para calcular a densidade no canteiro (princípio da floresta)
  status: 'ativo' | 'colhido' | 'falha';
  observacoes?: string; // "Consultor Digital" usa como contexto
  tipo_propagacao: 'semente' | 'muda';
}

/** Alias alinhado ao design do prompt (Planta / Canteiro / Plantios). */
export type Planta = iPlanta;
export type Canteiro = iCanteiro;
export type Plantios = iPlantios;