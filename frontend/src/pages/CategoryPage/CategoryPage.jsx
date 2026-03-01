import React, { useEffect, useState } from 'react';
import styles from './CategoryPage.module.css';
import { ChevronRight, Heart, ShoppingCart } from 'lucide-react';
import { useParams } from 'react-router';
import fetchAxios from '../../utils/fetchAxios';
import ProductCard from '../../components/ProductCard/ProductCard';
import getPaginationRange from '../../utils/paginationRange';
import Loader from '../../components/Loader/Loader';

const CategoryPage = () => {
   const { slug } = useParams();
   const [catalogName, setCatalogName] = useState('');
   const [currentPage, setCurrentPage] = useState(1);
   const [products, setProducts] = useState([]);
   const [categories, setCategories] = useState([]);
   const [category_id, setCatgoryId] = useState(null);
   const [totalPages, setTotalPages] = useState(1);
   const [loading, setLoading] = useState(false);

   // Единый метод загрузки данных
   // eslint-disable-next-line react-hooks/exhaustive-deps
   const loadData = async () => {
      try {
         setLoading(true);
         setProducts([]);
         const { data } = await fetchAxios.get(`/api/categories/get-category-page-data/${slug}`, {
            params: { 
               category_id: category_id, 
               page: currentPage 
            }
         });
         
         setCatalogName(data.catalog_name);
         setProducts(data.products);
         setCategories(data.side_categories);
         setTotalPages(data.totalPages);
         // Важно: не вызывай setCurrentPage здесь, если данные пришли для той же страницы
      } catch (error) {
         console.error("Ошибка загрузки:", error);
      } finally {
         setLoading(false)
      }
   };

   // Эффект следит за всеми изменениями фильтров и страницы
   useEffect(() => {
      loadData();
   }, [slug, category_id, currentPage]);

   // При клике на категорию сбрасываем страницу на первую
   const handleCategoryChange = (id) => {
      setCatgoryId(id);
      setCurrentPage(1);
   };

   // При клике на пагинацию просто меняем номер страницы
   const handlePageChange = (page) => {
      if (typeof page === 'number' && page !== currentPage) {
         setCurrentPage(page);
         window.scrollTo(0, 0); // Хороший тон: скролл вверх при смене страницы
      }
   };

   const range = getPaginationRange(currentPage, totalPages);

   return (
      <div className={styles.container}>
         <h1 className={styles.title}>{catalogName || 'Загрузка...'}</h1>

         <div className={styles.mainContent}>
            {/* Сайдбар всегда на месте, чтобы пользователь мог переключить категорию даже во время загрузки */}
            <aside className={styles.sidebar}>
               <ul className={styles.categoryList}>
                  <li 
                     className={`${styles.categoryItem} ${category_id === null ? styles.active : ''}`}
                     onClick={() => handleCategoryChange(null)}
                  >
                     Все товары
                  </li>
                  {categories.map((cat) => (
                     <li key={cat.id} 
                        className={`${styles.categoryItem} ${category_id === cat.id ? styles.active : ''}`}
                        onClick={() => handleCategoryChange(cat.id)}
                     >
                        {cat.name}
                     </li>
                  ))}
               </ul>
            </aside>

            <section className={styles.productsSection}>
               <div className={styles.topBar}>
                  <span className={styles.sortLabel}>Сортировать по: <b>популярности</b> ↕</span>
               </div>

               {/* Лоадер только поверх сетки или вместо неё */}
               <div className={styles.gridContainer} style={{ position: 'relative', minHeight: '400px' }}>
                  {loading && (
                     <div className={styles.gridLoader}>
                        <Loader />
                     </div>
                  )}

                  <div className={`${styles.grid} ${loading ? styles.loadingBlur : ''}`}>
                     {products.length > 0 ? (
                        products.map((product) => (
                           <ProductCard key={product.product_id} data={product} />
                        ))
                     ) : (
                        // Показываем "не найдено" только если загрузка ЗАКОНЧИЛАСЬ и товаров реально 0
                        !loading && <p className={styles.emptyText}>Товары не найдены</p>
                     )}
                  </div>
               </div>

               {/* Пагинация */}
               {!loading && totalPages > 1 && (
                  <div className={styles.pagination}>
                     {range.map((page, index) => (
                        <button
                           key={index}
                           className={`${styles.pageBtn} ${currentPage === page ? styles.active : ''}`}
                           onClick={() => handlePageChange(page)}
                           disabled={page === '...'}
                        >
                           {page}
                        </button>
                     ))}
                     {currentPage < totalPages && (
                        <button className={styles.nextBtn} onClick={() => handlePageChange(currentPage + 1)}>
                           Дальше <ChevronRight size={18} />
                        </button>
                     )}
                  </div>
               )}
            </section>
         </div>
      </div>
   );
};

export default CategoryPage;