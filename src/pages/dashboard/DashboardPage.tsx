import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getDashboardMetrics } from '../../services/dashboard.service';
import type { DashboardResponse } from '../../types/dashboard.types';
import { DashboardView } from './DashboardView';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return <DashboardView user={user} data={data} loading={loading} error={error} />;
};
