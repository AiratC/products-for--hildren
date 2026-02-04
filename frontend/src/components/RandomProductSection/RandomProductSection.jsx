import React, { useEffect, useRef, useState } from 'react'
import styles from './RandomProductSection.module.css'
import fetchAxios from '../../utils/fetchAxios';
import Loader from '../Loader/Loader';
import ProductCard from '../ProductCard/ProductCard';

const RandomProductSection = () => {
   const [products, setProducts] = useState([]);
   const [loading, setLoading] = useState(true);
   const scrollRef = useRef(null);
   const [activeIndex, setActiveIndex] = useState(0);


   useEffect(() => {
      const fetchRandomProducts = async () => {
         try {
            setLoading(true);
            const response = await fetchAxios.get(`/api/products/get-two-random-products`);
            if (response.data.success && response.data.products) {
               setProducts(response.data.products)
            }
         } catch (error) {
            console.error('Ошибка при загрузке случайныз товаров: ', error);
         } finally {
            setLoading(false)
         }
      };

      fetchRandomProducts();
   }, []);

   // Следим за скроллом чтобы переключать точки
   const handleScroll = () => {
      if(scrollRef.current) {
         const width = scrollRef.current.offsetWidth;
         const index = Math.round(scrollRef.current.scrollLeft / width);
         setActiveIndex(index);
      }
   }

   if (!loading && products.length === 0) return null;

   return (
      <>
         <section className={styles.randomSection}>
            <div className={`container`}>
               {
                  loading ? (
                     <div style={{
                        marginTop: '20px',
                        minHeight: '300px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                     }} className={`preloader`}>
                        <Loader />
                     </div>
                  ) : products.length > 0 ? (
                     <div className={styles.wrapper}>
                        <div
                           className={styles.scrollContainer}
                           ref={scrollRef}
                           onScroll={handleScroll}
                        >
                           {
                              products.map((product) => (
                                 <div key={product.product_id} className={styles.cardItem}>
                                    <ProductCard data={product}/>
                                 </div>
                              ))
                           }
                        </div>

                        {/* Точки: показываем только на мобилках */}
                        <div className={styles.dots}>
                           {
                              products.map((_, index) => (
                                 <span 
                                    key={index}
                                    className={`${styles.dot} ${activeIndex === index ? styles.active : ''}`}
                                 />
                              ))
                           }
                        </div>
                     </div>
                  ) : null
               }

            </div>
         </section >
      </>
   )
}

export default RandomProductSection
