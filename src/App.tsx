import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/login/LoginPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { RecordsPage } from './pages/records/RecordsPage';
import { RecordDetailPage } from './pages/records/RecordsDetailPage';
import type { JSX } from 'react';
import { ForbiddenPage } from './pages/ForbiddenPage';
import { Toaster } from 'react-hot-toast';
import { RecordsCreatePage } from './pages/records/RecordsCreatePage';
import { RegisterPage } from './pages/login/Register/RegisterPage';
import { ProfilePage } from './pages/myProfile/ProfilePage';

//Guard 1 -> Este componente actua como un @PreAuthorize
const PrivateRoute = ({ children, requiredRole }: { children: JSX.Element; requiredRole?: string }) => {
  const { isAuthenticated, user } = useAuth();

  //Si no esta logueado -> Login
  if (!isAuthenticated) return <Navigate to="/login" />;

  //Rol Correcto -> Pasa
  if (requiredRole && user?.role === requiredRole) {
    return children;
  }

  //Rol Administrador
  if (user?.role === 'Administrador') {
    return <Navigate to="/admin" />;
  }

  //Rol Usuario
  if (user?.role === 'Usuario') {
    return <Navigate to="/dashboard" />;
  }

  return <Navigate to="/login" />;
};

//Guard 2 -> Evita que regrese al login cuando ya se autentico
const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated) {
    if (user?.role === 'Administrador') return <Navigate to="/admin" />;
    return <Navigate to="/dashboard" />;
  }
  return children;
};

function App() {
  return (
    //Envuelve todo para que la sesion exista en toda la navegacion
    <AuthProvider>
      {/* Habilita la navegacion SPA(Single Page Application) */}
      <BrowserRouter>
        {/* Ubica arriba derecha y los nuevos mensajes aparecen abajo de los viejos */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            // Estilos generales para todos los toast
            style: {
              borderRadius: '10px',
              background: '#1e293b', // Slate-800 (oscuro)
              color: '#fff', // Texto blanco
              fontSize: '14px',
              border: '1px solid #334155', // Borde gris sutil
              padding: '12px 16px',
            },
            // Personalización específica para Éxito
            success: {
              iconTheme: {
                primary: '#10B981', // Verde esmeralda brillante
                secondary: '#fff',
              },
            },
            // Personalización específica para Error
            error: {
              iconTheme: {
                primary: '#EF4444', // Rojo intenso
                secondary: '#fff',
              },
            },
          }}
        />
        {/* Elige la primera ruta que coincida */}
        <Routes>
          {/* Ruta Publica (Todos acceden) */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          {/* Ruta Privada (Solo acceden los autenticados) */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute requiredRole="Usuario">
                <DashboardPage />
              </PrivateRoute>
            }
          />

          {/* Ruta Privada (Solo acceden los autenticados) */}
          <Route
            path="/profile"
            element={
              <PrivateRoute requiredRole="Usuario">
                <ProfilePage />
              </PrivateRoute>
            }
          />
          {/* Registro de Consumo (Lista) */}
          <Route
            path="/records"
            element={
              <PrivateRoute requiredRole="Usuario">
                <RecordsPage />
              </PrivateRoute>
            }
          />

          {/* Detalle de Consumo (Dinámica) */}
          <Route
            path="/records/:id"
            element={
              <PrivateRoute requiredRole="Usuario">
                <RecordDetailPage />
              </PrivateRoute>
            }
          />

          {/* Crear Nuevo Registro de Consumo */}
          <Route
            path="/records/create"
            element={
              <PrivateRoute requiredRole="Usuario">
                <RecordsCreatePage />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <PrivateRoute requiredRole="Administrador">
                <ForbiddenPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
