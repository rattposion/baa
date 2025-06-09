import { useState, useEffect } from 'react';
import api from '../services/api';

interface Employee {
  id: string;
  name: string;
  department: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await api.get<Employee[]>('/employees');
      setEmployees(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar funcionários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const createEmployee = async (data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await api.post<Employee>('/employees', data);
      setEmployees(prev => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Erro ao criar funcionário');
    }
  };

  const updateEmployee = async (id: string, data: Partial<Employee>) => {
    try {
      const response = await api.put<Employee>(`/employees/${id}`, data);
      setEmployees(prev =>
        prev.map(employee => (employee.id === id ? response.data : employee))
      );
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Erro ao atualizar funcionário');
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      await api.delete(`/employees/${id}`);
      setEmployees(prev => prev.filter(employee => employee.id !== id));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Erro ao excluir funcionário');
    }
  };

  return {
    employees,
    loading,
    error,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    refresh: fetchEmployees,
  };
}; 