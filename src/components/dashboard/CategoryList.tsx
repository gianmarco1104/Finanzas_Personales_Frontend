import type { ChartData } from '../../types/dashboard.types';
import { CHART_COLORS } from './ExpenseChart'; // Asegúrate que esta importación sea correcta según tu estructura

// 1. AQUÍ ESTÁ LA SOLUCIÓN: Agregamos loading?: boolean a la interfaz
interface CategoryListProps {
  data: ChartData[];
  loading?: boolean;
}

export const CategoryList = ({ data, loading }: CategoryListProps) => {
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <h3 className="font-bold text-gray-700 mb-6">Detalle por Categoría</h3>

      <div className="space-y-4">
        {/* 2. LÓGICA VISUAL: Si loading es true, mostramos esqueleto. Si no, mostramos datos */}
        {loading
          ? // SKELETON LOADING (Barras grises parpadeando)
            [...Array(4)].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gray-200 rounded-full" />
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                  <div className="h-3 w-10 bg-gray-200 rounded" />
                </div>
              </div>
            ))
          : // DATOS REALES
            data.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                  <span className="text-gray-600 font-medium">{item.category}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{formatMoney(item.total)}</p>
                  <p className="text-xs text-gray-400">{item.percentage}%</p>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};
