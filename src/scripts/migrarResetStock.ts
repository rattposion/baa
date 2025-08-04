import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import Production from '../models/Production';
import Equipment from '../models/Equipment';

dotenv.config();

const migrarResetStock = async (): Promise<void> => {
  try {
    console.log('🔄 INICIANDO MIGRAÇÃO DO RESET STOCK...');
    
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mix_production');
    console.log('✅ Conectado ao MongoDB');

    // Buscar todos os equipamentos
    const equipments = await Equipment.find({});
    console.log(`📦 Equipamentos encontrados: ${equipments.length}`);

    // Buscar todos os registros de produção
    const productions = await Production.find({}).lean();
    console.log(`📊 Registros de produção encontrados: ${productions.length}`);

    // Separar registros de reset e produção normal
    const resetRecords = productions.filter((p: any) => p.isReset);
    const normalRecords = productions.filter((p: any) => !p.isReset);

    console.log(`\n📈 ANÁLISE DOS REGISTROS:`);
    console.log(`   - Registros de Reset: ${resetRecords.length}`);
    console.log(`   - Registros de Produção Normal: ${normalRecords.length}`);

    // Calcular resetStock baseado nos registros de reset
    const equipmentResetStock: { [key: string]: number } = {};
    
    resetRecords.forEach((production: any) => {
      const equipmentId = production.equipmentId;
      
      if (!equipmentResetStock[equipmentId]) {
        equipmentResetStock[equipmentId] = 0;
      }

      equipmentResetStock[equipmentId] += production.quantity;
    });

    console.log(`\n🔍 RESET STOCK CALCULADO:`);
    for (const [equipmentId, resetStock] of Object.entries(equipmentResetStock)) {
      console.log(`   Equipamento ${equipmentId}: ${resetStock} resets`);
    }

    // Atualizar cada equipamento com o resetStock
    let atualizados = 0;
    let semAlteracao = 0;

    for (const equipment of equipments) {
      const calculatedResetStock = equipmentResetStock[(equipment._id as any).toString()] || 0;
      const oldResetStock = equipment.resetStock || 0;
      
      // Atualizar o resetStock
      equipment.resetStock = calculatedResetStock;
      
      await equipment.save();
      
      console.log(`\n📦 ${equipment.modelName}:`);
      console.log(`   - ResetStock: ${oldResetStock} → ${calculatedResetStock}`);
      console.log(`   - CurrentStock: ${equipment.currentStock}`);
      console.log(`   - TotalResets: ${equipment.totalResets}`);
      
      if (oldResetStock !== calculatedResetStock) {
        console.log(`   ✅ ATUALIZADO: ResetStock migrado com sucesso`);
        atualizados++;
      } else {
        console.log(`   ✅ Já estava correto`);
        semAlteracao++;
      }
    }

    console.log(`\n🎯 RESUMO DA MIGRAÇÃO:`);
    console.log(`   - Equipamentos atualizados: ${atualizados}`);
    console.log(`   - Equipamentos sem alteração: ${semAlteracao}`);
    console.log(`   - Total processado: ${atualizados + semAlteracao}`);

    // Mostrar registros de reset encontrados
    if (resetRecords.length > 0) {
      console.log(`\n🔄 REGISTROS DE RESET ENCONTRADOS:`);
      resetRecords.forEach((record: any, index: number) => {
        console.log(`   ${index + 1}. ${record.employeeName} - ${record.equipmentModel}`);
        console.log(`      - Data: ${record.date}`);
        console.log(`      - Quantidade: ${record.quantity}`);
        console.log(`      - ID: ${record._id}`);
      });
      console.log(`\n⚠️  ATENÇÃO: ${resetRecords.length} registros de reset foram encontrados`);
      console.log(`   Estes registros agora afetam apenas o resetStock e totalResets`);
    }

    console.log(`\n✅ MIGRAÇÃO FINALIZADA!`);
    console.log(`   - Campo resetStock adicionado ao modelo Equipment`);
    console.log(`   - Registros de reset agora afetam resetStock e totalResets`);
    console.log(`   - Registros de produção normal só afetam currentStock`);
    console.log(`   - Separação completa entre estoque normal e reset`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro durante a migração:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
};

migrarResetStock(); 