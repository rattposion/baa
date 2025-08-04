import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import Production from '../models/Production';
import Equipment from '../models/Equipment';
import User from '../models/User';

dotenv.config();

interface TestData {
  employeeId: string;
  equipmentId: string;
  quantity: number;
  date: string;
  isReset: boolean;
}

const testProductionAPI = async (): Promise<void> => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mix_production');
    console.log('Conectado ao MongoDB');

    // Verificar se existem funcionários e equipamentos
    const users = await User.find({}).lean();
    const equipments = await Equipment.find({}).lean();

    console.log(`\n=== DADOS DISPONÍVEIS ===`);
    console.log(`Funcionários: ${users.length}`);
    console.log(`Equipamentos: ${equipments.length}`);

    if (users.length === 0) {
      console.log('❌ Nenhum funcionário encontrado');
      process.exit(1);
    }

    if (equipments.length === 0) {
      console.log('❌ Nenhum equipamento encontrado');
      process.exit(1);
    }

    // Mostrar funcionários disponíveis
    console.log(`\n=== FUNCIONÁRIOS ===`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - ID: ${user._id}`);
    });

    // Mostrar equipamentos disponíveis
    console.log(`\n=== EQUIPAMENTOS ===`);
    equipments.forEach((equipment, index) => {
      console.log(`${index + 1}. ${equipment.modelName} - ID: ${equipment._id}`);
      console.log(`   - CurrentStock: ${equipment.currentStock}`);
      console.log(`   - TotalResets: ${equipment.totalResets}`);
    });

    // Testar criação de produção
    const testData: TestData = {
      employeeId: users[0]._id.toString(),
      equipmentId: equipments[0]._id.toString(),
      quantity: 10,
      date: new Date().toISOString().split('T')[0], // Data atual
      isReset: false
    };

    console.log(`\n=== TESTANDO CRIAÇÃO DE PRODUÇÃO ===`);
    console.log('Dados de teste:', testData);

    try {
      const production = await Production.create({
        employeeId: testData.employeeId,
        equipmentId: testData.equipmentId,
        quantity: testData.quantity,
        date: testData.date,
        employeeName: users[0].name,
        equipmentModel: equipments[0].modelName,
        timestamp: new Date(),
        isReset: testData.isReset,
      });

      console.log('✅ Produção criada com sucesso:', production);

      // Verificar se o equipamento foi atualizado
      const updatedEquipment = await Equipment.findById(testData.equipmentId);
      if (updatedEquipment) {
        console.log(`\n=== EQUIPAMENTO ATUALIZADO ===`);
        console.log(`Modelo: ${updatedEquipment.modelName}`);
        console.log(`CurrentStock: ${updatedEquipment.currentStock}`);
        console.log(`TotalResets: ${updatedEquipment.totalResets}`);
      }

    } catch (error: any) {
      console.error('❌ Erro ao criar produção:', error);
      console.error('Tipo de erro:', error.name);
      console.error('Código:', error.code);
      console.error('Mensagem:', error.message);
    }

    process.exit(0);
  } catch (error) {
    console.error('Erro geral:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
};

testProductionAPI(); 
