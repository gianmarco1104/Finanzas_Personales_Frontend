import { Construction, LogOut } from 'lucide-react'; // 👈 Cambiamos el icono a uno de construcción
import { useAuth } from '../context/AuthContext';

export const ForbiddenPage = () => {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        {/* Icono de Construcción (Amarillo para indicar precaución/trabajo) */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-yellow-100 rounded-full">
            <Construction className="w-12 h-12 text-yellow-600" />
          </div>
        </div>

        {/* Título Principal */}
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Sitio Administrativo</h1>

        {/* Subtítulo / Estado */}
        <h2 className="text-lg font-semibold text-gray-600 mb-4 uppercase tracking-wide">(En construcción)</h2>

        {/* Mensaje personalizado */}
        <p className="text-gray-500 mb-8">
          Hola <strong>{user?.fullName}</strong>. <br />
          Hemos detectado que tienes el rol de <span className="font-mono font-bold text-blue-600">{user?.role}</span>.
          <br />
          <br />
          Tu panel de control aún no ha sido iniciado. Por favor, vuelve más tarde o ingresa con una cuenta de usuario
          estándar.
        </p>

        {/* Botón de Acción */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors"
        >
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};
