import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { ChartData } from '../../../../types/dashboard.types';
import { Loader2 } from 'lucide-react';
import styles from './ExpenseChart.module.scss';
import { formatMoney } from '../../../../utils/format.utils';

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
  return (
    <section aria-labelledby="chart-title" className={styles.container}>
      <h3 id="chart-title" className={styles.title}>
        Distribución de Gastos del Mes
      </h3>

      {loading ? (
        <div role="status" className={styles.loadingState}>
          <Loader2 className={styles.spinner} aria-hidden="true" />
          <span className={styles.loadingText}>Cargando gráfico...</span>
        </div>
      ) : (
        <figure className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data as any}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="total"
                nameKey="category"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="none" />
                ))}
              </Pie>

              <Tooltip
                formatter={(value: any) => [formatMoney(value), 'Total']}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />

              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </figure>
      )}
    </section>
  );
};
