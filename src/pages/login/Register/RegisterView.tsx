import { User, Mail, Phone, Lock, Wallet, ArrowRight, Loader2, Globe, Hash, Flag } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';

// Componentes UI
import { FormInput } from '../../../components/ui/InputData/InputData';
import { CustomDropdown } from '../../../components/ui/CustomDropdown/CustomDropdown';

// Tipos
import type { RegisterRequest } from '../../../types/register.types';
import type { Country, Catalog } from '../../../types/catalogs.types';

// Estilos
import styles from './RegisterView.module.scss';

interface RegisterViewProps {
  register: UseFormRegister<RegisterRequest>;
  errors: FieldErrors<RegisterRequest>;
  setValue: UseFormSetValue<RegisterRequest>;
  watch: UseFormWatch<RegisterRequest>;
  isLoading: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  countries: Country[];
  genders: Catalog[];
}

export const RegisterView = ({
  register,
  errors,
  setValue,
  watch,
  isLoading,
  onSubmit,
  countries,
  genders,
}: RegisterViewProps) => {
  // Lógica de Autorrelleno
  const selectedCountryId = watch('countryId');
  const selectedCountry = countries.find((c) => c.id === selectedCountryId);

  // Opciones para Dropdowns
  const countryOptions = countries.map((c) => ({ value: c.id, label: c.name }));
  const genderOptions = genders.map((g) => ({ value: g.id, label: g.name }));

  return (
    <main className={styles.pageContainer}>
      <section className={styles.card}>
        {/* HEADER */}
        <header className={styles.header}>
          <div className={styles.logoWrapper}>
            <Wallet className={styles.logoIcon} />
          </div>
          <h1 className={styles.title}>Crear Cuenta</h1>
          <p className={styles.subtitle}>Únete a Finanzas App hoy mismo.</p>
        </header>

        <form onSubmit={onSubmit} className={styles.form}>
          {/* Nombres */}
          <div className={styles.rowGrid}>
            <FormInput
              label="Nombre"
              icon={User}
              placeholder="Ej. Jesus"
              {...register('firstName', { required: 'El nombre es requerido' })}
              error={errors.firstName?.message}
            />

            {/* Apellido */}
            <FormInput
              label="Apellido"
              icon={User}
              placeholder="Ej. Carrasco"
              {...register('lastName', { required: 'El apellido es requerido' })}
              error={errors.lastName?.message}
            />
          </div>

          {/* FILA 2: Email */}

          <FormInput
            label="Correo Electrónico"
            icon={Mail}
            type="email"
            placeholder="jesus@gmail.com"
            {...register('email', {
              required: 'El email es requerido',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email inválido',
              },
            })}
            error={errors.email?.message}
          />

          {/* FILA 3: País e ISO */}
          <div className={styles.countryGroup}>
            {/* Dropdown País */}
            <div className="space-y-2">
              <label className={styles.label}>
                <Globe size={16} className="text-gray-400" /> País
              </label>
              <CustomDropdown
                value={selectedCountryId}
                onChange={(val) => setValue('countryId', Number(val), { shouldValidate: true })}
                options={countryOptions}
                placeholder="Selecciona país"
              />
              {errors.countryId && <span className={styles.errorText}>Selecciona un país</span>}
            </div>

            {/* ISO Code (Automático) */}
            <FormInput
              label="ISO"
              icon={Flag}
              value={selectedCountry?.isoCode || ''}
              readOnly
              className={styles.readOnlyInput}
              tabIndex={-1}
            />
          </div>

          {/* FILA 4: Teléfono */}
          <div className={styles.phoneGroup}>
            {/* Phone Code (Automático) */}
            <FormInput
              label="Cód."
              icon={Hash}
              value={selectedCountry?.phoneCode || ''}
              readOnly
              className={styles.readOnlyInput}
              tabIndex={-1}
            />

            {/* Input Teléfono */}

            <FormInput
              label="Teléfono"
              icon={Phone}
              type="tel"
              placeholder="999 999 999"
              {...register('phone', { required: 'El teléfono es requerido' })}
              error={errors.phone?.message}
            />
          </div>

          {/* FILA 5: Género y Password */}
          <div className={styles.rowGrid}>
            <div className="space-y-2">
              <label className={styles.label}>
                <User size={16} className="text-gray-400" /> Género
              </label>
              <CustomDropdown
                value={watch('genderId')}
                onChange={(val) => setValue('genderId', Number(val), { shouldValidate: true })}
                options={genderOptions}
                placeholder="Selecciona"
              />
              {errors.genderId && <span className={styles.errorText}>Selecciona género</span>}
            </div>

            <FormInput
              label="Contraseña"
              icon={Lock}
              type="password"
              placeholder="••••••••"
              {...register('password', {
                required: 'La contraseña es requerida',
                minLength: { value: 6, message: 'Mínimo 6 caracteres' },
              })}
              error={errors.password?.message}
            />
          </div>

          {/* BOTÓN SUBMIT */}
          <button type="submit" disabled={isLoading} className={styles.submitBtn}>
            {isLoading ? (
              <Loader2 className={styles.spinner} />
            ) : (
              <>
                Registrarme <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        {/* FOOTER */}
        <div className={styles.footer}>
          <p className="text-sm text-gray-500">
            ¿Ya tienes una cuenta?
            <Link to="/login" className={styles.loginLink}>
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};
