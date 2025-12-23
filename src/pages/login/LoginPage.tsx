import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { loginUser } from '../../services/auth.service';
import type { LoginRequest } from '../../types/auth.types';
import { LoginView } from './LoginView';

export const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginLogic = async (data: LoginRequest) => {
    setIsLoading(true);
    const toastId = toast.loading('Verificando credenciales...');

    try {
      const response = await loginUser(data);

      toast.success(`¡Bienvenido, ${response.fullName}!`, {
        id: toastId,
        duration: 2000,
      });

      login(response);
    } catch (error) {
      console.error(error);
      toast.error('Credenciales incorrectas. Inténtalo de nuevo.', {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginView register={register} errors={errors} isLoading={isLoading} onSubmit={handleSubmit(handleLoginLogic)} />
  );
};
