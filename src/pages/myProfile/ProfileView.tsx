import { User, Phone, Globe, Lock, Mail, Save, X } from 'lucide-react';
import { Controller, type Control, type UseFormRegister } from 'react-hook-form';

import { MainLayout } from '../../components/layout/MainLayout';
import { FormInput } from '../../components/ui/InputData/InputData';
import { CustomDropdown } from '../../components/ui/CustomDropdown/CustomDropdown';
import { LoadingSpinner } from '../../components/ui/Spinner/LoadingSpinner';

import type { ChangePasswordRequest, UpdateProfileRequest, UserProfileResponse } from '../../types/user.types';
import type { Catalog, Country } from '../../types/catalogs.types';
import type { ChangeEmailRequest } from '../../types/user.types';
import styles from './ProfileView.module.scss';
import { ChangeEmailModal } from './ChangeEmailModal/ChangeEmail';
import { ChangePasswordModal } from './ChangePasswordModal/ChangePassword';

interface ProfileViewProps {
  user: UserProfileResponse | null;
  register: UseFormRegister<UpdateProfileRequest>;
  control: Control<UpdateProfileRequest>;
  isLoading: boolean;
  onSave: () => void;
  onCancel: () => void;
  isEmailModalOpen: boolean;
  onCloseEmailModal: () => void;
  onUpdateEmailSubmit: (data: ChangeEmailRequest) => Promise<void>;
  onChangeEmail: () => void;
  isPasswordModalOpen: boolean;
  onClosePasswordModal: () => void;
  onUpdatePasswordSubmit: (data: ChangePasswordRequest) => Promise<void>;
  onChangePassword: () => void;
  countries: Country[];
  genders: Catalog[];
}

export const ProfileView = ({
  user,
  register,
  control,
  isLoading,
  onSave,
  onCancel,
  isEmailModalOpen,
  onCloseEmailModal,
  onUpdateEmailSubmit,
  onChangeEmail,
  isPasswordModalOpen,
  onClosePasswordModal,
  onUpdatePasswordSubmit,
  onChangePassword,
  countries,
  genders,
}: ProfileViewProps) => {
  // Mapeos
  const countryOptions = countries.map((c) => ({ value: c.id, label: c.name }));
  const genderOptions = genders.map((g) => ({ value: g.id, label: g.name }));
  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : '';

  return (
    <MainLayout>
      {isLoading || !user ? (
        <div className="h-[calc(100vh-100px)] w-full">
          <LoadingSpinner />
        </div>
      ) : (
        <div className={styles.mainWrapper}>
          <header className={styles.header}>
            <div className={styles.titleGroup}>
              <div className={styles.avatar}>{initials}</div>
              <div>
                <h1 className={styles.title}>Mi Perfil</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className={styles.roleBadge}>{user.role.name}</span>
                  <span className="text-sm text-gray-500">{user.email}</span>
                </div>
              </div>
            </div>
          </header>

          <div className={styles.card}>
            <h3 className={styles.sectionTitle}>Información Personal</h3>

            <form className="space-y-6">
              <div className={styles.formGrid}>
                <FormInput label="Nombre" icon={User} {...register('firstName', { required: true })} />
                <FormInput label="Apellido" icon={User} {...register('lastName', { required: true })} />
                <FormInput label="Teléfono" icon={Phone} {...register('phone', { required: true })} />

                <div className={styles.fieldWrapper}>
                  <label className={styles.label}>
                    <User size={16} /> Género
                  </label>
                  <Controller
                    name="genderId"
                    control={control}
                    render={({ field }) => (
                      <CustomDropdown
                        value={field.value}
                        onChange={field.onChange}
                        options={genderOptions}
                        className="w-full"
                      />
                    )}
                  />
                </div>

                <div className={styles.fieldWrapper}>
                  <label className={styles.label}>
                    <Globe size={16} /> País
                  </label>
                  <Controller
                    name="countryId"
                    control={control}
                    render={({ field }) => (
                      <CustomDropdown
                        value={field.value}
                        onChange={field.onChange}
                        options={countryOptions}
                        className="w-full"
                      />
                    )}
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h3 className={styles.sectionTitle}>Seguridad y Acceso</h3>

                <div className={styles.formGrid}>
                  <div className={styles.actionGroup}>
                    <FormInput label="Correo Electrónico" icon={Mail} value={user.email} disabled readOnly />
                    <button type="button" onClick={onChangeEmail} className={styles.actionBtn}>
                      Cambiar Email
                    </button>
                  </div>

                  <div className={styles.actionGroup}>
                    <FormInput label="Contraseña" icon={Lock} type="password" value="********" disabled readOnly />
                    <button type="button" onClick={onChangePassword} className={styles.actionBtn}>
                      Cambiar Contraseña
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.footer}>
                <button type="button" onClick={onCancel} className={styles.btnSecondary}>
                  <X size={18} className="mr-2" /> Cancelar
                </button>
                <button type="button" onClick={onSave} className={styles.btnPrimary}>
                  <Save size={18} className="mr-2" /> Guardar Cambios
                </button>
              </div>
            </form>
          </div>

          <ChangeEmailModal
            isOpen={isEmailModalOpen}
            onClose={onCloseEmailModal}
            onSubmit={onUpdateEmailSubmit}
            currentEmail={user?.email}
          />

          <ChangePasswordModal
            isOpen={isPasswordModalOpen}
            onClose={onClosePasswordModal}
            onSubmit={onUpdatePasswordSubmit}
          />
        </div>
      )}
    </MainLayout>
  );
};
