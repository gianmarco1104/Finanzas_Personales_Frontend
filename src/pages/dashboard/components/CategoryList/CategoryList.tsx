import type { ChartData } from '../../../../types/dashboard.types';
import { CHART_COLORS } from '../ExpenseChart/ExpenseChart';
import styles from './CategoryList.module.scss';
import { formatMoney } from '../../../../utils/format.utils';

interface CategoryListProps {
  data: ChartData[];
  loading?: boolean;
}

export const CategoryList = ({ data, loading }: CategoryListProps) => {
  return (
    <section className={styles.container}>
      <h3 className={styles.title}>Detalle por Categoría del Mes</h3>

      <ul className={styles.list} aria-busy={loading}>
        {loading
          ? [...Array(4)].map((_, index) => (
              <li key={index} className={styles.skeletonItem} aria-hidden="true">
                <div className={styles.skeletonGroup}>
                  <div className={styles.circle} />
                  <div className={styles.barLong} />
                </div>
                <div className={styles.columnEnd}>
                  <div className={styles.barMedium} />
                  <div className={styles.barShort} />
                </div>
              </li>
            ))
          : data.map((item, index) => (
              <li key={index} className={styles.item}>
                <div className={styles.infoGroup}>
                  <span
                    className={styles.dot}
                    style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                    aria-hidden="true"
                  />
                  <span className={styles.categoryName}>{item.category}</span>
                </div>
                <div className={styles.amountGroup}>
                  <p className={styles.total}>{formatMoney(item.total)}</p>
                  <p className={styles.percentage}>{item.percentage}%</p>
                </div>
              </li>
            ))}
      </ul>
    </section>
  );
};
