import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import styles from './FilterPage.module.css'
import fetchAxios from '../../utils/fetchAxios';
import { Pagination, Checkbox, Drawer, Button } from "antd";
import FilterList from '../../components/FilterList/FilterList';
import ProductCard from '../../components/ProductCard/ProductCard';
import mobileFilterBtn from './../../assets/svg/mobile-filter-btn.svg'
import notProduct from './../../assets/webp/not-product.webp'
import Loader from '../../components/Loader/Loader';

const FilterPage = () => {
   const { slug } = useParams();
   const [searchParams, setSearchParams] = useSearchParams();
   const [products, setProducts] = useState([]);
   const [total, setTotal] = useState(null)
   const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
   const [filterConfig, setFilterConfig] = useState([]);
   const [loading, setLoading] = useState(true);

   // Формируем объект из параметров URL
   const selectedFilters = useMemo(() => {
      return {
         minPrice: searchParams.get('minPrice') || null,
         maxPrice: searchParams.get('maxPrice') || null,
         // Для массивов (checkbox_group) извлекаем строку и превращаем в массив
         brand: searchParams.get('brand')?.split(',') || [],
         type: searchParams.get('type')?.split(',') || [],
         color: searchParams.get('color')?.split(',') || [],
         gender_of_child: searchParams.get('gender_of_child')?.split(',') || [],
         // Для одиночных значений (radio/select)
         delivery_times: searchParams.get('delivery_times') || 'Неважно',
         material: searchParams.get('material') || undefined,
      };
   }, [searchParams])

   useEffect(() => {
      const fetchGetProducts = async () => {
         try {
            setLoading(true)
            const response = await fetchAxios.get(`/api/products/get-products-by-filters`, {
               params: {
                  slug,
                  ...Object.fromEntries(searchParams.entries())
               }
            });
            setProducts(response.data.products);
            setTotal(response.data.total);
            setFilterConfig(response.data.filterConfig || [])
         } catch (error) {
            console.log(error)
         } finally {
            setLoading(false)
         }
      };

      fetchGetProducts()

   }, [slug, searchParams]);

   // Поднимаем страницу вверх при переключении страницы пагинации
   useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
   }, [searchParams.get('page')])

   const handleFilterChange = useCallback((name, value, checked) => {
      const current = new URLSearchParams(searchParams);


      // Если это поля цены
      if (name === 'minPrice' || name === 'maxPrice') {
         if (value !== null && value !== undefined) {
            current.set(name, value);
         } else {
            current.delete(name);
         }
      }
      // 2. Обработка радиокнопок и селектов (одиночные значения)
      else if (checked === undefined) {
         if (value && value !== 'Неважно') {
            current.set(name, value);
         } else {
            current.delete(name); // Удаляем, если выбрано "Неважно"
         }
      }
      // Если это чекбоксы
      else {
         const existing = current.get(name)?.split(',') || [];
         let updated;
         if (checked) {
            updated = [...existing, value];
         } else {
            // eslint-disable-next-line no-unused-vars
            updated = existing.filter(v => v !== value);
         };

         if (updated.length) current.set(name, updated.join(','));
         else current.delete(name);
      }

      current.set('page', '1');
      setSearchParams(current)

   }, [searchParams, setSearchParams]);

   return (
      <div className={`container`}>
         <div className={styles.mobileFilterButton}>
            {/* Кнопка для мобилок */}
            <Button className={styles.mobileBtn} onClick={() => setIsMobileFiltersOpen(true)}>
               <img src={mobileFilterBtn} alt="mobile-filter-button" />
            </Button>
         </div>


         <div className={styles.filterPage}>
            <aside className={styles.desktopSidebar}>
               <FilterList config={filterConfig} selectedFilters={selectedFilters} onFilterChange={handleFilterChange} />
            </aside>

            {
               loading && (
                  <div className={`${styles.preloader}`}>
                     <Loader />
                  </div>
               )
            }

            {
               !loading && products.length > 0 ? (
                  <main>
                     <div className={styles.productGrid}>
                        {products.map(item => <ProductCard key={item.product_id} data={item} />)}
                     </div>
                     <Pagination
                        current={Number(searchParams.get('page')) || 1}
                        total={total}
                        pageSize={3}
                        onChange={p => {
                           const current = new URLSearchParams(searchParams)
                           current.set('page', p);
                           setSearchParams(current);
                        }}
                        style={{ marginTop: '20px' }}
                     />
                  </main>
               ) : !loading ? (
                  <div className={styles.containerNotImg}>
                     <img src={notProduct} alt="not-product" />
                  </div>
               ) : ''
            }

         </div>


         {/* Мобильные фильтры (выезжают как на макете) */}
         <Drawer open={isMobileFiltersOpen} onClose={() => setIsMobileFiltersOpen(false)} size={'large'}>
            <FilterList
               config={filterConfig}
               selectedFilters={selectedFilters}
               onFilterChange={handleFilterChange}
            />
            <Button
               type='primary'
               block
               onClick={() => setIsMobileFiltersOpen(false)}
            >Показать товары
            </Button>
         </Drawer>
      </div>
   );
}

export default FilterPage
