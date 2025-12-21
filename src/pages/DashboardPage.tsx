import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MainLayout } from '../components/MainLayout';
import { getDashboardMetrics } from '../services/dashboard.service';
import type { DashboardResponse } from '../types/dashboard.types';
import { TrendingUp, TrendingDown, Wallet, Calendar, AlertCircle } from 'lucide-react';
import { KpiCard } from '../components/dashboard/KpiCard';
import { ExpenseChart } from '../components/dashboard/ExpenseChart';
import { CategoryList } from '../components/dashboard/CategoryList';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const months = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboardMetrics();
        setData(response);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los datos.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <MainLayout>
      {/* HEADER: Siempre visible, incluso cargando */}
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard General</h1>
          <p className="text-gray-500">Hola, {user?.fullname}</p>
        </div>

        {/* El pill de fecha también puede tener un estado de carga simple */}
        <div className="flex items-center gap-3 bg-white px-5 py-2 rounded-full shadow-sm border border-gray-200">
          <div className="p-2 bg-blue-50 rounded-full">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase">Periodo Actual</p>
            {loading ? (
              <div className="h-4 w-20 bg-gray-200 animate-pulse rounded mt-1"></div>
            ) : (
              <p className="text-sm font-bold text-gray-700">{data ? `${months[data.period.month]} ${data.period.year}` : '--'}</p>
            )}
          </div>
        </div>
      </header>

      {error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
          <AlertCircle /> {error}
        </div>
      ) : (
        <>
          {/* 1. SECCIÓN KPIS */}
          {/* Pasamos 'loading' a cada tarjeta.
              Usamos el operador ternario 'data ? data.valor : 0' para evitar errores de null 
              mientras data no existe. */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <KpiCard
              title="Ingresos Totales"
              amount={data ? formatMoney(data.kpis.total_income) : ''}
              icon={TrendingUp}
              color="green"
              loading={loading}
            />
            <KpiCard
              title="Gastos Totales"
              amount={data ? formatMoney(data.kpis.total_expense) : ''}
              icon={TrendingDown}
              color="red"
              loading={loading}
            />
            <KpiCard title="Balance Actual" amount={data ? formatMoney(data.kpis.balance) : ''} icon={Wallet} color="blue" loading={loading} />
          </div>

          {/* 2. SECCIÓN GRÁFICOS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExpenseChart data={data ? data.chart_data : []} loading={loading} />
            <CategoryList data={data ? data.chart_data : []} loading={loading} />
          </div>
        </>
      )}
    </MainLayout>
  );
};
