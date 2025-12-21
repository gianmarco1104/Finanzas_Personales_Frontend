import { Loader2 } from "lucide-react";

export const LoadingSpinner = () => {
  return (
    /* Contenedor: Ocupa toda la altura de la pantalla (min-h-screen)
    y centra el contenido horizontal y verticalmente.*/
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-sm font-medium text-gray-500">Cargando sistema...</p>
      </div>
    </div>
  );
};
