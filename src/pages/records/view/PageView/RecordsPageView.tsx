import { MainLayout } from '../../../../components/layout/MainLayout';
import { RecordsHeader } from '../../components/RecordsHeader/RecordsHeader';
import { RecordsFilter } from '../../components/RecordsFilter/RecordsFilter';
import { RecordsTable } from '../../components/RecordsTable/RecordsTable';
import type { Transaction, FilterState } from '../../../../types/records.types';
import type { Catalog } from '../../../../types/catalogs.types';
import styles from './RecordsPageView.module.scss';

interface RecordsViewProps {
  categories: Catalog[];
  transactions: Transaction[];
  loading: boolean;
  filters: FilterState;
  dateOptions: { month: number; year: number; label: string }[];
  onFilterChange: (key: keyof FilterState, value: any) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}

export const RecordsPageView = ({
  categories,
  transactions,
  loading,
  filters,
  dateOptions,
  onFilterChange,
  onDelete,
  onView,
}: RecordsViewProps) => {
  return (
    <MainLayout>
      <main className={styles.pageContainer}>
        {/* 1. Encabezado y Botones */}
        <RecordsHeader />

        {/* 2. Barra de Filtros */}
        <RecordsFilter
          categories={categories}
          filters={filters}
          dateOptions={dateOptions}
          onFilterChange={onFilterChange}
        />

        {/* 3. Tabla de Resultados */}
        <RecordsTable transactions={transactions} loading={loading} onDelete={onDelete} onView={onView} />
      </main>
    </MainLayout>
  );
};
