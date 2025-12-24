import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Componentes y Servicios
import { RecordsPageView } from './view/PageView/RecordsPageView';
import { ConfirmModal } from '../../components/layout/Modal/ConfirmModal/ConfirmModal'; // Asegúrate que la ruta sea correcta
import { getTransactions, deleteTransaction } from '../../services/records.service';
import { getCategories } from '../../services/catalogs.service';
import type { Transaction, FilterState } from '../../types/records.types';
import type { Catalog } from '../../types/catalogs.types';

export const RecordsPage = () => {
  // 1. Hooks y Estados Principales
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Catalog[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. Estados para el Modal de Eliminación
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedIdToDelete, setSelectedIdToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 3. Filtros
  const [filters, setFilters] = useState<FilterState>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    categoryId: '',
  });

  // Generador de fechas inteligente (Desde Dic 2025)
  const dateOptions = useMemo(() => {
    const startYear = 2025;
    const startMonth = 12;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const endYear = currentYear + 1;

    const options = [];
    const months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    for (let y = startYear; y <= endYear; y++) {
      const mStart = y === startYear ? startMonth : 1;
      const mEnd = 12;
      for (let m = mStart; m <= mEnd; m++) {
        options.push({ month: m, year: y, label: `${months[m - 1]} ${y}` });
      }
    }
    return options.reverse();
  }, []);

  // 4. Carga de datos (API)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catsData, transData] = await Promise.all([getCategories(), getTransactions(filters)]);

        setCategories(catsData);
        setTransactions(transData);
      } catch (error) {
        console.error(error);
        toast.error('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // --------------------------------------------------------------------------
  // LÓGICA DE ACCIONES (Vista y Delete)
  // --------------------------------------------------------------------------

  // A. Redireccionar al Detalle
  const handleViewDetail = (id: number) => {
    navigate(`/records/${id}`);
  };

  // B. Abrir Modal de Eliminación
  const handleOpenDeleteModal = (id: number) => {
    setSelectedIdToDelete(id);
    setDeleteModalOpen(true);
  };

  // C. Confirmar Eliminación (Llamada a API)
  const handleConfirmDelete = async () => {
    if (!selectedIdToDelete) return;

    setIsDeleting(true);
    // Iniciamos un toast de carga que luego actualizaremos
    const toastId = toast.loading('Eliminando registro...');

    try {
      await deleteTransaction(selectedIdToDelete);

      // Actualizamos el estado local quitando el item eliminado
      setTransactions((prev) => prev.filter((t) => t.id !== selectedIdToDelete));

      // Toast de éxito
      toast.success('El registro fue eliminado correctamente', { id: toastId });

      // Cerramos modal y limpiamos selección
      setDeleteModalOpen(false);
      setSelectedIdToDelete(null);
    } catch (error) {
      console.error(error);
      // Toast de error
      toast.error('Error al momento de eliminar el registro', { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* VISTA PRINCIPAL */}
      <RecordsPageView
        categories={categories}
        transactions={transactions}
        loading={loading}
        filters={filters}
        dateOptions={dateOptions}
        onFilterChange={handleFilterChange}
        onDelete={handleOpenDeleteModal} // Pasamos la función que abre el modal
        onView={handleViewDetail} // Pasamos la función de navegación
      />

      {/* MODAL DE CONFIRMACIÓN */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Eliminar Transacción"
        message="Esta acción no se puede deshacer."
        confirmText="Sí, eliminar"
        variant="danger"
      />
    </>
  );
};
