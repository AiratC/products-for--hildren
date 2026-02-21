import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStocks, setCurrentPage } from '../../redux/slices/stockSlice';
import styles from './StocksPage.module.css';
import getPaginationRange from '../../utils/paginationRange';
import Loader from '../../components/Loader/Loader';
import toast from 'react-hot-toast';

const StocksPage = () => {
   const dispatch = useDispatch();
   const { items, totalPages, currentPage, loading } = useSelector(state => state.stocks);
   const range = getPaginationRange(currentPage, totalPages);

   useEffect(() => {
      const fetchGetStocks = async () => {
         window.scrollTo({ top: 0, behavior: 'smooth' });
         try {
            await dispatch(fetchStocks(currentPage)).unwrap();
         } catch (error) {
            toast.error(error.message);
         }
      };

      fetchGetStocks()
   }, [dispatch, currentPage]);

   const handlePageChange = (page) => {
      if (typeof page === 'number' && page !== currentPage) {
         dispatch(setCurrentPage(page));
      }
   };

   return (
      <div className={styles.container}>
         <h1 className={styles.title}>Акции</h1>

         {loading ? (
            <div className={styles.loaderWrapper}><Loader /></div>
         ) : (
            <>
               <div className={styles.grid}>
                  {items.map((stock) => (
                     <div key={stock.stok_id} className={styles.card}>
                        <div className={styles.imageBox}>
                           <img src={stock.stock_images?.[0]?.url} alt={stock.title} />
                        </div>
                        <div>
                           <span className={styles.date}>
                              {new Date(stock.created_at).toLocaleDateString()}
                           </span>
                           <h3 className={styles.cardTitle}>{stock.title}</h3>
                        </div>
                     </div>
                  ))}
               </div>

               {/* Твоя крутая пагинация */}
               <div className={styles.pagination}>
                  {range.map((page, idx) => (
                     <button
                        key={idx}
                        className={`${styles.pageBtn} ${currentPage === page ? styles.active : ''} ${page === '...' ? styles.dots : ''}`}
                        onClick={() => handlePageChange(page)}
                        disabled={page === '...'}
                     >
                        {page}
                     </button>
                  ))}
                  {currentPage < totalPages && (
                     <button className={styles.nextBtn} onClick={() => handlePageChange(currentPage + 1)}>
                        Дальше ❯
                     </button>
                  )}
               </div>
            </>
         )}
      </div>
   );
};

export default StocksPage;