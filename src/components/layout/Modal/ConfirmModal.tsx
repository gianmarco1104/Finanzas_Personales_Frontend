import { AlertTriangle, X, Info, CheckCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import styles from './ConfirmModal.module.scss';

type ModalVariant = 'danger' | 'primary' | 'success';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
  variant?: ModalVariant;
  icon?: LucideIcon;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  icon: CustomIcon,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  const themeConfig = {
    danger: {
      iconStyle: styles.iconDanger,
      btnStyle: styles.btnDanger,
      DefaultIcon: AlertTriangle,
    },
    primary: {
      iconStyle: styles.iconPrimary,
      btnStyle: styles.btnPrimary,
      DefaultIcon: Info,
    },
    success: {
      iconStyle: styles.iconSuccess,
      btnStyle: styles.btnSuccess,
      DefaultIcon: CheckCircle,
    },
  };

  const currentTheme = themeConfig[variant];
  const DisplayIcon = CustomIcon || currentTheme.DefaultIcon;

  return (
    <div className={styles.overlay}>
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className={styles.modalContainer}>
        {/* ENCABEZADO */}
        <div className={styles.header}>
          {/* Icono con fondo de color dinámico */}
          <div className={`${styles.iconWrapper} ${currentTheme.iconStyle}`}>
            <DisplayIcon className={styles.iconSvg} />
          </div>

          <div className={styles.textGroup}>
            <h3 id="modal-title" className={styles.title}>
              {title}
            </h3>
            <p className={styles.message}>{message}</p>
          </div>

          <button onClick={onClose} className={styles.closeBtn} aria-label="Cerrar modal">
            <X size={20} />
          </button>
        </div>

        {/* PIE DE PÁGINA (Botones) */}
        <div className={styles.footer}>
          <button onClick={onClose} disabled={isLoading} className={`${styles.btnBase} ${styles.btnCancel}`}>
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`${styles.btnBase} ${styles.btnConfirm} ${currentTheme.btnStyle}`}
          >
            {isLoading ? 'Procesando...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
