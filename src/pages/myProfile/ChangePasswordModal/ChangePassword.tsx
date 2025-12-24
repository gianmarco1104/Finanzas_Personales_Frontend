import { useForm } from 'react-hook-form';
import { Lock, Save, X } from 'lucide-react';
import { FormInput } from '../../../components/ui/InputData/InputData';
import type { ChangePasswordRequest } from '../../../types/user.types';
import toast from 'react-hot-toast';
import styles from './ChangePassword.module.scss';

interface ChangePasswordProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ChangePasswordRequest) => Promise<void>;
}

interface ChangePasswordFormValues extends ChangePasswordRequest {
  repeatNewPassword: string;
}

export const ChangePasswordModal = ({ isOpen, onClose, onSubmit }: ChangePasswordProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>();

  const newPasswordValue = watch('newPassword');

  const handleFormSubmitPass = async (data: ChangePasswordFormValues) => {
    try {
      const { repeatNewPassword, ...dataToSend } = data;
      await onSubmit(dataToSend);
      toast.success('Cambio de contraseña realizado correctamente');
      onClose();
      reset();
    } catch (error: any) {
      const serverMessage = error.response?.data?.message || 'Error desconocido';
      const errorMapping: Record<string, keyof ChangePasswordFormValues> = {
        'es incorrecta': 'currentPassword',
        'igual a la anterior': 'newPassword',
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
        <form onSubmit={handleSubmit(handleFormSubmitPass)} className={styles.content}>
          {/* INPUTS PARA EL CAMBIO DE EMAIL */}
          <h2 id="modal-title" className={styles.title}>
            Cambiar contraseña
          </h2>

          <div className={styles.inputContainer}>
            <FormInput
              label="Contraseña actual"
              icon={Lock}
              placeholder="***********"
              type="password"
              error={errors.currentPassword?.message}
              {...register('currentPassword', {
                required: 'Este campo es obligatorio',
              })}
              className={styles.inputBase}
            />

            <FormInput
              label="Contraseña nueva"
              icon={Lock}
              placeholder="***********"
              type="password"
              error={errors.newPassword?.message}
              {...register('newPassword', {
                required: 'Este campo es obligatorio',
              })}
              className={styles.inputBase}
            />

            <FormInput
              label="Repetir contraseña nueva"
              icon={Lock}
              placeholder="***********"
              type="password"
              error={errors.repeatNewPassword?.message}
              {...register('repeatNewPassword', {
                required: 'Debes confirmar la contraseña',
                validate: (value) => value === newPasswordValue || 'Las contraseñas no coinciden',
              })}
              className={styles.inputBase}
            />
          </div>

          {/* BOTONES */}
          <div className={styles.containerButtons}>
            <button type="button" onClick={onClose} className={styles.btnCancel}>
              <X size={18} /> Cancelar
            </button>

            <button type="submit" className={styles.btnSave} disabled={isSubmitting}>
              <Save size={18} /> Cambiar contraseña
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
