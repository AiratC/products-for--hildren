import React, { useEffect } from 'react'
import styles from './Catalog.module.css'
import closeCatalogIcon from './../../assets/svg/closeCatalogIcon.svg'


const categories = [
   "Акции", "Детская мебель", "Коляски", "Автокресла",
   "Одежда", "Кормление", "Гигиена и уход", "Умные игрушки"
]

const Catalog = ({ onClose }) => {

   useEffect(() => {
      document.body.style.overflow = 'hidden';

      return () => document.body.style.overflow = 'auto';
   }, [])

   return (
      <>
         {/* Затемняющая подложка */}
         <div className={styles.overlay} onClick={onClose}></div>

         <div className={styles.catalogOverlay}>
            <div className={styles.catalogContent}>
               {/* Кнопка закрытия для мобилок */}
               <button className={styles.closeBtn} onClick={onClose} aria-label='Закрыть каталог'>
                  <img src={closeCatalogIcon} alt="close" />
               </button>

               <div className={styles.categoriesList}>
                  {categories.map((category, index) => (
                     <div key={index} className={styles.categoryItem}>
                        {category}
                     </div>
                  ))}
               </div>

               {/* Правая часть с подкатегориями только для десктопа */}
               <div className={styles.subCategories}>
                  <h3>Детская мебель</h3>
                  <ul>
                     <li>Кроватки</li>
                     <li>Колыбели</li>
                     <li>Люльки</li>
                  </ul>
               </div>
            </div>
         </div>
      </>

   )
}

export default Catalog
