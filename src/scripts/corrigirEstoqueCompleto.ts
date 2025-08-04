import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import Production from '../models/Production';
import Equipment from '../models/Equipment';

dotenv.config();

const corrigirEstoqueCompleto = async (): Promise<void> => {
  try {
    console.log('🔧 INICIANDO CORREÇÃO COMPLETA DO ESTOQUE...');
    
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mix_production');
    console.log('✅ Conectado ao MongoDB');

    // Buscar todos os registros de produção
    const productions = await Production.find({}).lean();
    console.log(`📊 Total de registros de produção: ${productions.length}`);

    // Separar registros de reset e produção normal
    const resetRecords = productions.filter((p: any) => p.isReset);
    const normalRecords = productions.filter((p: any) => !p.isReset);

    console.log(`\n📈 ANÁLISE DOS REGISTROS:`);
    console.log(`   - Registros de Reset: ${resetRecords.length}`);
    console.log(`   - Registros de Produção Normal: ${normalRecords.length}`);

    // Calcular estoque correto baseado nos registros
    const equipmentStock: { [key: string]: { currentStock: number; totalResets: number } } = {};
    
    productions.forEach((production: any) => {
      const equipmentId = production.equipmentId;
      
      if (!equipmentStock[equipmentId]) {
        equipmentStock[equipmentId] = { currentStock: 0, totalResets: 0 };
      }

      if (production.isReset) {
        equipmentStock[equipmentId].totalResets += production.quantity;
      } else {
        equipmentStock[equipmentId].currentStock += production.quantity;
      }
    });

    console.log(`\n🔍 ESTOQUE CALCULADO BASEADO NOS REGISTROS:`);
    for (const [equipmentId, stock] of Object.entries(equipmentStock)) {
      console.log(`   Equipamento ${equipmentId}:`);
      console.log(`     - CurrentStock: ${stock.currentStock}`);
      console.log(`     - TotalResets: ${stock.totalResets}`);
    }

    // Buscar todos os equipamentos
    const equipments = await Equipment.find({});
    console.log(`\n🏭 EQUIPAMENTOS ENCONTRADOS: ${equipments.length}`);

    // Atualizar o estoque de cada equipamento
    let corrigidos = 0;
    let semAlteracao = 0;

    for (const equipment of equipments) {
      const calculatedStock = equipmentStock[(equipment._id as any).toString()];
      
      if (calculatedStock) {
        const oldCurrentStock = equipment.currentStock;
        const oldTotalResets = equipment.totalResets;
        
        // Atualizar com os valores calculados
        equipment.currentStock = calculatedStock.currentStock;
        equipment.totalResets = calculatedStock.totalResets;
        
        await equipment.save();
        
        console.log(`\n📦 ${equipment.modelName}:`);
        console.log(`   - CurrentStock: ${oldCurrentStock} → ${calculatedStock.currentStock}`);
        console.log(`   - TotalResets: ${oldTotalResets} → ${calculatedStock.totalResets}`);
        
        // Verificar se houve correção
        if (oldCurrentStock !== calculatedStock.currentStock || oldTotalResets !== calculatedStock.totalResets) {
          console.log(`   ✅ CORRIGIDO: Registros de reset não afetam mais o estoque`);
          corrigidos++;
        } else {
          console.log(`   ✅ Já estava correto`);
          semAlteracao++;
        }
      } else {
        console.log(`\n⚠️  ${equipment.modelName}: Sem registros de produção`);
        semAlteracao++;
      }
    }

    console.log(`\n🎯 RESUMO DA CORREÇÃO:`);
    console.log(`   - Equipamentos corrigidos: ${corrigidos}`);
    console.log(`   - Equipamentos sem alteração: ${semAlteracao}`);
    console.log(`   - Total processado: ${corrigidos + semAlteracao}`);

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
      console.log(`   Estes registros NÃO devem afetar o currentStock, apenas o totalResets`);
    }

    console.log(`\n✅ CORREÇÃO COMPLETA FINALIZADA!`);
    console.log(`   - Registros de reset agora só afetam totalResets`);
    console.log(`   - Registros de produção normal só afetam currentStock`);
    console.log(`   - Estoque recalculado com base nos registros existentes`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro durante a correção:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
};

corrigirEstoqueCompleto(); 
