import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { RecordDetailView } from './view/DetailView/RecordsDetailView';
import { getTransactionById } from '../../services/records.service';
import { getCategories, getPaymentMethods } from '../../services/catalogs.service';
import type { TransactionDetail } from '../../types/records.types';
import type { Catalog } from '../../types/catalogs.types';

export const RecordDetailPage = () => {
  const { id } = useParams();

  const [data, setData] = useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Estados para los catálogos usando la interfaz Catalog
  const [categories, setCategories] = useState<Catalog[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<Catalog[]>([]);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!id) return;
      try {
        // Ejecutamos las 3 peticiones en paralelo
        const [detailData, catsData, payMethodsData] = await Promise.all([
          getTransactionById(Number(id)),
          getCategories(),
          getPaymentMethods(),
        ]);

        setData(detailData);
        setCategories(catsData);
        setPaymentMethods(payMethodsData);
      } catch (error) {
        console.error(error);
        toast.error('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id]);

  return (
    <RecordDetailView data={data} loading={loading} categoriesList={categories} paymentMethodsList={paymentMethods} />
  );
};
