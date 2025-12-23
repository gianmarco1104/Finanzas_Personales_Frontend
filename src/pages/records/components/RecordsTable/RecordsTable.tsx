import { Eye, Trash2 } from 'lucide-react';
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
  return (
    <section className={styles.container}>
      {/* ==============================================
          VISTA MÓVIL (Cards)
         ============================================== */}
      <div className={styles.mobileView}>
        {loading ? (
          <div className={styles.mobileList}>
            {[...Array(3)].map((_, i) => (
              <div key={i} className={styles.mobileSkeletonCard}>
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
            {transactions.map((t) => (
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
              // Skeleton Desktop
              [...Array(5)].map((_, i) => (
                <tr key={i} className={styles.desktopSkeletonRow}>
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
              transactions.map((t) => {
                const isIncome = t.typeName === 'Ingreso';

                return (
                  <tr key={t.id} className={styles.row}>
                    <td className={styles.td}>{formatDate(t.date)}</td>
                    <td className={`${styles.td} ${styles.descText}`}>{t.description}</td>

                    {/* Columna Categoría */}
                    <td className={styles.td}>
                      {t.categoryName ? (
                        <span className={styles.badgeCategory}>{t.categoryName}</span>
                      ) : (
                        <span className={styles.emptyText}>--</span>
                      )}
                    </td>

                    {/* Columna Tipo */}
                    <td className={styles.td}>
                      <span className={`${styles.badgeType} ${isIncome ? styles.typeIncome : styles.typeExpense}`}>
                        {t.typeName}
                      </span>
                    </td>

                    {/* Columna Monto */}
                    <td
                      className={`${styles.td} ${styles.amount} ${
                        isIncome ? styles.amountIncome : styles.amountExpense
                      }`}
                    >
                      {isIncome ? '+' : '-'} {formatMoney(t.amount)}
                    </td>

                    {/* Columna Acciones */}
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
    </section>
  );
};
