import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/auth.service';
import type { LoginRequest } from '../types/auth.types';
import { useState } from 'react';
import { Lock, Mail, Loader2, ArrowRight, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';

export const LoginPage = () => {
  const {
    register, //Funcion para conectar los <input> con la libreria
    handleSubmit, //Envuelve el envio y verifica validaciones
    formState: { errors }, //Objeto que contiene los errores
  } = useForm<LoginRequest>();

  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: LoginRequest) => {
    setIsLoading(true); //Se actitva el spinner
    const toastId = toast.loading('Verificando credenciales...');
    try {
      const response = await loginUser(data); //Enviamos al back y esperamos respuesta
      toast.success(`¡Bienvenido, ${response.fullName}!`, {
        id: toastId, // Actualiza el mensaje de carga existente
        duration: 2000, // Dura 2 segundos
      });
      login(response); //Devuelve respuesta y internamente la guarda en local
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
    /*
    min-h-screen -> Ocupa toda la altura de la ventana
    flex items-center justify-center -> Centra la tarjeta en el medio de la pantalla
    bg-slate-900 -> Color de fondo azul oscuro
    max-w-md -> Ancho maximo mediano
    bg-white rounded-xl shadow-exl -> Fondo blanco, bordes redondeados y sombra
    */
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl">
        {/* Encabezado: Icono de billetera y Titulo */}
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 bg-blue-100 rounded-full mb-2">
            <Wallet className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Finanzas App</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="relative mt-1">
              {/* Icono absoluto posicionado a la izquierda dentro del input */}
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                {...register('email', { required: 'Email requerido' })}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="admin@gmail.com"
              />
            </div>
            {/* Mensaje de error condicional (solo sale si errors.email existe) */}
            {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                {...register('password', { required: 'Contraseña requerida' })}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading} //Deshabilita el click si esta cargando
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              // Si carga: Muestra el spinner girando
              <Loader2 className="animate-spin" />
            ) : (
              // Si no carga: Muestra texto e flecha
              <>
                Ingresar <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
