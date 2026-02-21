import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './StockDetails.module.css';
import Loader from '../../components/Loader/Loader';
import { ChevronLeft } from 'lucide-react';
import fetchAxios from '../../utils/fetchAxios';
import toast from 'react-hot-toast';

const StockDetails = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const [stock, setStock] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchFullStock = async () => {
         try {
            setLoading(true);
            const { data } = await fetchAxios.get(`/api/stock/get-stock-by-id/${id}`);
            setStock(data.stock);
         } catch (err) {
            toast.error(err.response.data.message)
         } finally {
            setLoading(false);
         }
      };

      window.scrollTo(0, 0);
      fetchFullStock();
   }, [id]);

   if (loading) return <div className={styles.center}><Loader /></div>;
   if (!stock) return <div className={styles.center}>Акция не найдена</div>;

   return (
      <div className={styles.container}>
         <button onClick={() => navigate(-1)} className={styles.backBtn}>
            <ChevronLeft size={20} /> Назад
         </button>

         {/* Баннер акции */}
         <div className={styles.mainImage}>
            <img
               src={stock.stock_images?.[0]?.url || '/default-stock.jpg'}
               alt={stock.title}
            />
         </div>

         <header className={styles.header}>
            <h1 className={styles.title}>{stock.title}</h1>
            <span className={styles.date}>
               Опубликовано: {new Date(stock.created_at).toLocaleDateString()}
            </span>
         </header>

         <div className={styles.content}>
            {/* Рендерим описание с сохранением переносов строк */}
            <div className={styles.descriptionText}>
               {stock.description}
            </div>
         </div>
      </div>
   );
};

export default StockDetails;