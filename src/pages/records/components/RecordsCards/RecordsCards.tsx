import { Eye, Trash2 } from 'lucide-react';
import type { Transaction } from '../../../../types/records.types';
import { formatMoney, formatDate } from '../../../../utils/format.utils';
import styles from './RecordsCards.module.scss';

interface RecordCardProps {
  transaction: Transaction;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}

export const RecordsCard = ({ transaction, onDelete, onView }: RecordCardProps) => {
  // Lógica auxiliar para determinar estilos
  const isIncome = transaction.typeName === 'Ingreso';
  const amountSign = isIncome ? '+' : '-';

  // Clases dinámicas basadas en el tipo
  const amountClass = isIncome ? styles.textIncome : styles.textExpense;
  const badgeClass = isIncome ? styles.badgeIncome : styles.badgeExpense;

  return (
    <article className={styles.card}>
      {/* 1. ENCABEZADO: Título y Monto */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h3 className={styles.description} title={transaction.description}>
            {transaction.description}
          </h3>
          <time className={styles.date} dateTime={transaction.date}>
            {formatDate(transaction.date)}
          </time>
        </div>

        <span className={`${styles.amount} ${amountClass}`}>
          {amountSign} {formatMoney(transaction.amount)}
        </span>
      </div>

      {/* 2. BADGES: Etiquetas */}
      <div className={styles.badgesRow}>
        <span className={`${styles.typeBadge} ${badgeClass}`}>{transaction.typeName}</span>

        {transaction.categoryName && <span className={styles.categoryBadge}>{transaction.categoryName}</span>}
      </div>

      {/* 3. ACCIONES: Botones */}
      <div className={styles.actionsRow}>
        <button
          onClick={() => onView(transaction.id)}
          className={`${styles.actionBtn} ${styles.btnView}`}
          aria-label="Ver detalle"
        >
          <Eye size={16} /> Ver Detalle
        </button>

        <button
          onClick={() => onDelete(transaction.id)}
          className={`${styles.actionBtn} ${styles.btnDelete}`}
          aria-label="Eliminar registro"
        >
          <Trash2 size={16} /> Eliminar
        </button>
      </div>
    </article>
  );
};
