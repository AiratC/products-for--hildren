import React, { useEffect, useState } from 'react'
import styles from './Catalog.module.css'
import closeCatalogIcon from './../../assets/svg/closeCatalogIcon.svg'
import fetchAxios from '../../utils/fetchAxios';
import Loader from '../Loader/Loader';
import { Link } from 'react-router';


const Catalog = ({ onClose }) => {
   const [catalogs, setCatalogs] = useState([]);
   const [categories, setCategories] = useState(null);
   const [loadingCatalog, setLoadingCatalog] = useState(true);
   const [loadingCategories, setLoadingCategories] = useState(true);

   // Получаем все данные каталога
   useEffect(() => {
      const fetchGetAllCatalog = async () => {
         try {
            const response = await fetchAxios.get(`/api/catalog/get-all-catalog`);
            setCatalogs(response.data.catalog)
         } catch (error) {
            console.log(error)
         } finally {
            setLoadingCatalog(false)
         }
      };
      fetchGetAllCatalog()
   }, [])

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

               {/* Каталог для десктопной версии */}
               <div className={`${styles.catalogDesktop} ${styles.catalogList}`}>
                  {
                     loadingCatalog ? (
                        <div className={`preloader`}>
                           <Loader />
                        </div>
                     ) : (
                        catalogs.map((catalogItem) => (
                           <div key={catalogItem.catalog_id} className={styles.catalogItamContainer}>
                              {catalogItem.name}
                           </div>
                        ))
                     )
                  }
               </div>

               {/* Каталог для мобильной версии */}
               <div className={`${styles.catalogMobile} ${styles.catalogList}`}>
                  {
                     loadingCatalog ? (
                        <div className={`preloader`}>
                           <Loader />
                        </div>
                     ) : (
                        catalogs.map((catalogItem) => (
                           <Link to={`/catalog/${catalogItem.slug}`} key={catalogItem.catalog_id} className={styles.catalogItamContainer}>
                              {catalogItem.name}
                           </Link>
                        ))
                     )
                  }
               </div>

               {/* Правая часть с подкатегориями только для десктопа */}
               <div className={styles.subCategories}>
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
