import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ProfileView } from './ProfileView';
import { ConfirmModal } from '../../components/layout/Modal/ConfirmModal/ConfirmModal';
import { getUserProfile, requestPasswordChange, updateUserProfile } from '../../services/user.service';
import { getCountries, getGenders } from '../../services/catalogs.service';
import type {
  ChangeEmailRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
  UserProfileResponse,
} from '../../types/user.types';
import type { Catalog, Country } from '../../types/catalogs.types';
import { requestEmailChange } from '../../services/user.service';
import { LoadingSpinner } from '../../components/ui/Spinner/LoadingSpinner';

export const ProfilePage = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  // Estados de Datos
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [genders, setGenders] = useState<Catalog[]>([]);

  // Estados de UI
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  // Formulario
  const { register, control, getValues, reset } = useForm<UpdateProfileRequest>();

  // 1. Cargar Datos
  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileData, countryData, genderData] = await Promise.all([
          getUserProfile(),
          getCountries(),
          getGenders(),
        ]);

        setUser(profileData);
        setCountries(countryData);
        setGenders(genderData);

        // Rellenamos el formulario inicialmente
        reset({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phone: profileData.phone,
          countryId: profileData.country.id,
          genderId: profileData.gender.id,
        });
      } catch (error) {
        toast.error('Error al cargar perfil');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [reset]);

  // 2. Botón Cancelar: Restaura los datos originales
  const handleCancel = () => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        countryId: user.country.id,
        genderId: user.gender.id,
      });
      toast('Cambios revertidos', { icon: 'info' });
    }
  };

  // 3. Botón Guardar: Abre el Modal
  const onSaveClick = () => {
    setIsModalOpen(true);
  };

  // 4. Confirmar en el Modal: Envía a la API
  const handleConfirmSave = async () => {
    setIsModalOpen(false); // Cerramos modal
    const data = getValues();

    try {
      await updateUserProfile(data);
      toast.success('Perfil actualizado correctamente');

      // Actualizamos el estado local "user" para que coincida con lo nuevo
      if (user) {
        setUser({
          ...user,
          ...data,
          country: countries.find((c) => c.id === data.countryId) || user.country,
          gender: genders.find((g) => g.id === data.genderId) || user.gender,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('Error al actualizar perfil');
    }
  };

  useEffect(() => {
    if (isLoggingOut) {
      const timer = setTimeout(() => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isLoggingOut]);

  const handleEmailUpdate = async (data: ChangeEmailRequest) => {
    await requestEmailChange(data);
    setIsLoggingOut(true);
  };

  const handleChangePassword = async (data: ChangePasswordRequest) => {
    await requestPasswordChange(data);
  };

  return (
    <>
      <ProfileView
        user={user}
        register={register}
        control={control}
        isLoading={isLoading}
        countries={countries}
        genders={genders}
        onSave={onSaveClick} // Abre Modal
        onCancel={handleCancel} // Resetea Formulario
        isEmailModalOpen={isEmailModalOpen}
        onChangeEmail={() => setIsEmailModalOpen(true)}
        onCloseEmailModal={() => setIsEmailModalOpen(false)}
        onUpdateEmailSubmit={handleEmailUpdate}
        isPasswordModalOpen={isPasswordModalOpen}
        onChangePassword={() => setIsPasswordModalOpen(true)}
        onClosePasswordModal={() => setIsPasswordModalOpen(false)}
        onUpdatePasswordSubmit={handleChangePassword}
      />

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSave}
        title="Guardar Cambios"
        message="¿Estás seguro de que deseas actualizar tu información personal?"
        confirmText="Sí, actualizar"
        cancelText="Cancelar"
        variant="primary"
      />

      {isLoggingOut && (
        <div className="fixed inset-0 z-[9999] bg-white/90 backdrop-blur-sm">
          <LoadingSpinner text="Actualización exitosa. Cerrando sesión..." />
        </div>
      )}
    </>
  );
};
