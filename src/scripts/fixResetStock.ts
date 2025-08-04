import dotenv from 'dotenv';
import mongoose, { Types } from 'mongoose';
import Production from '../models/Production';
import Equipment from '../models/Equipment';

dotenv.config();

interface ProductionRecord {
  _id: Types.ObjectId;
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
    const productions = await Production.find({}).lean() as ProductionRecord[];
    console.log(`Encontrados ${productions.length} registros de produção`);

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

    console.log('Estoque calculado por equipamento:');
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
        
        console.log(`Equipamento ${equipment.modelName}:`);
        console.log(`  - CurrentStock: ${oldCurrentStock} → ${stock.currentStock}`);
        console.log(`  - TotalResets: ${oldTotalResets} → ${stock.totalResets}`);
        
        updatedCount++;
      }
    }

    console.log(`\n${updatedCount} equipamentos atualizados com sucesso`);
    process.exit(0);
  } catch (error) {
    console.error('Erro ao corrigir estoque:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
};

fixResetStock(); 