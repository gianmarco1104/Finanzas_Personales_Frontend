import api from './api';
import type {
  Transaction,
  FilterState,
  TransactionDetail,
  UpdateTransactionRequest,
  CreateTransactionRequest,
} from '../types/records.types';

export const getTransactions = async (filters: FilterState): Promise<Transaction[]> => {
  const response = await api.get('/transactions/perUser', {
    params: {
      month: filters.month,
      year: filters.year,
      categoryId: filters.categoryId,
    },
  });
  return response.data;
};

export const getTransactionById = async (id: number): Promise<TransactionDetail> => {
  const response = await api.get(`/transactions/perUser/detail/${id}`);
  return response.data;
};

export const deleteTransaction = async (id: number): Promise<void> => {
  await api.patch(`/transactions/delete/${id}`);
};

export const updateTransaction = async (data: UpdateTransactionRequest): Promise<void> => {
  // En axios.put, el segundo argumento es el 'body' que se envía en formato JSON
  await api.put('/transactions/update', data);
};

export const createTransaction = async (data: CreateTransactionRequest): Promise<void> => {
  await api.post('/transactions/register', data);
};
