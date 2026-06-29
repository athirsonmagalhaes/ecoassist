import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from './schemas';

// 1. Abre (ou cria) o arquivo do banco de dados no dispositivo
const expoDb = openDatabaseSync('ecoassist.db');

// 2. Inicializa o Drizzle passando o motor do SQLite e o seu Schema
export const db = drizzle(expoDb, { schema });