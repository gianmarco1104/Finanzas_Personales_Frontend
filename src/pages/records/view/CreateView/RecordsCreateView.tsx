import { ArrowLeft, Calendar, FileText, CreditCard, Tag, Save, Wallet, DollarSign, Repeat } from 'lucide-react';
import { Controller, type Control, type FieldErrors, type UseFormRegister, type UseFormWatch } from 'react-hook-form';
import { MainLayout } from '../../../../components/layout/MainLayout';
import { FormInput } from '../../../../components/ui/InputData/InputData';
import { CustomDropdown } from '../../../../components/ui/CustomDropdown/CustomDropdown';
import { LoadingSpinner } from '../../../../components/ui/Spinner/LoadingSpinner';
import type { Catalog } from '../../../../types/catalogs.types';
import type { TransactionFormValues } from '../../RecordsCreatePage';
import styles from './RecordsCreateView.module.scss';

interface RecordsCreateViewProps {
  register: UseFormRegister<TransactionFormValues>;
  control: Control<TransactionFormValues>;
  errors: FieldErrors<TransactionFormValues>;
  watch: UseFormWatch<TransactionFormValues>;
  isLoading: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  categoriesList: Catalog[];
  paymentMethodsList: Catalog[];
  onCancel: () => void;
}

export const RecordsCreateView = ({
  register,
  control,
  errors,
  watch,
  isLoading,
  onSubmit,
  categoriesList,
  paymentMethodsList,
  onCancel,
}: RecordsCreateViewProps) => {
  // Detectar si es Gasto (2) para mostrar condicionales
  const currentType = watch('transactionTypeId');
  const isExpense = currentType === 2;

  // Opciones estáticas
  const typeOptions = [
    { value: 1, label: 'Ingreso' },
    { value: 2, label: 'Gasto' },
  ];
  const recurringOptions = [
    { value: 1, label: 'Sí' },
    { value: 0, label: 'No' },
  ];

  // Mapeo de catálogos
  const categoryOptions = categoriesList.map((c) => ({ value: c.id, label: c.name }));
  const paymentOptions = paymentMethodsList.map((p) => ({ value: p.id, label: p.name }));

  return (
    <MainLayout>
      <main className={styles.mainWrapper}>
        {isLoading && categoriesList.length === 0 ? (
          <div className="h-[calc(100vh-153px)] w-full">
            <LoadingSpinner text="Cargando formulario..." />
          </div>
        ) : (
          <>
            <header className={styles.header}>
              <h1 className={styles.title}>Nueva Transacción</h1>
              <p className={styles.subtitle}>Registra tus movimientos financieros.</p>
            </header>
            <form onSubmit={onSubmit} className={styles.formContainer}>
              <div className={styles.formGrid}>
                {/* 1. TIPO DE TRANSACCIÓN (Dropdown Controlado) */}
                <div className={styles.fieldWrapper}>
                  <label className={styles.label}>
                    <Wallet size={16} className="text-gray-400" /> Tipo
                  </label>
                  <Controller
                    name="transactionTypeId"
                    control={control}
                    render={({ field }) => (
                      <CustomDropdown
                        value={field.value}
                        onChange={(val) => field.onChange(val)}
                        options={typeOptions}
                        className="w-full"
                      />
                    )}
                  />
                </div>

                {/* 2. MONTO */}
                <FormInput
                  label="Monto"
                  icon={DollarSign}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('amount', {
                    required: 'El monto es requerido',
                    min: { value: 0.01, message: 'El monto debe ser mayor a 0' },
                  })}
                  error={errors.amount?.message}
                />

                {/* 3. DESCRIPCIÓN */}
                <FormInput
                  label="Descripción"
                  icon={FileText}
                  placeholder="Ej: Compras supermercado"
                  fullWidth
                  {...register('description', { required: 'La descripción es requerida' })}
                  error={errors.description?.message}
                />

                {/* 4. FECHA (Aquí se ve el error como pediste) */}
                <FormInput
                  label="Fecha de Proceso"
                  icon={Calendar}
                  type="date"
                  {...register('dateProcess', { required: 'La fecha es requerida' })}
                  error={errors.dateProcess?.message}
                />

                {/* 5. RECURRENCIA (Dropdown Controlado) */}
                <div className={styles.fieldWrapper}>
                  <label className={styles.label}>
                    <Repeat size={16} className="text-gray-400" /> Es Recurrente
                  </label>
                  <Controller
                    name="isRecurring"
                    control={control}
                    render={({ field }) => (
                      <CustomDropdown
                        value={field.value}
                        onChange={field.onChange}
                        options={recurringOptions}
                        className="w-full"
                      />
                    )}
                  />
                </div>

                {/* 6. CAMPOS CONDICIONALES (Solo Gastos) */}
                {isExpense && (
                  <>
                    {/* Categoría */}
                    <div className={styles.animatedField}>
                      <label className={styles.label}>
                        <Tag size={16} className="text-gray-400" /> Categoría
                      </label>
                      <Controller
                        name="categoryId"
                        control={control}
                        rules={{ required: 'La categoría es obligatoria para gastos' }}
                        render={({ field }) => (
                          <CustomDropdown
                            value={field.value}
                            onChange={field.onChange}
                            options={categoryOptions}
                            placeholder="Selecciona categoría"
                          />
                        )}
                      />
                      {errors.categoryId && <span className={styles.errorText}>{errors.categoryId.message}</span>}
                    </div>

                    {/* Método de Pago */}
                    <div className={styles.animatedField}>
                      <label className={styles.label}>
                        <CreditCard size={16} className="text-gray-400" /> Método de Pago
                      </label>
                      <Controller
                        name="paymentMethodId"
                        control={control}
                        rules={{ required: 'El método de pago es obligatorio' }}
                        render={({ field }) => (
                          <CustomDropdown
                            value={field.value}
                            onChange={field.onChange}
                            options={paymentOptions}
                            placeholder="Selecciona método"
                          />
                        )}
                      />
                      {errors.paymentMethodId && (
                        <span className={styles.errorText}>{errors.paymentMethodId.message}</span>
                      )}
                    </div>
                  </>
                )}

                {/* 7. NOTAS */}
                <FormInput
                  label="Notas Adicionales"
                  icon={FileText}
                  placeholder="Detalles opcionales..."
                  fullWidth
                  {...register('notes')}
                />
              </div>

              {/* FOOTER BOTONES */}
              <div className={styles.footerButtons}>
                <button type="button" onClick={onCancel} className={styles.btnCancel}>
                  <ArrowLeft size={18} /> Cancelar
                </button>
                <button type="submit" disabled={isLoading} className={styles.btnSubmit}>
                  <Save size={18} /> {isLoading ? 'Guardando...' : 'Registrar'}
                </button>
              </div>
            </form>
          </>
        )}
      </main>
    </MainLayout>
  );
};
