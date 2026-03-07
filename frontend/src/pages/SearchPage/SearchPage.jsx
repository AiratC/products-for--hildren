import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import fetchAxios from '../../utils/fetchAxios';
import ProductCard from '../../components/ProductCard/ProductCard';
import Loader from '../../components/Loader/Loader';
import styles from './SearchPage.module.css';

const SearchPage = () => {
   const [searchParams] = useSearchParams();
   const queryText = searchParams.get('text'); // Получаем текст из URL
   const [results, setResults] = useState([]);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      const fetchSearchResults = async () => {
         if (!queryText) return;
         try {
            setLoading(true);
            const { data } = await fetchAxios.get(`/api/products/search?query=${queryText}`);
            setResults(data.results);
         } catch (error) {
            console.error("Ошибка поиска:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchSearchResults();
   }, [queryText]);

   if (loading) return <div className="preloader"><Loader /></div>;

   return (
      <div className={styles.searchContainer}>
         <h1 className={styles.title}>
            Результаты поиска по запросу: «{queryText}»
         </h1>
         <p className={styles.count}>Найдено товаров: {results.length}</p>

         {results.length > 0 ? (
            <div className={styles.productGrid}>
               {results.map(product => (
                  <ProductCard key={product.product_id} data={product} />
               ))}
            </div>
         ) : (
            <div className={styles.noResults}>
               <h3>Ничего не найдено</h3>
               <p>Попробуйте изменить запрос или поискать в каталоге</p>
            </div>
         )}
      </div>
   );
};

export default SearchPage;
