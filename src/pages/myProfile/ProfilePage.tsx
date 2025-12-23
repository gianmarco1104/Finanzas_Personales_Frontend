import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

// Componentes
import { ProfileView } from './ProfileView';
import { ConfirmModal } from '../../components/layout/Modal/ConfirmModal';

// Servicios
import { getUserProfile, updateUserProfile } from '../../services/user.service';
import { getCountries, getGenders } from '../../services/catalogs.service';

// Tipos
import type { UpdateProfileRequest, UserProfileResponse } from '../../types/user.types';
import type { Catalog, Country } from '../../types/catalogs.types';

export const ProfilePage = () => {
  // Estados de Datos
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [genders, setGenders] = useState<Catalog[]>([]);

  // Estados de UI
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Stubs para botones especiales
  const handleChangeEmail = () => toast('Función cambiar email pendiente');
  const handleChangePassword = () => toast('Función cambiar contraseña pendiente');

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
        onChangeEmail={handleChangeEmail}
        onChangePassword={handleChangePassword}
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
    </>
  );
};
