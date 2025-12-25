import { useState, useEffect, type FormEvent } from 'react';
import {
  ArrowLeft,
  Calendar,
  FileText,
  CreditCard,
  Tag,
  Save,
  Wallet,
  DollarSign,
  CheckCircle,
  Repeat,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Componentes
import { MainLayout } from '../../../../components/layout/MainLayout';
import { FormInput } from '../../../../components/ui/InputData/InputData';
import { CustomDropdown } from '../../../../components/ui/CustomDropdown/CustomDropdown';
import { ConfirmModal } from '../../../../components/layout/Modal/ConfirmModal/ConfirmModal';

// Servicios y Tipos
import { updateTransaction } from '../../../../services/records.service';
import type { TransactionDetail, UpdateTransactionRequest } from '../../../../types/records.types';
import type { Catalog } from '../../../../types/catalogs.types';
import { LoadingSpinner } from '../../../../components/ui/Spinner/LoadingSpinner';

// Estilos
import styles from './RecordsDetailView.module.scss';

interface RecordDetailViewProps {
  data: TransactionDetail | null;
  loading: boolean;
  categoriesList: Catalog[];
  paymentMethodsList: Catalog[];
}

export const RecordDetailView = ({ data, loading, categoriesList, paymentMethodsList }: RecordDetailViewProps) => {
  const navigate = useNavigate();

  // Estados locales
  const [selectedCategory, setSelectedCategory] = useState<number | string>('');
  const [selectedPayment, setSelectedPayment] = useState<number | string>('');
  const [isRecurringSelect, setIsRecurringSelect] = useState<number>(0);

  // Estados Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<UpdateTransactionRequest | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (data) {
      if (data.categories) setSelectedCategory(data.categories.id);
      if (data.paymentMethods) setSelectedPayment(data.paymentMethods.id);
      setIsRecurringSelect(data.isRecurring ? 1 : 0);
    }
  }, [data]);

  const getInputDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <MainLayout>
        <main className={styles.mainWrapper}>
          <div className="h-[calc(100vh-100px)] w-full">
            <LoadingSpinner text="Cargando detalles..." />
          </div>
        </main>
      </MainLayout>
    );
  }

  if (!data) return null;

  const isExpense = data.transaction.name === 'Gasto';
  const categoryOptions = categoriesList.map((c) => ({ value: c.id, label: c.name }));
  const paymentOptions = paymentMethodsList.map((p) => ({ value: p.id, label: p.name }));
  const recurringOptions = [
    { value: 1, label: 'Sí' },
    { value: 0, label: 'No' },
  ];

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const rawDate = formData.get('dateProcess') as string;
    const dateISO = new Date(rawDate + 'T12:00:00').toISOString().split('.')[0];

    const payload: UpdateTransactionRequest = {
      id: data.id,
      amount: Number(formData.get('amount')),
      description: formData.get('description') as string,
      categoryId: isExpense ? Number(selectedCategory) : null,
      paymentMethodId: isExpense ? Number(selectedPayment) : null,
      transactionTypeId: data.transaction.id,
      isRecurring: isRecurringSelect === 1,
      notes: formData.get('notes') as string,
      dateProcess: dateISO,
    };

    if (isExpense && (!payload.categoryId || !payload.paymentMethodId)) {
      toast.error('Por favor selecciona Categoría y Método de Pago');
      return;
    }

    setPendingPayload(payload);
    setIsModalOpen(true);
  };

  const handleConfirmSave = async () => {
    if (!pendingPayload) return;
    setIsSaving(true);
    const toastId = toast.loading('Guardando cambios...');

    try {
      await updateTransaction(pendingPayload);
      toast.success('Registro actualizado correctamente', { id: toastId });
      setIsModalOpen(false);
      navigate('/records');
    } catch (error) {
      console.error(error);
      toast.error('Error al actualizar el registro', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MainLayout>
      <main className={styles.mainWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>Editar Transacción</h1>
          <p className={styles.subtitle}>Modifica los campos necesarios.</p>
        </div>

        <form onSubmit={handleFormSubmit} className={styles.formContainer}>
          <div className={styles.formGrid}>
            {/* INPUT TIPO (Estilos Condicionales Limpios) */}
            <FormInput
              label="Tipo"
              icon={Wallet}
              defaultValue={data.transaction.name}
              disabled
              className={`${styles.inputBase} ${isExpense ? styles.expenseStyle : styles.incomeStyle}`}
            />

            <FormInput
              label="Monto"
              icon={DollarSign}
              type="number"
              step="0.01"
              defaultValue={data.amount}
              name="amount"
              required
            />

            <FormInput
              label="Descripción"
              icon={FileText}
              defaultValue={data.description}
              name="description"
              fullWidth
              required
            />

            <FormInput
              label="Fecha de Proceso"
              icon={Calendar}
              type="date"
              defaultValue={getInputDate(data.dateProcess)}
              name="dateProcess"
              required
            />

            <FormInput
              label="Estado"
              icon={CheckCircle}
              defaultValue={data.status ? 'Procesado' : 'Pendiente'}
              disabled
            />

            <div className="space-y-2">
              <label className={styles.label}>
                <Repeat size={16} className="text-gray-400" /> Es Recurrente
              </label>
              <CustomDropdown
                value={isRecurringSelect}
                onChange={setIsRecurringSelect}
                options={recurringOptions}
                className="w-full"
              />
            </div>

            {isExpense && (
              <>
                <div className="space-y-2">
                  <label className={styles.label}>
                    <Tag size={16} className="text-gray-400" /> Categoría
                  </label>
                  <CustomDropdown
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    options={categoryOptions}
                    placeholder="Selecciona categoría"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className={styles.label}>
                    <CreditCard size={16} className="text-gray-400" /> Método de Pago
                  </label>
                  <CustomDropdown
                    value={selectedPayment}
                    onChange={setSelectedPayment}
                    options={paymentOptions}
                    placeholder="Selecciona método"
                    className="w-full"
                  />
                </div>
              </>
            )}

            <FormInput label="Notas Adicionales" icon={FileText} defaultValue={data.notes} name="notes" fullWidth />
          </div>

          <div className={styles.footerButtons}>
            <button type="button" onClick={() => navigate('/records')} className={styles.btnBack}>
              <ArrowLeft size={18} /> Regresar
            </button>
            <button type="submit" className={styles.btnSave}>
              <Save size={18} /> Guardar Cambios
            </button>
          </div>
        </form>

        <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmSave}
          isLoading={isSaving}
          title="Confirmar Cambios"
          message="¿Estás seguro de que deseas guardar los cambios realizados en esta transacción?"
          variant="primary"
          confirmText="Sí, guardar"
          icon={Save}
        />
      </main>
    </MainLayout>
  );
};
