import { useState } from 'react';
import { Menu } from 'lucide-react';
import { SideBar } from './Sidebar/SideBar';
import styles from './MainLayout.module.scss';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  // Estado para controlar la visibilidad del sidebar en móvil
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.layoutContainer}>
      {/* SIDEBAR: Recibe estado y función de cierre */}
      <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className={styles.contentWrapper}>
        {/* BARRA SUPERIOR MÓVIL */}
        <header className={styles.mobileHeader}>
          <button onClick={() => setSidebarOpen(true)} className={styles.menuBtn} aria-label="Abrir menú de navegación">
            <Menu size={24} />
          </button>
          <span className={styles.mobileTitle}>Finanzas App</span>
        </header>

        <main className={styles.mainContent}>{children}</main>
      </div>
    </div>
  );
};
