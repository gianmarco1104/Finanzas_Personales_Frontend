export interface Transaction {
  id: number;
  amount: number;
  description: string;
  date: string;
  categoryName: string | null;
  typeName: string;
  paymentMethod: string | null;
  isRecurring: boolean;
}

export interface FilterState {
  month: number;
  year: number;
  categoryId: number | '';
}

export interface TransactionDetail {
  id: number;
  amount: number;
  description: string;
  notes: string;
  dateProcess: string;
  userId: number;
  isRecurring: boolean;
  status: boolean;
  categories: { id: number; name: string } | null;
  transaction: { id: number; name: string };
  paymentMethods: { id: number; name: string } | null;
}

export interface UpdateTransactionRequest {
  id: number;
  amount: number;
  description: string;
  notes: string;
  dateProcess: string;
  isRecurring: boolean;
  categoryId: number | null;
  paymentMethodId: number | null;
  transactionTypeId: number;
}

export interface CreateTransactionRequest {
  amount: number;
  description: string;
  categoryId: number | null;
  transactionTypeId: number;
  paymentMethodId: number | null;
  isRecurring: boolean;
  notes: string;
  dateProcess: string;
}
