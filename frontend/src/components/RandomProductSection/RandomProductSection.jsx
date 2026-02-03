import React, { useEffect, useState } from 'react'
import styles from './RandomProductSection.module.css'
import fetchAxios from '../../utils/fetchAxios';
import Loader from '../Loader/Loader';
import ProductCard from '../ProductCard/ProductCard';

const RandomProductSection = () => {
   const [products, setProducts] = useState([]);
   const [loading, setLoading] = useState(true);

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

   if(!loading && products.length === 0) return null;

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
                     <>
                        <div className={styles.grid}>
                           {
                              products.map((product) => (
                                 <div key={product.product_id} className={styles.cardWrapper}>
                                    <ProductCard data={product} />
                                 </div>
                              ))
                           }
                        </div>

                        {/* Мобильные точки (индикация, что товара два) */}
                        <div className={styles.mobileDots}>
                           <span className={styles.activeDot}></span>
                           <span></span>
                        </div>
                     </>
                  ) : null
               }

            </div>
         </section>
      </>
   )
}

export default RandomProductSection
