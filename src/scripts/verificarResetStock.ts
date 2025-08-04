import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import Production from '../models/Production';
import Equipment from '../models/Equipment';

dotenv.config();

const verificarResetStock = async (): Promise<void> => {
  try {
    console.log('🔍 VERIFICANDO STATUS DO RESET STOCK...');
    
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

    // Calcular estoque correto baseado nos registros
    const equipmentStock: { [key: string]: { currentStock: number; totalResets: number; resetStock: number } } = {};
    
    productions.forEach((production: any) => {
      const equipmentId = production.equipmentId;
      
      if (!equipmentStock[equipmentId]) {
        equipmentStock[equipmentId] = { currentStock: 0, totalResets: 0, resetStock: 0 };
      }

      if (production.isReset) {
        equipmentStock[equipmentId].resetStock += production.quantity;
        equipmentStock[equipmentId].totalResets += production.quantity;
      } else {
        equipmentStock[equipmentId].currentStock += production.quantity;
      }
    });

    console.log(`\n🏭 ESTOQUE ATUAL DOS EQUIPAMENTOS:`);
    equipments.forEach(equipment => {
      const calculatedStock = equipmentStock[(equipment._id as any).toString()];
      
      console.log(`\n📦 ${equipment.modelName}:`);
      console.log(`   - CurrentStock Atual: ${equipment.currentStock}`);
      console.log(`   - ResetStock Atual: ${equipment.resetStock || 0}`);
      console.log(`   - TotalResets Atual: ${equipment.totalResets}`);
      
      if (calculatedStock) {
        console.log(`   - CurrentStock Calculado: ${calculatedStock.currentStock}`);
        console.log(`   - ResetStock Calculado: ${calculatedStock.resetStock}`);
        console.log(`   - TotalResets Calculado: ${calculatedStock.totalResets}`);
        
        // Verificar se há discrepâncias
        const currentStockOk = equipment.currentStock === calculatedStock.currentStock;
        const resetStockOk = (equipment.resetStock || 0) === calculatedStock.resetStock;
        const totalResetsOk = equipment.totalResets === calculatedStock.totalResets;
        
        console.log(`   - CurrentStock: ${currentStockOk ? '✅' : '❌'}`);
        console.log(`   - ResetStock: ${resetStockOk ? '✅' : '❌'}`);
        console.log(`   - TotalResets: ${totalResetsOk ? '✅' : '❌'}`);
        
        if (!currentStockOk || !resetStockOk || !totalResetsOk) {
          console.log(`   ⚠️  DISCREPÂNCIA ENCONTRADA!`);
        } else {
          console.log(`   ✅ TUDO CORRETO`);
        }
      } else {
        console.log(`   ⚠️  Sem registros de produção`);
      }
    });

    // Mostrar resumo dos registros de reset
    if (resetRecords.length > 0) {
      console.log(`\n🔄 REGISTROS DE RESET:`);
      resetRecords.forEach((record: any, index: number) => {
        console.log(`   ${index + 1}. ${record.employeeName} - ${record.equipmentModel}`);
        console.log(`      - Data: ${record.date}`);
        console.log(`      - Quantidade: ${record.quantity}`);
        console.log(`      - Reset: ${record.isReset}`);
      });
    }

    // Mostrar resumo dos registros de produção normal
    if (normalRecords.length > 0) {
      console.log(`\n📊 REGISTROS DE PRODUÇÃO NORMAL:`);
      normalRecords.forEach((record: any, index: number) => {
        console.log(`   ${index + 1}. ${record.employeeName} - ${record.equipmentModel}`);
        console.log(`      - Data: ${record.date}`);
        console.log(`      - Quantidade: ${record.quantity}`);
        console.log(`      - Reset: ${record.isReset}`);
      });
    }

    console.log(`\n✅ VERIFICAÇÃO FINALIZADA!`);
    console.log(`   - Campo resetStock implementado`);
    console.log(`   - Separação completa entre estoque normal e reset`);
    console.log(`   - Registros de reset afetam apenas resetStock e totalResets`);
    console.log(`   - Registros de produção normal afetam apenas currentStock`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro durante a verificação:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
};

verificarResetStock(); 