import type { LucideIcon } from 'lucide-react';
import styles from './KPICard.module.scss';

interface KpiCardProps {
  title: string;
  amount: string;
  icon: LucideIcon;
  color: 'green' | 'red' | 'indigo';
  loading?: boolean;
}

export const KPICard = ({ title, amount, icon: Icon, color, loading }: KpiCardProps) => {
  // Mapeamos el prop 'color' a las clases del SCSS
  const themeMap = {
    green: { text: styles.textGreen, bg: styles.bgGreen },
    red: { text: styles.textRed, bg: styles.bgRed },
    indigo: { text: styles.textIndigo, bg: styles.bgIndigo },
  };

  const theme = themeMap[color];

  return (
    <article className={styles.card}>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>

        {loading ? (
          <div role="status" aria-label="Cargando información" className={styles.skeletonLoader} />
        ) : (
          <p className={`${styles.amount} ${theme.text}`}>{amount}</p>
        )}
      </div>

      <div className={`${styles.iconWrapper} ${theme.bg}`} aria-hidden="true">
        <Icon className={`${styles.iconSvg} ${theme.text}`} />
      </div>
    </article>
  );
};
