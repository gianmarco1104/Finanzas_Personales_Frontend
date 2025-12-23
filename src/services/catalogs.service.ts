import api from './api';
import type { Country, Catalog } from '../types/catalogs.types';

export const getCountries = async (): Promise<Country[]> => {
  const { data } = await api.get<Country[]>('/catalogs/countries');
  return data;
};

export const getGenders = async (): Promise<Catalog[]> => {
  const { data } = await api.get<Catalog[]>('/catalogs/genders');
  return data;
};

export const getCategories = async (): Promise<Catalog[]> => {
  const response = await api.get('/catalogs/categories');
  return response.data;
};

export const getPaymentMethods = async (): Promise<Catalog[]> => {
  const response = await api.get('/catalogs/paymentMethods');
  return response.data;
};
