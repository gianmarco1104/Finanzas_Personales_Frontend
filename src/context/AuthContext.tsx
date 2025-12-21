/*
createContext -> Canal de comunicacion invisible por toda la app
useState -> Memoria a corto plazo (Guarda datos mientras la app esta abierta)
useContext -> Herramienta para ir a ese canal y leer los datos
useEffect -> Evento que ocurre en momentos especificos (Como cuando inicias la app)
ReactNode -> Es un tipo de TS (Cualquier cosa que REACT pueda dibujar en pantalla)
*/
import { createContext, useState, useContext, type ReactNode, useEffect } from 'react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { AuthResponse } from '../types/auth.types';
/*
Indica 3 niveles de acceso
isAuthenticated -> Si estas dentro
login -> Recibir el token
logout -> Salir
*/
interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthResponse | null;
  login: (userData: AuthResponse) => void;
  logout: () => void;
}

//Crear el contexto, se inicializa vacia (undefined)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/*
Componente que envuelve toda la app
children -> Representa toda la aplicacion (Login, Dashboards, Menus, etc)
*/
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  //Estados -> Inicia en false porque no hay nadie logueado
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthResponse | null>(null); //Guarda datos del usuario
  //Verifica si ya estabas logueado antes de mostrar algo
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //Buscamos si hay un token y usuario guardado de antes
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user_data');
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []); //Sin los corchetes, al hacer F5 la variable isAuthenticated se pondria en false y lo sacaria del Login

  const login = (userData: AuthResponse) => {
    localStorage.setItem('token', userData.token); //Guardar en disco duro(navegador)
    localStorage.setItem('user_data', JSON.stringify(userData)); //Guardamos los datos del usuario
    setUser(userData);
    setIsAuthenticated(true); //Guarda en RAM (react)
  };

  const logout = () => {
    localStorage.removeItem('token'); //Borra del disco duro
    localStorage.removeItem('user_data');
    setUser(null);
    setIsAuthenticated(false); // Borra de la RAM
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>{children}</AuthContext.Provider>;
};

//Adaptador si se intenta usar fuera del AuthProvider,avisa que falta envolverlo
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};
