import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

// Componente Visual
import { RecordsCreateView } from './view/CreateView/RecordsCreateView';

// Servicios y Tipos
import { createTransaction } from '../../services/records.service';
import { getCategories, getPaymentMethods } from '../../services/catalogs.service';
import type { CreateTransactionRequest } from '../../types/records.types';
import type { Catalog } from '../../types/catalogs.types';

// Definimos la estructura del formulario (ligeramente diferente al Request final)
export interface TransactionFormValues {
  amount: string; // Inputs numéricos suelen manejarse como string en forms
  description: string;
  transactionTypeId: number;
  isRecurring: number; // Tu dropdown usa 1 o 0
  notes: string;
  dateProcess: string;
  categoryId: number | ''; // Puede estar vacío
  paymentMethodId: number | '';
}

export const RecordsCreatePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Estados de catálogos
  const [categories, setCategories] = useState<Catalog[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<Catalog[]>([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);

  // Configuración del Formulario
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    defaultValues: {
      transactionTypeId: location.state?.type || 2, // Gasto por defecto
      isRecurring: 0,
      amount: '',
      description: '',
      notes: '',
      categoryId: '',
      paymentMethodId: '',
      // Tu lógica de fecha por defecto:
      dateProcess: new Date().toLocaleDateString('en-CA', { timeZone: 'America/Lima' }),
    },
  });

  // 1. Cargar Catálogos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, pays] = await Promise.all([getCategories(), getPaymentMethods()]);
        setCategories(cats);
        setPaymentMethods(pays);
      } catch (error) {
        console.error(error);
        toast.error('Error al cargar listas');
      } finally {
        setLoadingCatalogs(false);
      }
    };
    fetchData();
  }, []);

  // 2. Lógica para limpiar campos si cambia el tipo (Ingreso vs Gasto)
  const transactionTypeId = watch('transactionTypeId');
  useEffect(() => {
    if (transactionTypeId === 1) {
      // Si es Ingreso
      setValue('categoryId', '');
      setValue('paymentMethodId', '');
    }
  }, [transactionTypeId, setValue]);

  // 3. Envío del Formulario
  const onSubmit: SubmitHandler<TransactionFormValues> = async (data) => {
    // Transformación de datos para la API
    const dateISO = new Date(data.dateProcess + 'T12:00:00').toISOString().split('.')[0];

    const payload: CreateTransactionRequest = {
      amount: Number(data.amount),
      description: data.description,
      transactionTypeId: data.transactionTypeId,
      isRecurring: data.isRecurring === 1,
      notes: data.notes,
      dateProcess: dateISO,
      // Convertimos a null si está vacío o es Ingreso
      categoryId: data.transactionTypeId === 2 && data.categoryId ? Number(data.categoryId) : null,
      paymentMethodId: data.transactionTypeId === 2 && data.paymentMethodId ? Number(data.paymentMethodId) : null,
    };

    try {
      await createTransaction(payload);
      toast.success('Transacción registrada con éxito');
      navigate('/records');
    } catch (error) {
      console.error(error);
      toast.error('Error al registrar la transacción');
    }
  };

  return (
    <RecordsCreateView
      register={register}
      control={control}
      errors={errors}
      watch={watch}
      isLoading={isSubmitting || loadingCatalogs}
      onSubmit={handleSubmit(onSubmit)}
      categoriesList={categories}
      paymentMethodsList={paymentMethods}
      onCancel={() => navigate('/records')}
    />
  );
};
