import React, { useEffect, useRef, useState } from 'react'
import styles from './Catalog.module.css'
import closeCatalogIcon from './../../assets/svg/closeCatalogIcon.svg'
import fetchAxios from '../../utils/fetchAxios';
import Loader from '../Loader/Loader';
import { Link, useLocation } from 'react-router-dom';


const Catalog = ({ onClose }) => {
   const [catalogs, setCatalogs] = useState([]);
   const [categories, setCategories] = useState('Выберите категорию');
   const [loadingCatalog, setLoadingCatalog] = useState(true);
   const [loadingCategories, setLoadingCategories] = useState(true);
   const location = useLocation();
   // Запоминаем путь, который был в момент открытия каталога
   const openPathName = useRef(location.pathname);

   // Как только URL изменился (начался переход), закрываем каталог
   useEffect(() => {
      if(openPathName.current !== location.pathname) {
         onClose();
      }
   }, [location.pathname, onClose])

   // Получаем все данные каталога
   useEffect(() => {
      const fetchGetAllCatalog = async () => {
         try {
            setLoadingCatalog(true)
            const response = await fetchAxios.get(`/api/catalog/get-all-catalog`);
            setCatalogs(response.data.catalog)
         } catch (error) {
            console.log(error)
         } finally {
            setLoadingCatalog(false)
            setLoadingCategories(false)
         }
      };
      fetchGetAllCatalog()
   }, [])

   const handleClickCatalogItem = async (catalogId) => {

      try {
         setLoadingCatalog(true)
         setLoadingCategories(true)
         const result = await fetchAxios.post(`/api/categories/get-categories-by-catalog-id`, { catalogId });
         if (result.data.success) {
            setCategories(result.data.categories)
         } else {
            setCategories(result.data.message)
         }
      } catch (error) {
         console.log(error)
      } finally {
         setLoadingCatalog(false)
         setLoadingCategories(false)
      }
   }

   useEffect(() => {
      document.body.style.overflow = 'hidden';

      return () => {
         document.body.style.overflow = 'auto';
         setCategories('Выберите категорию')
      }
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
                           <div onClick={() => handleClickCatalogItem(catalogItem.catalog_id)} key={catalogItem.catalog_id} className={styles.catalogItamContainer}>
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
                  {
                     loadingCategories ? (
                        <div className={`preloader`}>
                           <Loader />
                        </div>
                     ) : (
                        <ul>
                           {
                              Array.isArray(categories) ? (
                                 categories.map((category) => (
                                    <Link
                                       to={`/categories/filter/${category.slug}`}
                                       key={category.category_id}>
                                       <li>{category.name}</li>
                                    </Link>
                                 ))
                              ) : (
                                 <span>{categories}</span>
                              )
                           }
                        </ul>
                     )
                  }
               </div>
            </div>
         </div>
      </>

   )
}

export default Catalog
