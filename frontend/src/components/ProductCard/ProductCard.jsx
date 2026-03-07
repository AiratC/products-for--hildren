import React from 'react';
import { Button } from 'antd';
import styles from './ProductCard.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavoriteAction } from '../../redux/slices/favoriteSlice';
import toast from 'react-hot-toast';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'; // Популярная библиотека иконок
import Loader from '../Loader/Loader';
import { useCallback } from 'react';
import { updateCartAction } from '../../redux/slices/cartSlice';
import { useNavigate } from 'react-router';

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

   const navigate = useNavigate();

   const { user } = useSelector((state) => state.authUser);

   const dispatch = useDispatch();
   const { loading, items } = useSelector((state) => state.favorites);
   const { loadingId, cartItems } = useSelector((state) => state.cart);

   // Проверяем загрузку именно ДЛЯ ЭТОЙ карточки
   const isThisProductLoading = loading === product_id;

   // Проверяем загрузку именно для этой карточки - добавление, прибавление, уменьшение товара в корзине
   const isThisProductCartLoading = loadingId === product_id;

   // Берем первое изображение из массива JSONB или ставим заглушку
   const mainImage = product_images?.[0] || '/placeholder.png';
   const country = characteristics?.country || 'Польша'; // Пример из макета

   // Проверяем, в избранном ли товар
   const isFavorite = items.includes(product_id);

   // Ищем есть ли этот товар в корзине
   const inCart = cartItems.find(item => item.product_id === product_id);

   const handleFavorite = useCallback(async (event) => {
      event.stopPropagation();

      try {
         const result = await dispatch(toggleFavoriteAction({ productId: product_id })).unwrap()
         toast.success(result.message);
      } catch (error) {
         toast.error(error.message)
      }
   }, [dispatch, product_id])

   const handleClickCart = useCallback(async (e, productId, action) => {
      e.stopPropagation();
      const data = { productId: productId, action: action }

      if(!user) return toast.error('Вы не авторизованы!');
      
      try {
         switch (action) {
            case 'add': {
               const response = await dispatch(updateCartAction(data)).unwrap();
               toast.success(response.message)
               break;
            };
            case 'decrement': {
               const response = await dispatch(updateCartAction(data)).unwrap();
               toast.success(response.message)
               break;
            };
            case 'increment': {
               const response = await dispatch(updateCartAction(data)).unwrap();
               toast.success(response.message)
               break;
            }
         }
      } catch (error) {
         toast.error(error.message)
      }

   }, [dispatch, user]);

   const handleClickProductCard = (e, id) => {
      e.stopPropagation();
      navigate(`/product-page/${id}`)
   }

   return (
      <div onClick={(e) => handleClickProductCard(e, product_id)} className={styles.card}>
         <div className={styles.imageWrapper}>
            {is_new && <span className={styles.badgeNew}>NEW</span>}
            {
               isThisProductLoading ? (
                  <div className={styles.favoriteLoader}>
                     <Loader />
                  </div>
               ) : (
                  <div
                     onClick={(e) => handleFavorite(e)}
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

            <div className={styles.actions}>
               {
                  !inCart ? (
                     <div>
                        {
                           isThisProductCartLoading ? (
                              <div className={styles.cartLoader}>
                                 <Loader />
                              </div>
                           ) : (
                              <Button
                                 type="primary"
                                 className={styles.buyBtn}
                                 onClick={(e) => handleClickCart(e, product_id, 'add')}
                              >
                                 В корзину
                              </Button>
                           )
                        }
                     </div>
                  ) : (
                     <div>
                        {
                           isThisProductCartLoading ? (
                              <div className={styles.cartLoader}>
                                 <Loader />
                              </div>
                           ) : (
                              <div className={styles.quantityControls}>
                                 <button onClick={(e) => handleClickCart(e, product_id, 'decrement')}>-</button>
                                 <span className={styles.count}>{inCart.quantity}</span>
                                 <button onClick={(e) => handleClickCart(e, product_id, 'increment')}>+</button>
                              </div>
                           )
                        }
                     </div>
                  )
               }
            </div>

            <button className={styles.oneClickBtn}>
               Купить в один клик
            </button>
         </div>
      </div>
   );
};

export default ProductCard;