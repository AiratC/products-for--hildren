import React, { memo, useCallback, useRef } from 'react'
import styles from './Carousel.module.css'
import ProductCard from '../ProductCard/ProductCard';

const Carousel = memo(({ products, titleSectionName }) => {
   const scrollRef = useRef(null);

   const scroll = useCallback((direction) => {
      if (scrollRef.current) {
         const { scrollLeft, clientWidth } = scrollRef.current;
         // Прокручиваем на ширину видимой области (один экран карточек)
         const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;

         scrollRef.current.scrollTo({
            left: scrollTo,
            behavior: 'smooth'
         });
      }
   }, []) 

   const isCarousel = products.length > 4;
   // Проверка для мобилок чтобы класс snap был всегда
   const isMobile = window.innerWidth <= 768;


   return (
      <section className={styles.section}>
         <div className={`container`}>
            <h2 className={styles.title}>{titleSectionName}</h2>

            <div className={styles.carouselContainer}>
               <div
                  className={`${styles.track} ${(isCarousel || isMobile) ? styles.snap : styles.static}`}
                  ref={scrollRef}
               >
                  {
                     products.map((product) => (
                        <div key={product.product_id} className={styles.cardItem}>
                           <ProductCard data={product} />
                        </div>
                     ))
                  }
               </div>

               {
                  isCarousel && (
                     <div className={styles.navigation}>
                        <button className={styles.arrow} onClick={() => scroll('left')}>
                           <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                        <button className={styles.arrow} onClick={() => scroll('right')}>
                           <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                     </div>
                  )
               }
            </div>
         </div>
      </section>
   )
})

export default Carousel
