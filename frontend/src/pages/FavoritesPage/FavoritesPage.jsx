import React from 'react';
import styles from './FavoritesPage.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { fetchFavorites, fetchFullFavorites } from '../../redux/slices/favoriteSlice';
import Loader from '../../components/Loader/Loader';
import ProductCard from '../../components/ProductCard/ProductCard';
import { Button, Empty } from 'antd';
import { fetchCart } from '../../redux/slices/cartSlice';

const FavoritesPage = () => {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { fullItems, isFetching } = useSelector((state) => state.favorites);

   useEffect(() => {
      dispatch(fetchFullFavorites());
      dispatch(fetchFavorites());
      dispatch(fetchCart());
   }, [dispatch]);

   if (isFetching) {
      return (
         <div className={styles.favoriteLoader}>
            <Loader />
         </div>
      )
   }

   return (
      <section className={styles.favoriteSection}>
         <div className={`container`}>
            <h1 className={styles.pageTitle}>Мое избранное</h1>

            {fullItems?.length > 0 ? (
               <div className={styles.grid}>
                  {fullItems.map(product => (
                     <ProductCard key={product.product_id} data={product} />
                  ))}
               </div>
            ) : (
               <div className={styles.emptyState}>
                  <Empty
                     description="В избранном пока ничего нет"
                     image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                  <Button type="primary" onClick={() => navigate('/')}>
                     Перейти к покупкам
                  </Button>
               </div>
            )}
         </div>
      </section>
   )
}

export default FavoritesPage
