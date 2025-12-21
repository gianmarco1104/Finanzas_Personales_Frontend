import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { ChartData } from '../../types/dashboard.types';
import { Loader2 } from 'lucide-react';

export const CHART_COLORS = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#EC4899',
  '#06B6D4',
  '#84CC16',
  '#F97316',
  '#6366F1',
  '#14B8A6',
  '#D946EF',
  '#64748B',
  '#A855F7',
  '#EAB308',
];

interface ExpenseChartProps {
  data: ChartData[];
  loading?: boolean;
}

export const ExpenseChart = ({ data, loading }: ExpenseChartProps) => {
  const formatMoney = (value: number | string | undefined | null) => {
    if (typeof value !== 'number') return 'S/ 0.00';
    return `S/ ${value}`;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full min-h-[400px]">
      <h3 className="font-bold text-gray-700 mb-4">Distribución de Gastos</h3>

      {loading ? (
        <div className="h-[300px] w-full flex flex-col items-center justify-center text-gray-400 gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="text-sm">Cargando gráfico...</span>
        </div>
      ) : (
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data as any} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="total" nameKey="category">
                {/* 2. SOLUCIÓN: Iteramos y creamos una Celda (Cell) con color para cada dato */}
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatMoney(value as number)} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
