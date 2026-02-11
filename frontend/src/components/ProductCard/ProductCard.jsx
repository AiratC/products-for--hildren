import React from 'react';
import { Button } from 'antd';
import styles from './ProductCard.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavoriteAction } from '../../redux/slices/favoriteSlice';
import toast from 'react-hot-toast';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'; // Популярная библиотека иконок
import Loader from '../Loader/Loader';
import { useCallback } from 'react';

const ProductCard = ({ data }) => {
   const {
      title,
      price,
      old_price,
      product_images,
      is_new,
      characteristics,
      product_id
   } = data;

   const dispatch = useDispatch();
   const { loading, items } = useSelector((state) => state.favorites)

   // Проверяем загрузку именно ДЛЯ ЭТОЙ карточки
   const isThisProductLoading = loading === product_id;

   // Берем первое изображение из массива JSONB или ставим заглушку
   const mainImage = product_images?.[0] || '/placeholder.png';
   const country = characteristics?.country || 'Польша'; // Пример из макета

   // Проверяем, в избранном ли товар
   const isFavorite = items.includes(product_id);

   const handleFavorite = useCallback(async (event) => {
      event.preventDefault();

      try {
         const result = await dispatch(toggleFavoriteAction({ productId: product_id })).unwrap()
         toast.success(result.message);
      } catch (error) {
         toast.error(error.message)
      }
   }, [dispatch, product_id]) 

   return (
      <div className={styles.card}>
         <div className={styles.imageWrapper}>
            {is_new && <span className={styles.badgeNew}>NEW</span>}
            {
               isThisProductLoading ? (
                  <div className={styles.favoriteLoader}>
                     <Loader />
                  </div>
               ) : (
                  <div
                     onClick={handleFavorite}
                     className={`${styles.favoriteIcon} favorite-btn ${isFavorite ? 'active' : ''}`}
                  >
                     {
                        isFavorite ? (
                           <AiFillHeart size={25} color='#5bc0de' />
                        ) : (
                           <AiOutlineHeart size={25} />
                        )
                     }
                  </div>
               )
            }

            <img src={mainImage} alt={title} className={styles.productImg} />
         </div>

         <div className={styles.info}>
            <h3 className={styles.title}>{title.length > 20 ? `${title.slice(0, 20)}...` : title}, {country}</h3>

            <div className={styles.priceSection}>
               <span className={styles.currentPrice}>
                  {Number(price).toLocaleString()} ₽
               </span>
               {old_price && (
                  <span className={styles.oldPrice}>
                     {Number(old_price).toLocaleString()} ₽
                  </span>
               )}
            </div>

            <Button type="primary" className={styles.buyBtn}>
               В корзину
            </Button>

            <button className={styles.oneClickBtn}>
               Купить в один клик
            </button>
         </div>
      </div>
   );
};

export default ProductCard;