import type { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  amount: string;
  icon: LucideIcon;
  color: 'green' | 'red' | 'blue';
  loading?: boolean; // 🆕 Nueva prop opcional
}

export const KpiCard = ({ title, amount, icon: Icon, color, loading }: KpiCardProps) => {
  const colorStyles = {
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    red: { bg: 'bg-red-100', text: 'text-red-600' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
  };

  const currentStyle = colorStyles[color];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div className="w-full">
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>

        {/* LOGICA DE CARGA: Si carga, muestra barra gris. Si no, muestra el número */}
        {loading ? (
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mt-1"></div>
        ) : (
          <h3 className={`text-2xl font-bold ${currentStyle.text}`}>{amount}</h3>
        )}
      </div>

      <div className={`p-3 rounded-lg ${currentStyle.bg}`}>
        <Icon className={`w-6 h-6 ${currentStyle.text}`} />
      </div>
    </div>
  );
};
