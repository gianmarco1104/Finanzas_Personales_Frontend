import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler, type SubmitErrorHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Componente Visual
import { RegisterView } from './RegisterView';

// Servicios y Tipos
import { registerUser } from '../../../services/register.service';
import { getCountries, getGenders } from '../../../services/catalogs.service';
import type { RegisterRequest } from '../../../types/register.types';
import type { Country, Catalog } from '../../../types/catalogs.types';

export const RegisterPage = () => {
  const navigate = useNavigate();

  // Estados de carga
  const [countries, setCountries] = useState<Country[]>([]);
  const [genders, setGenders] = useState<Catalog[]>([]);
  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState(true);

  // Hook del formulario
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<RegisterRequest>();

  // 1. Cargar datos iniciales (Catálogos)
  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const [countriesData, gendersData] = await Promise.all([getCountries(), getGenders()]);
        setCountries(countriesData);
        setGenders(gendersData);
      } catch (error) {
        console.error(error);
        toast.error('Error al cargar opciones del sistema');
      } finally {
        setIsLoadingCatalogs(false);
      }
    };
    fetchCatalogs();
  }, []);

  // 2. Manejador de SUBMIT VÁLIDO (Todo correcto)
  const onValidSubmit: SubmitHandler<RegisterRequest> = async (data) => {
    const payload: RegisterRequest = {
      ...data,
      countryId: Number(data.countryId),
      genderId: Number(data.genderId),
    };

    try {
      await registerUser(payload);
      toast.success('¡Registro exitoso! Redirigiendo...');

      setTimeout(() => navigate('/login'), 2000);
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Error al procesar el registro';
      toast.error(msg);
    }
  };

  // 3. Manejador de ERRORES DE VALIDACIÓN
  const onInvalidSubmit: SubmitErrorHandler<RegisterRequest> = (errors) => {
    toast.error('Por favor, completa todos los campos requeridos.');
    console.log('Errores de validación:', errors);
  };

  return (
    <RegisterView
      register={register}
      errors={errors}
      setValue={setValue}
      watch={watch}
      isLoading={isSubmitting || isLoadingCatalogs}
      onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}
      countries={countries}
      genders={genders}
    />
  );
};
