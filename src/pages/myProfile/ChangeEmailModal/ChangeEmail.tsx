import { useForm } from 'react-hook-form';
import { Mail, Lock, Save, X } from 'lucide-react';
import { FormInput } from '../../../components/ui/InputData/InputData';
import type { ChangeEmailRequest } from '../../../types/user.types';
import toast from 'react-hot-toast';
import styles from './ChangeEmail.module.scss';

interface ChangeEmailProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ChangeEmailRequest) => Promise<void>;
  currentEmail: string;
}

export const ChangeEmailModal = ({ isOpen, onClose, onSubmit, currentEmail }: ChangeEmailProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ChangeEmailRequest>();

  const handleFormSubmit = async (data: ChangeEmailRequest) => {
    try {
      await onSubmit(data);
      onClose();
      reset();
    } catch (error: any) {
      const serverMessage = error.response?.data?.message || 'Error desconocido';

      const errorMapping: Record<string, keyof ChangeEmailRequest> = {
        'en uso': 'newEmail',
        contraseña: 'currentPassword',
        'no coincide': 'currentEmail',
      };

      const matchingKey = Object.keys(errorMapping).find((key) => serverMessage.toLowerCase().includes(key));

      if (matchingKey) {
        const fieldName = errorMapping[matchingKey];
        setError(fieldName, {
          type: 'manual',
          message: serverMessage,
        });
      } else {
        toast.error(serverMessage);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className={styles.modalContainer}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.content}>
          {/* INPUTS PARA EL CAMBIO DE EMAIL */}
          <h2 id="modal-title" className={styles.title}>
            Cambiar correo electrónico
          </h2>

          <div className={styles.inputContainer}>
            <FormInput
              label="Correo electrónico actual"
              icon={Mail}
              placeholder="Escribe tu correo actual"
              error={errors.currentEmail?.message}
              {...register('currentEmail', {
                required: 'Este campo es obligatorio',
                validate: (value) => value === currentEmail || 'El correo no coincide con el actual',
              })}
              className={styles.inputBase}
            />
            <FormInput
              label="Correo electrónico nuevo"
              icon={Mail}
              placeholder="Escribe el nuevo correo"
              error={errors.newEmail?.message}
              {...register('newEmail', {
                required: 'Este campo es obligatorio',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido',
                },
              })}
              className={styles.inputBase}
            />
            <FormInput
              label="Contraseña actual"
              icon={Lock}
              placeholder="***********"
              type="password"
              error={errors.currentPassword?.message}
              {...register('currentPassword', { required: 'Este campo es obligatorio para el cambio' })}
              className={styles.inputBase}
            />
          </div>

          {/* BOTONES */}
          <div className={styles.containerButtons}>
            <button type="button" onClick={onClose} className={styles.btnCancel}>
              <X size={18} /> Cancelar
            </button>

            <button type="submit" className={styles.btnSave} disabled={isSubmitting}>
              <Save size={18} /> Cambiar Email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
