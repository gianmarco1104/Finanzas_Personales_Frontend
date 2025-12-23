import { Loader2 } from 'lucide-react';
import styles from './LoadingSpinner.module.scss';

export const LoadingSpinner = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Loader2 className={styles.spinnerIcon} />
        <p className={styles.text}>Cargando datos...</p>
      </div>
    </div>
  );
};
