import { Lock, Mail, Loader2, ArrowRight, Wallet } from 'lucide-react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { LoginRequest } from '../../types/auth.types'; // Ajusta la ruta según tu estructura
import styles from './LoginView.module.scss';
import { Link } from 'react-router-dom';

interface LoginViewProps {
  register: UseFormRegister<LoginRequest>;
  errors: FieldErrors<LoginRequest>;
  isLoading: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export const LoginView = ({ register, errors, isLoading, onSubmit }: LoginViewProps) => {
  return (
    <main className={styles.pageContainer}>
      <section className={styles.card}>
        {/* 1. Encabezado */}
        <header className={styles.header}>
          <div className={styles.logoWrapper}>
            <Wallet className={styles.logoIcon} />
          </div>
          <h1 className={styles.title}>Finanzas App</h1>
        </header>

        {/* 2. Formulario */}
        <form onSubmit={onSubmit} className={styles.form}>
          {/* Campo: Email */}
          <div className={styles.fieldGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <div className={styles.inputWrapper}>
              <Mail className={styles.inputIcon} />
              <input
                id="email"
                type="email"
                placeholder="admin@gmail.com"
                className={styles.inputField}
                {...register('email', {
                  required: 'El correo electrónico es requerido',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Ingresa un correo válido',
                  },
                })}
              />
            </div>
            {errors.email && <span className={styles.errorMessage}>{errors.email.message}</span>}
          </div>

          {/* Campo: Contraseña */}
          <div className={styles.fieldGroup}>
            <label htmlFor="password" className={styles.label}>
              Contraseña
            </label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className={styles.inputField}
                {...register('password', { required: 'La contraseña es requerida' })}
              />
            </div>
            {errors.password && <span className={styles.errorMessage}>{errors.password.message}</span>}
          </div>

          {/* Botón Submit */}
          <button type="submit" disabled={isLoading} className={styles.submitBtn}>
            {isLoading ? (
              <Loader2 className={styles.spinner} />
            ) : (
              <>
                Ingresar <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        {/* 3. Footer: Enlace a Registro */}
        <div className={styles.footer}>
          <p className={styles.footerText}>
            ¿No tienes una cuenta?
            <Link to="/register" className={styles.registerLink}>
              Regístrate aquí
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};
