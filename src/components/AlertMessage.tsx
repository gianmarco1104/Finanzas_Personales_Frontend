import { CheckCircle, XCircle } from 'lucide-react';

interface AlertMessageProps {
  type: 'success' | 'error';
  message?: string | null; // Puede ser null si no hay mensaje activo
}

export const AlertMessage = ({ type, message }: AlertMessageProps) => {
  // Si no hay mensaje, no mostramos nada (return null)
  if (!message) return null;

  const isError = type === 'error';

  return (
    <div
      className={`
        flex items-center gap-3 p-4 rounded-lg text-sm font-medium border mb-6
        animate-in fade-in slide-in-from-top-2 duration-300
        ${isError ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}
      `}
    >
      {isError ? <XCircle className="w-5 h-5 shrink-0" /> : <CheckCircle className="w-5 h-5 shrink-0" />}

      <span>{message}</span>
    </div>
  );
};
