import { TrendingUp, TrendingDown, Wallet, Calendar, AlertCircle } from 'lucide-react';

import { MainLayout } from '../../components/layout/MainLayout';
import { KPICard } from './components/KPICard/KpiCard';
import { ExpenseChart } from './components/ExpenseChart/ExpenseChart';
import { CategoryList } from './components/CategoryList/CategoryList';

import type { DashboardResponse } from '../../types/dashboard.types';
import type { AuthResponse } from '../../types/auth.types';
import { formatMoney } from '../../utils/format.utils';
import styles from './DashboardView.module.scss';

// Constante fuera del componente
const MONTHS = [
  '',
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

interface DashboardViewProps {
  user: AuthResponse | null;
  data: DashboardResponse | null;
  loading: boolean;
  error: string | null;
}

export const DashboardView = ({ user, data, loading, error }: DashboardViewProps) => {
  const currentPeriod = data ? `${MONTHS[data.period.month]} ${data.period.year}` : '--';

  return (
    <MainLayout>
      {/* 1. ENCABEZADO */}
      <header className={styles.header}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.pageTitle}>Dashboard General</h1>
          <p className={styles.userName}>Hola, {user?.fullName}</p>
        </div>

        {/* Tarjeta de Periodo */}
        <div className={styles.periodCard}>
          <div className={styles.iconWrapper}>
            <Calendar size={20} />
          </div>
          <div className={styles.periodTextGroup}>
            <span className={styles.periodLabel}>Periodo Actual</span>
            {loading ? (
              <div className={styles.periodSkeleton} />
            ) : (
              <span className={styles.periodValue}>{currentPeriod}</span>
            )}
          </div>
        </div>
      </header>

      {/* 2. MANEJO DE ERRORES */}
      {error ? (
        <div role="alert" className={styles.errorAlert}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      ) : (
        <>
          {/* 3. SECCIÓN DE KPIs */}
          <section aria-label="Indicadores Financieros" className={styles.kpiSection}>
            <KPICard
              title="Ingresos Totales"
              amount={data ? formatMoney(data.kpis.total_income) : ''}
              icon={TrendingUp}
              color="green"
              loading={loading}
            />
            <KPICard
              title="Gastos Totales"
              amount={data ? formatMoney(data.kpis.total_expense) : ''}
              icon={TrendingDown}
              color="red"
              loading={loading}
            />
            <KPICard
              title="Balance Actual"
              amount={data ? formatMoney(data.kpis.balance) : ''}
              icon={Wallet}
              color="indigo"
              loading={loading}
            />
          </section>

          {/* 4. SECCIÓN DE GRÁFICOS Y LISTAS */}
          <section aria-label="Análisis de Gastos" className={styles.chartsSection}>
            <ExpenseChart data={data ? data.chart_data : []} loading={loading} />
            <CategoryList data={data ? data.chart_data : []} loading={loading} />
          </section>
        </>
      )}
    </MainLayout>
  );
};
