import { useState } from 'react'; // 👈 Importamos useState
import { Eye, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'; // 👈 Iconos para paginación
import type { Transaction } from '../../../../types/records.types';
import { RecordsCard } from '../RecordsCards/RecordsCards';
import { formatMoney, formatDate } from '../../../../utils/format.utils';
import styles from './RecordsTable.module.scss';

interface RecordsTableProps {
  transactions: Transaction[];
  loading: boolean;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}

export const RecordsTable = ({ transactions, loading, onDelete, onView }: RecordsTableProps) => {
  // 1. ESTADO PARA LA PÁGINA ACTUAL
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // 2. LÓGICA DE CORTE
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentTransactions = transactions.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <section className={styles.container}>
      {/* ==============================================
          VISTA MÓVIL (Cards)
         ============================================== */}
      <div className={styles.mobileView}>
        {loading ? (
          <div className={styles.mobileList}>
            {/* Skeletons... */}
            {[...Array(3)].map((_, i) => (
              <div key={i} className={styles.mobileSkeletonCard}>
                {/* ... tu contenido skeleton ... */}
                <div className={styles.rowBetween}>
                  <div className={styles.barMedium}></div>
                  <div className={styles.barShort}></div>
                </div>
                <div className={styles.barThin}></div>
                <div className={styles.barBlock}></div>
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className={styles.mobileEmpty}>No hay registros para este periodo.</div>
        ) : (
          <div className={styles.mobileList}>
            {/* 3. USAMOS currentTransactions EN LUGAR DE transactions */}
            {currentTransactions.map((t) => (
              <RecordsCard key={t.id} transaction={t} onDelete={onDelete} onView={onView} />
            ))}
          </div>
        )}
      </div>

      {/* ==============================================
          VISTA ESCRITORIO (Tabla)
         ============================================== */}
      <div className={styles.desktopView}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>Fecha</th>
              <th className={styles.th}>Descripción</th>
              <th className={styles.th}>Categoría</th>
              <th className={styles.th}>Tipo</th>
              <th className={styles.th}>Monto</th>
              <th className={`${styles.th} text-center`}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Skeleton Desktop (Igual que tenías)
              [...Array(5)].map((_, i) => (
                <tr key={i} className={styles.desktopSkeletonRow}>
                  {/* ... tus celdas skeleton ... */}
                  <td className={styles.td}>
                    <div className={`${styles.skBar} h-4 w-24`}></div>
                  </td>
                  <td className={styles.td}>
                    <div className={`${styles.skBar} h-4 w-32`}></div>
                  </td>
                  <td className={styles.td}>
                    <div className={`${styles.skBar} h-4 w-20`}></div>
                  </td>
                  <td className={styles.td}>
                    <div className={`${styles.skBar} h-4 w-16`}></div>
                  </td>
                  <td className={styles.td}>
                    <div className={`${styles.skBar} h-4 w-20`}></div>
                  </td>
                  <td className={styles.td}>
                    <div className={`${styles.skBar} h-8 w-16 mx-auto`}></div>
                  </td>
                </tr>
              ))
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                  No hay registros.
                </td>
              </tr>
            ) : (
              // 4. USAMOS currentTransactions AQUÍ TAMBIÉN
              currentTransactions.map((t) => {
                const isIncome = t.typeName === 'Ingreso';
                return (
                  <tr key={t.id} className={styles.row}>
                    <td className={styles.td}>{formatDate(t.date)}</td>
                    <td className={`${styles.td} ${styles.descText}`}>{t.description}</td>
                    <td className={styles.td}>
                      {t.categoryName ? (
                        <span className={styles.badgeCategory}>{t.categoryName}</span>
                      ) : (
                        <span className={styles.emptyText}>--</span>
                      )}
                    </td>
                    <td className={styles.td}>
                      <span className={`${styles.badgeType} ${isIncome ? styles.typeIncome : styles.typeExpense}`}>
                        {t.typeName}
                      </span>
                    </td>
                    <td
                      className={`${styles.td} ${styles.amount} ${
                        isIncome ? styles.amountIncome : styles.amountExpense
                      }`}
                    >
                      {isIncome ? '+' : '-'} {formatMoney(t.amount)}
                    </td>
                    <td className={styles.tdCenter}>
                      <div className={styles.actionsGroup}>
                        <button onClick={() => onView(t.id)} className={`${styles.actionBtn} ${styles.btnView}`}>
                          <Eye size={18} />
                        </button>
                        <button onClick={() => onDelete(t.id)} className={`${styles.actionBtn} ${styles.btnDelete}`}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ==============================================
          5. CONTROLES DE PAGINACIÓN
         ============================================== */}
      {!loading && totalPages > 1 && (
        <div className={styles.paginationContainer}>
          <span className={styles.pageInfo}>
            Página {currentPage} de {totalPages}
          </span>

          <div className={styles.pageButtons}>
            <button onClick={goToPrevPage} disabled={currentPage === 1} className={styles.pageBtn}>
              <ChevronLeft size={20} />
            </button>

            <button onClick={goToNextPage} disabled={currentPage === totalPages} className={styles.pageBtn}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
