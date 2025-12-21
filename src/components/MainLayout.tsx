import type { ReactNode } from 'react';
import { Sidebar } from './SideBar';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    // Flex row: Pone los elementos uno al lado del otro
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* 1. La Barra Lateral (Fija) */}
      <Sidebar />

      {/* 2. El Contenido Principal (Dinámico) */}
      {/* flex-1: Toma todo el espacio restante */}
      {/* overflow-y-auto: Si el contenido es largo, solo hace scroll esta parte, no el menú */}
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
};
