import { FileDiff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './RecordsHeader.module.scss';

export const RecordsHeader = () => {
  const navigate = useNavigate();

  const handleCreate = () => {
    // Enviamos state: { type: 1 } (Ingreso) por defecto
    navigate('/records/create', { state: { type: 1 } });
  };

  return (
    <header className={styles.header}>
      {/* 1. TEXTOS */}
      <div className={styles.textSection}>
        <h1 className={styles.title}>Registro de Consumo</h1>
        <p className={styles.subtitle}>Gestiona tus ingresos y gastos detalladamente.</p>
      </div>

      {/* 2. BOTONES DE ACCIÓN */}
      <div className={styles.actionsWrapper}>
        <button onClick={handleCreate} className={styles.createBtn} aria-label="Crear nuevo registro">
          <FileDiff size={18} />
          <span>Nuevo Registro</span>
        </button>
      </div>
    </header>
  );
};
