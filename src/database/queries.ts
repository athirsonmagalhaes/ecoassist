import { count, eq } from "drizzle-orm";
import { db } from "./db";
import { usuarios, canteiros, plantios, plantas } from "./schemas";
import type { iPlantios } from "@/types/index";
import { useWeather } from "@/hooks/useWeather";

export type PlantioComPlanta = {
  id: number;
  id_planta: number | null;
  id_canteiro: number | null;
  data_plantio: string | null;
  quantidade: number | null;
  status: iPlantios["status"] | null;
  observacoes: string | null;
  tipo_propagacao: iPlantios["tipo_propagacao"] | null;
  nome_planta: string | null;
  espacamento_cm: number | null;
  ciclo_dias: number | null;
};

//Salvar perfil usuario
export async function salvarPerfilUsuario(
  experiencia: string,
  objetivo: string,
  localizacao: string,
  latitude: number,
  longitude: number,
) {
  try {
    await db.insert(usuarios).values({
      nivel_experiencia: experiencia,
      objetivo: objetivo,
      localizacao: localizacao,
      latitude: latitude,
      longitude: longitude,
    });
    console.log("✅ Perfil do usuário salvo localmente no SQLite.");
  } catch (error) {
    console.error("❌ Erro ao salvar o perfil do usuário no SQLite:", error);
    throw error;
  }
}

//Coletar localização do usuario salvo no banco local
export async function coletarLocalDb() {
  try {
    const resultado = await db
      .select({
        localizacao: usuarios.localizacao,
        latitude: usuarios.latitude,
        longitude: usuarios.longitude,
      })
      .from(usuarios)
      .limit(1);

    console.log("✅LOCAL DO SQLITE-> ", resultado[0].localizacao);
    console.log("✅LATITUDE DO SQLITE-> ", resultado[0].latitude);
    console.log("✅LONGITUDE DO SQLITE-> ", resultado[0].longitude);

    return resultado.length > 0 ? resultado[0] : null;
  } catch (error) {
    console.error("❌ Erro ao buscar localização no banco local:", error);
    return null;
  }
}

//Salvar canteiro
export async function salvarCanteiro(
  nome: string,
  largura: number,
  comprimento: number,
  tipo_solo: string,
  horas_de_sol: number,
  tem_cobertura: boolean,
) {
  try {
    await db.insert(canteiros).values({
      nome: nome,
      largura: largura,
      comprimento: comprimento,
      tipo_solo: tipo_solo,
      horas_de_sol: horas_de_sol,
      tem_cobertura: tem_cobertura,
    });

    console.log("✅ Canteiro salvo localmente no SQLite.");
  } catch (error) {
    console.error("❌ Erro ao salvar o canteiro no SQLite:", error);
    throw error;
  }
}

//Listar todos canteiros do usuario do banco local
export async function listarCanteiros() {
  try {
    const resultado = await db.select().from(canteiros);
    console.log("✅Canteiros da querie-> ", resultado);
    return resultado;
  } catch (error) {
    console.error("❌ Erro ao buscar canteiros no banco local:", error);
    throw error;
  }
}

//Excluir canteiro do banco local
export async function deletarCanteiro(id: number) {
  try {
    await db.delete(canteiros).where(eq(canteiros.id, id));
    console.log("✅Canteiro deletado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao deletar canteiro do banco local:", error);
    throw error;
  }
}

export async function buscarCanteiroPorId(id: number) {
  try {
    const resultado = await db
      .select()
      .from(canteiros)
      .where(eq(canteiros.id, id));
    console.log("✅Canteiro selecionado com sucesso!");
    return resultado;
  } catch (error) {
    console.error("❌ Erro ao buscar canteiro no banco local:", error);
    throw error;
  }
}

export async function salvarPlantio(
  id_planta: number,
  id_canteiro: number,
  data: string,
  quantidade: number,
  observacoes: string | null,
  status: "ativo" | "colhido" | "falha" = "ativo",
  tipo_propagacao: iPlantios["tipo_propagacao"] = "muda",
) {
  try {
    await db.insert(plantios).values({
      id_planta,
      id_canteiro,
      data,
      quantidade,
      status,
      observacoes,
      tipo_propagacao,
    });
    console.log("✅ Plantio salvo localmente no SQLite.");
  } catch (error) {
    console.error("❌ Erro ao salvar plantio no SQLite:", error);
    throw error;
  }
}

export async function listarPlantiosPorCanteiro(
  id_canteiro: number,
): Promise<PlantioComPlanta[]> {
  try {
    const resultado = await db
      .select({
        id: plantios.id,
        id_planta: plantios.id_planta,
        id_canteiro: plantios.id_canteiro,
        data_plantio: plantios.data,
        quantidade: plantios.quantidade,
        status: plantios.status,
        observacoes: plantios.observacoes,
        tipo_propagacao: plantios.tipo_propagacao,
        nome_planta: plantas.nome,
        espacamento_cm: plantas.espacamento_cm,
        ciclo_dias: plantas.ciclo_dias,
      })
      .from(plantios)
      .leftJoin(plantas, eq(plantios.id_planta, plantas.id))
      .where(eq(plantios.id_canteiro, id_canteiro));

    return resultado.map((row) => ({
      ...row,
      status: (row.status ?? "ativo") as iPlantios["status"],
      tipo_propagacao: (row.tipo_propagacao ??
        "muda") as iPlantios["tipo_propagacao"],
    }));
  } catch (error) {
    console.error("❌ Erro ao listar plantios do canteiro:", error);
    throw error;
  }
}

export async function perfilExiste(): Promise<boolean> {
  try {
    //Executa uma contagem performática na tabela
    const [resultado] = await db.select({ valor: count() }).from(usuarios);

    //Retorna True se for maior que 0
    return resultado.valor > 0;
  } catch (error) {
    console.error("❌ Erro técnico ao verificar existência de perfil:", error);
    throw error;
  }
}

export async function deletarPlantio(idPlantio: number) {
  try {
    await db.delete(plantios).where(eq(plantios.id, idPlantio));
    console.log("✅Plantio deletado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao deletar plantio do banco local:", error);
    throw error;
  }
}
export async function listarObservacoesPlantio(
  idPlantio: number,
): Promise<string | null> {
  try {
    const [row] = await db
      .select({ observacoes: plantios.observacoes })
      .from(plantios)
      .where(eq(plantios.id, idPlantio));
    return row?.observacoes ?? null;
  } catch (error) {
    console.error("❌ Erro ao buscar observações no banco local: ", error);
    throw error;
  }
}

export async function salvarObservacoes(
  idPlantio: number,
  observacoes: string,
) {
  try {
    const observacoesPrev = await listarObservacoesPlantio(idPlantio);
    const dataAtual = new Date().toLocaleDateString("pt-BR");
    const novaObservacaoFormatada = `Atualização de ${dataAtual}: ${observacoes}`;
    const observacoesFormatadas = observacoesPrev
      ? `${observacoesPrev}\n${novaObservacaoFormatada}`
      : novaObservacaoFormatada;

    await db
      .update(plantios)
      .set({ observacoes: observacoesFormatadas })
      .where(eq(plantios.id, idPlantio));

    console.log("✅Observações atualizadas com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao salvar observações no banco local: ", error);
    throw error;
  }
}

export async function buscarResumoLocal() {
  /*QUEBRAR A LOGICA EM PEQUENAS ETAPAS

  1.SABER LOCAL DO USER
  2.SABER QUAIS CANTEIROS TEM
  3.SABER QUAIS PLANTIOS ESTAO ATIVOS NOME DAS PLANTAS
  4.SABER O CLIMA E TEMPERATURA

  */
}
