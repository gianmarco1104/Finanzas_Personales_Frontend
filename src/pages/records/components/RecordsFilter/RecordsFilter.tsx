import { useMemo } from 'react';
import { Filter } from 'lucide-react';
import type { FilterState } from '../../../../types/records.types';
import type { Catalog } from '../../../../types/catalogs.types';
import { CustomDropdown } from '../../../../components/ui/CustomDropdown/CustomDropdown'; // Ajusta la ruta si la moviste a UI
import styles from './RecordsFilter.module.scss';

interface RecordsFilterProps {
  categories: Catalog[];
  filters: FilterState;
  dateOptions: { month: number; year: number; label: string }[];
  onFilterChange: (key: keyof FilterState, value: any) => void;
}

export const RecordsFilter = ({ categories, filters, dateOptions, onFilterChange }: RecordsFilterProps) => {
  const formattedDateOptions = useMemo(() => {
    return dateOptions.map((opt) => ({
      value: `${opt.month}-${opt.year}`,
      label: opt.label,
    }));
  }, [dateOptions]);

  const formattedCategories = useMemo(() => {
    return [
      { value: '', label: 'Todas las Categorías' },
      ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
    ];
  }, [categories]);

  const handleDateChange = (val: string) => {
    const [month, year] = val.split('-');
    onFilterChange('month', parseInt(month));
    onFilterChange('year', parseInt(year));
  };

  return (
    <section aria-label="Filtros de búsqueda" className={styles.filterSection}>
      <div className={styles.labelGroup}>
        <Filter size={18} aria-hidden="true" />
        <span>Filtrar por:</span>
      </div>

      {/* SELECT: Fecha */}
      <CustomDropdown
        value={`${filters.month}-${filters.year}`}
        onChange={handleDateChange}
        options={formattedDateOptions}
        className={styles.dropdown}
      />

      {/* SELECT: Categoría */}
      <CustomDropdown
        value={filters.categoryId}
        onChange={(val) => onFilterChange('categoryId', val)}
        options={formattedCategories}
        placeholder="Categoría"
        className={styles.dropdown}
      />
    </section>
  );
};
