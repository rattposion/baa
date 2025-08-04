import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import Production from '../models/Production';
import Equipment from '../models/Equipment';

dotenv.config();

interface ProductionRecord {
  _id: any;
  employeeId: string;
  equipmentId: string;
  quantity: number;
  isReset: boolean;
  equipmentModel: string;
}

const fixResetStock = async (): Promise<void> => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mix_production');
    console.log('Conectado ao MongoDB');

    // Buscar todos os registros de produção
    const productions = await Production.find({}).lean() as unknown as ProductionRecord[];
    console.log(`Encontrados ${productions.length} registros de produção`);

    // Separar registros de reset e produção normal
    const resetRecords = productions.filter(p => p.isReset);
    const normalRecords = productions.filter(p => !p.isReset);

    console.log(`\n=== ANÁLISE DOS REGISTROS ===`);
    console.log(`Registros de Reset: ${resetRecords.length}`);
    console.log(`Registros de Produção Normal: ${normalRecords.length}`);

    // Agrupar por equipamento para calcular o estoque correto
    const equipmentStock: { [key: string]: { currentStock: number; totalResets: number } } = {};

    // Calcular estoque correto baseado nos registros de produção
    productions.forEach((production) => {
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

    console.log('\n=== ESTOQUE CALCULADO BASEADO NOS REGISTROS ===');
    console.log(equipmentStock);

    // Atualizar o estoque de cada equipamento
    let updatedCount = 0;
    for (const [equipmentId, stock] of Object.entries(equipmentStock)) {
      const equipment = await Equipment.findById(equipmentId);
      if (equipment) {
        const oldCurrentStock = equipment.currentStock;
        const oldTotalResets = equipment.totalResets;
        
        equipment.currentStock = stock.currentStock;
        equipment.totalResets = stock.totalResets;
        
        await equipment.save();
        
        console.log(`\nEquipamento ${equipment.modelName}:`);
        console.log(`  - CurrentStock: ${oldCurrentStock} → ${stock.currentStock}`);
        console.log(`  - TotalResets: ${oldTotalResets} → ${stock.totalResets}`);
        
        // Verificar se houve correção
        if (oldCurrentStock !== stock.currentStock || oldTotalResets !== stock.totalResets) {
          console.log(`  ✅ CORRIGIDO: Registros de reset não afetam mais o estoque`);
        } else {
          console.log(`  ✅ Já estava correto`);
        }
        
        updatedCount++;
      }
    }

    console.log(`\n${updatedCount} equipamentos atualizados com sucesso`);

    // Mostrar resumo dos registros de reset
    if (resetRecords.length > 0) {
      console.log(`\n=== REGISTROS DE RESET ENCONTRADOS ===`);
      resetRecords.forEach((record, index) => {
        console.log(`${index + 1}. ${record.equipmentModel} - Qtd: ${record.quantity}`);
      });
      console.log(`\n⚠️  ATENÇÃO: ${resetRecords.length} registros de reset foram encontrados`);
      console.log(`   Estes registros NÃO devem afetar o currentStock, apenas o totalResets`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Erro ao corrigir estoque:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
};

fixResetStock(); 