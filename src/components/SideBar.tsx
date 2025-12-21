import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Receipt, User, LogOut, Wallet } from 'lucide-react';

export const Sidebar = () => {
  const { logout, user } = useAuth();

  // Definimos los items del menú en un array para no repetir código HTML
  const menuItems = [
    {
      path: '/dashboard',
      label: 'Métricas / Dashboard',
      icon: LayoutDashboard,
    },
    {
      path: '/records',
      label: 'Registro de Consumo',
      icon: Receipt,
    },
  ];

  return (
    // ASIDE: Es la etiqueta semántica para barras laterales
    // w-64: Ancho fijo de 256px
    // h-screen: Ocupa toda la altura
    // bg-slate-900: Mismo color oscuro que el Login para mantener identidad
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col justify-between">
      {/* PARTE SUPERIOR */}
      <div>
        {/* Logo / Título de la App */}
        <div className="flex items-center gap-3 p-6 border-b border-slate-800">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Finanzas App</h1>
            <span className="text-xs text-slate-400">v1.0.0</span>
          </div>
        </div>

        {/* Navegación Principal */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              // NavLink nos da la variable 'isActive' automáticamente
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg' // Estado Activo
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white' // Estado Inactivo
                }
              `}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* PARTE INFERIOR (Perfil y Salir) */}
      <div className="p-4 border-t border-slate-800">
        {/* Link a Perfil */}
        <NavLink
          to="/profile"
          className={({ isActive }) => `
            flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 mb-2
            ${isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
          `}
        >
          <User size={20} />
          <div className="flex flex-col">
            <span className="font-medium text-sm">Mi Perfil</span>
            {/* Mostramos el nombre real del usuario traído del Context */}
            <span className="text-xs text-slate-500 truncate max-w-[140px]">{user?.fullName || 'Usuario'}</span>
          </div>
        </NavLink>

        {/* Botón Salir */}
        <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
          <LogOut size={20} />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};
