import React, { useState } from 'react';
import {
  UserIcon,
  ArchiveBoxIcon,
  PlusIcon
} from "@heroicons/react/24/outline";
import { useProduction } from '../hooks/useProduction';
import { useInventory } from '../hooks/useInventory';
import { Box, Heading } from '@chakra-ui/react';

export const Production: React.FC = () => {
  const { employees, productions, addProduction, getEmployeeProduction } = useProduction();
  const { equipment, addStockMovement } = useInventory();
  
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee || !selectedEquipment || !quantity || parseInt(quantity) <= 0) return;

    const selectedEquipmentItem = equipment.find(eq => eq.id === selectedEquipment);
    if (!selectedEquipmentItem) return;

    const quantityNum = parseInt(quantity);

    // Adiciona o registro de produção
    addProduction(
      selectedEmployee,
      selectedEquipment,
      selectedEquipmentItem.model,
      quantityNum
    );

    // Adiciona a entrada no estoque
    addStockMovement(
      selectedEquipment,
      'entrada',
      quantityNum,
      `Entrada por produção - ${selectedEquipmentItem.model}`
    );

    // Limpa o formulário
    setQuantity('');
    
    // Mostra mensagem de sucesso
    alert('Produção registrada e estoque atualizado com sucesso!');
  };

  const todayProductions = productions.filter(
    p => p.date === new Date().toISOString().split('T')[0]
  );

  return (
    <Box>
      <Heading mb={6}>Produção</Heading>
      <div className="p-6 space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Registro de Produção</h1>
          <p className="text-gray-600 mt-1">Acompanhamento da produção por colaborador</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Production Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <PlusIcon className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Novo Registro</h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Colaborador
                  </label>
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="input"
                    required
                  >
                    <option value="">Selecione um colaborador</option>
                    {employees.filter(emp => emp.active).map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name} - {employee.department}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modelo do Equipamento
                  </label>
                  <select
                    value={selectedEquipment}
                    onChange={(e) => setSelectedEquipment(e.target.value)}
                    className="input"
                    required
                  >
                    <option value="">Selecione um modelo</option>
                    {equipment.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} - {item.model}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantidade Produzida
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                    className="input"
                    placeholder="Quantidade..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  <span>Registrar Produção</span>
                </button>
              </form>
            </div>
          </div>

          {/* Employee Production Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Produção por Colaborador (Hoje)</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid gap-4">
                  {employees.filter(emp => emp.active).map((employee) => {
                    const dailyProduction = getEmployeeProduction(employee.id);
                    return (
                      <div
                        key={employee.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                            <p className="text-gray-600">{employee.department}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">{dailyProduction}</p>
                          <p className="text-sm text-gray-500">unidades produzidas</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Productions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <ArchiveBoxIcon className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Produções de Hoje</h2>
            </div>
          </div>
          <div className="p-6">
            {todayProductions.length > 0 ? (
              <div className="space-y-3">
                {todayProductions.map((production) => (
                  <div key={production.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <ArchiveBoxIcon className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">{production.employeeName}</p>
                        <p className="text-sm text-gray-600">{production.equipmentModel}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{production.quantity} unidades</p>
                      <p className="text-xs text-gray-500">
                        {new Date(production.timestamp).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ArchiveBoxIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">
                  Nenhuma produção registrada hoje. Use o formulário para adicionar registros.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Box>
  );
};

export default Production;