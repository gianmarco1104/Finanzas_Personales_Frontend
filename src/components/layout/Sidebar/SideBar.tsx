import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { LayoutDashboard, User, LogOut, Wallet, X, PiggyBank } from 'lucide-react';
import styles from './SideBar.module.scss';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SideBar = ({ isOpen, onClose }: SidebarProps) => {
  const { logout, user } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Métricas / Dashboard', icon: LayoutDashboard },
    { path: '/records', label: 'Registro de Consumo', icon: PiggyBank },
  ];

  return (
    <>
      {/* OVERLAY MÓVIL */}
      {isOpen && <div className={styles.overlay} onClick={onClose} aria-hidden="true" />}

      {/* SIDEBAR */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
        {/* PARTE SUPERIOR */}
        <div>
          {/* Header: Logo y Título */}
          <div className={styles.headerContainer}>
            <div className={styles.brandGroup}>
              <div className={styles.logoWrapper}>
                <Wallet className={styles.logoIcon} />
              </div>
              <div className={styles.titleGroup}>
                <h1 className={styles.appTitle}>Finanzas App</h1>
                <span className={styles.version}>v1.0.0</span>
              </div>
            </div>

            {/* Botón Cerrar (Móvil) */}
            <button onClick={onClose} className={styles.closeBtn} aria-label="Cerrar menú">
              <X size={24} />
            </button>
          </div>

          {/* Navegación */}
          <nav className={styles.nav}>
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              >
                <item.icon size={20} />
                <span className={styles.navLabel}>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* PARTE INFERIOR: Perfil y Salir */}
        <div className={styles.footer}>
          <NavLink
            to="/profile"
            onClick={onClose}
            className={({ isActive }) => `${styles.profileLink} ${isActive ? styles.profileActive : ''}`}
          >
            <User size={20} />
            <div className={styles.profileInfo}>
              <span className="font-medium text-sm">Mi Perfil</span>
              <span className={styles.profileName}>{user?.fullName || 'Usuario'}</span>
            </div>
          </NavLink>

          <button onClick={logout} className={styles.logoutBtn}>
            <LogOut size={20} />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};
