import { db } from '../db'; 
import { plantas } from '../schemas';
import { count } from 'drizzle-orm';
import { base_plantas } from './basePlantas';

export async function seedDatabase() {
  try {
    // 1. Count para ser mais performático que selecionar todos os dados
    const [contagem] = await db.select({ valor: count() }).from(plantas);


    if (contagem.valor === 0) {
      console.log("🌱 Populando base agrícola inicial (Offline First)...");

      // 2. Otimização: Inserção em lote (Batch Insert) é muito mais rápida que um loop de await
      const inserirDados = base_plantas.map(planta => ({
        ...planta,
        consorcio: JSON.stringify(planta.consorcio)
      }));
      await db.insert(plantas).values(inserirDados);
      
      console.log(`✅ Base agrícola pronta com ${base_plantas.length} plantas.`);

    } else {
      console.log(`ℹ️ Banco de dados já possui ${contagem.valor} plantas.`);
    }
  } catch (error) {
    console.error("❌ Erro ao realizar o seed do banco:", error);
  }
}