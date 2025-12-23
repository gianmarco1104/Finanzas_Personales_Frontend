import type { LucideIcon } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';
import styles from './InputData.module.scss';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  fullWidth?: boolean;
  error?: string;
}

export const FormInput = ({ label, icon: Icon, fullWidth = false, error, className, ...props }: FormInputProps) => {
  return (
    <div className={`${styles.container} ${fullWidth ? styles.fullWidth : ''}`}>
      <label className={styles.label}>
        <Icon size={16} className={styles.icon} />
        {label}
      </label>

      <div className={styles.inputWrapper}>
        <input
          className={`
            ${styles.inputField} 
            ${error ? styles.inputError : ''} 
            ${className || ''}
          `}
          {...props}
        />
      </div>

      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};
