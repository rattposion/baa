import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Production from '../models/Production';
import Equipment from '../models/Equipment';

dotenv.config();

interface ProductionRecord {
  _id: string;
  employeeId: string;
  equipmentId: string;
  quantity: number;
  isReset: boolean;
  equipmentModel: string;
  date: string;
  employeeName: string;
}

const checkResetStatus = async (): Promise<void> => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mix_production');
    console.log('Conectado ao MongoDB');

    // Buscar todos os registros de produção
    const productions = await Production.find({}).lean() as ProductionRecord[];
    
    // Separar registros de reset e produção normal
    const resetRecords = productions.filter(p => p.isReset);
    const normalRecords = productions.filter(p => !p.isReset);
    
    console.log(`\n=== RELATÓRIO DE PRODUÇÃO ===`);
    console.log(`Total de registros: ${productions.length}`);
    console.log(`Registros de Reset: ${resetRecords.length}`);
    console.log(`Registros de Produção Normal: ${normalRecords.length}`);
    
    // Mostrar registros de reset
    if (resetRecords.length > 0) {
      console.log(`\n=== REGISTROS DE RESET ===`);
      resetRecords.forEach((record, index) => {
        console.log(`${index + 1}. ${record.employeeName} - ${record.equipmentModel} - Qtd: ${record.quantity} - Data: ${record.date}`);
      });
    }
    
    // Mostrar registros de produção normal
    if (normalRecords.length > 0) {
      console.log(`\n=== REGISTROS DE PRODUÇÃO NORMAL ===`);
      normalRecords.forEach((record, index) => {
        console.log(`${index + 1}. ${record.employeeName} - ${record.equipmentModel} - Qtd: ${record.quantity} - Data: ${record.date}`);
      });
    }
    
    // Verificar estoque atual dos equipamentos
    const equipments = await Equipment.find({});
    console.log(`\n=== ESTOQUE ATUAL DOS EQUIPAMENTOS ===`);
    equipments.forEach(equipment => {
      console.log(`${equipment.modelName}:`);
      console.log(`  - CurrentStock: ${equipment.currentStock}`);
      console.log(`  - TotalResets: ${equipment.totalResets}`);
    });
    
    // Calcular estoque correto baseado nos registros
    const equipmentStock: { [key: string]: { currentStock: number; totalResets: number } } = {};
    
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
    
    console.log(`\n=== ESTOQUE CALCULADO BASEADO NOS REGISTROS ===`);
    for (const [equipmentId, stock] of Object.entries(equipmentStock)) {
      const equipment = equipments.find(e => e._id.toString() === equipmentId);
      if (equipment) {
        console.log(`${equipment.modelName}:`);
        console.log(`  - CurrentStock Calculado: ${stock.currentStock}`);
        console.log(`  - TotalResets Calculado: ${stock.totalResets}`);
        console.log(`  - Diferença CurrentStock: ${stock.currentStock - equipment.currentStock}`);
        console.log(`  - Diferença TotalResets: ${stock.totalResets - equipment.totalResets}`);
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Erro ao verificar status:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
};

checkResetStatus(); 