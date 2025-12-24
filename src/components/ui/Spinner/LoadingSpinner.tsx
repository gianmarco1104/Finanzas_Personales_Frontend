import { Loader2 } from 'lucide-react';
import styles from './LoadingSpinner.module.scss';

interface LoadingSpinnerProps {
  text?: string;
}

export const LoadingSpinner = ({ text = 'Cargando datos...' }: LoadingSpinnerProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Loader2 className={styles.spinnerIcon} />
        <p className={styles.text}>{text}</p>
      </div>
    </div>
  );
};
