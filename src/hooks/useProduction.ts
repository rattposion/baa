import { useState, useEffect } from 'react';
import api from '../services/api';

interface Production {
  id: string;
  employeeId: string;
  employeeName: string;
  equipmentId: string;
  equipmentModel: string;
  quantity: number;
  date: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const useProduction = () => {
  const [production, setProduction] = useState<Production[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduction = async () => {
    try {
      setLoading(true);
      const response = await api.get<Production[]>('/production');
      setProduction(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar registros de produção');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduction();
  }, []);

  const createProduction = async (data: Omit<Production, 'id' | 'employeeName' | 'equipmentModel' | 'createdAt' | 'updatedAt' | 'timestamp'>) => {
    try {
      const response = await api.post<Production>('/production', data);
      setProduction(prev => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Erro ao criar registro de produção');
    }
  };

  const updateProduction = async (id: string, data: Partial<Production>) => {
    try {
      const response = await api.put<Production>(`/production/${id}`, data);
      setProduction(prev =>
        prev.map(item => (item.id === id ? response.data : item))
      );
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Erro ao atualizar registro de produção');
    }
  };

  const deleteProduction = async (id: string) => {
    try {
      await api.delete(`/production/${id}`);
      setProduction(prev => prev.filter(item => item.id !== id));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Erro ao excluir registro de produção');
    }
  };

  const getProductionByDateRange = async (startDate: string, endDate: string) => {
    try {
      const response = await api.get<Production[]>(`/production?startDate=${startDate}&endDate=${endDate}`);
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Erro ao buscar registros de produção');
    }
  };

  const getProductionByEmployee = async (employeeId: string) => {
    try {
      const response = await api.get<Production[]>(`/production?employeeId=${employeeId}`);
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Erro ao buscar registros de produção');
    }
  };

  const getProductionByEquipment = async (equipmentId: string) => {
    try {
      const response = await api.get<Production[]>(`/production?equipmentId=${equipmentId}`);
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Erro ao buscar registros de produção');
    }
  };

  return {
    production,
    loading,
    error,
    createProduction,
    updateProduction,
    deleteProduction,
    getProductionByDateRange,
    getProductionByEmployee,
    getProductionByEquipment,
    refresh: fetchProduction,
  };
};