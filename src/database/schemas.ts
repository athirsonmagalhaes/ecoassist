import { integer, text, real, sqliteTable } from "drizzle-orm/sqlite-core";

export const plantas = sqliteTable("plantas", {
  id: integer("id").primaryKey(),
  nome: text("nome").notNull(),
  espacamento_cm: integer("espacamento_cm"),
  ciclo_dias: integer("ciclo_dias"),
  luz: text("luz"),
  rega: text("rega"),
  estrato: text("estrato"),
  consorcio: text("consorcio"),
  descricao_embrapa: text("descricao_embrapa"),
});

export const canteiros = sqliteTable("canteiros", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nome: text("nome"),
  largura: integer("largura"),
  comprimento: integer("comprimento"),
  tipo_solo: text("tipo_solo"),
  horas_de_sol: integer("horas_de_sol"),
  tem_cobertura: integer("tem_cobertura",{mode:"boolean"}),
});

export const plantios = sqliteTable("plantios", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  id_planta: integer("id_planta"),
  id_canteiro: integer("id_canteiro"),
  data: text("data"),
  quantidade: integer("quantidade"),
  status: text("status"),
  observacoes: text("observacoes"),
  tipo_propagacao: text("tipo_propagacao"),
});

export const usuarios = sqliteTable('usuarios', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nivel_experiencia: text('nivel_experiencia').notNull(),
  objetivo: text('objetivo').notNull(),
  localizacao: text('localizacao').notNull(),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
});