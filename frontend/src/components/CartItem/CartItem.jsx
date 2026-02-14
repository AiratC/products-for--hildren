import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from './CartItem.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { updateCartAction } from '../../redux/slices/cartSlice';
import { AiFillHeart, AiOutlineDelete, AiOutlineHeart } from 'react-icons/ai';
import { toggleFavoriteAction } from '../../redux/slices/favoriteSlice';
import Loader from '../Loader/Loader';

const CartItem = ({ data }) => {
   const { product_id, title, price, product_images, quantity } = data;
   const dispatch = useDispatch();

   const { items: favoriteItems, loading } = useSelector((state) => state.favorites);
   const { loadingId } = useSelector((state) => state.cart);
   const isFavorite = favoriteItems.includes(product_id);
   const image = product_images?.[0] || '/placeholder.png';

   // Проверяем загрузку именно ДЛЯ ЭТОЙ карточки
   const isThisProductLoading = loading === product_id;

   const isThisProductCartLoading = loadingId === product_id;

   // Состояния для функции Undo
   const [isRemoved, setIsRemoved] = useState(false);
   const [timeLeft, setTimeLeft] = useState(60); // 60 секунд на отмену

   // Создаем реф, чтобы всегда иметь доступ к актуальному значению БЕЗ перезапуска эффектов
   const stateRef = useRef({ isRemoved, timeLeft });

   useEffect(() => {
      stateRef.current = { isRemoved, timeLeft }
   }, [isRemoved, timeLeft])

   // Эффект №1: Только для таймера
   // Логика удаления с задержкой (Undo)
   useEffect(() => {
      let timer;
      if (isRemoved && timeLeft > 0) {
         timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
      } else if (isRemoved && timeLeft === 0) {
         // Если время вышло, окончательно удаляем из БД корзины
         dispatch(updateCartAction({ productId: product_id, action: 'delete' }));
      }
      return () => clearInterval(timer)
   }, [isRemoved, timeLeft, dispatch, product_id]);

   // ЭФФЕКТ №2: Только "мягкое" удаление при уходе со страницы (размонтировании)
   useEffect(() => {
      return () => {
         // Этот код выполнится ТОЛЬКО ОДИН РАЗ — когда карточка исчезнет совсем
         if (stateRef.current.isRemoved && stateRef.current.timeLeft > 0) {
            dispatch(updateCartAction({ productId: product_id, action: 'delete' }));
         }
      };
   }, [dispatch, product_id]); // Пустой массив зависимостей (кроме констант), чтобы не срабатывать на таймер

   const handleRemoveClick = useCallback(() => setIsRemoved(true), []);

   const handleUndo = useCallback(() => {
      setIsRemoved(false);
      setTimeLeft(60);
   }, []);

   // Если данных нет (товар удален из стора), не рендерим ничего
   if(!data || !data.product_id) return null;

   // Вид "Товар удален" (Undo Banner)
   if (isRemoved) {
      return (
         <div className={styles.undoBanner}>
            <div className={styles.timerContainer}>
               {timeLeft}
            </div>
            <div className={styles.undoContent}>
               <span>Вы удалили {title}</span>
            </div>
            <div className={styles.undoButtonsContainer}>
               <button onClick={handleUndo} className={styles.undoBtn}>
                  Отменить
               </button>
               <button className={styles.closeUndo} onClick={() => setTimeLeft(0)}>
                  X
               </button>
            </div>
         </div>
      )
   }


   return (
      <div className={styles.itemRow}>
         <div className={styles.mainInfo}>
            <img src={image} alt={title} className={styles.img} />
            <div className={styles.description}>
               <h4 className={styles.itemTitle}>{title}</h4>
               <span className={styles.stockStatus}>В наличии</span>
            </div>
         </div>

         <div className={styles.controls}>
            {
               isThisProductCartLoading ? (
                  <div className={styles.cartItemCartLoader}>
                     <Loader />
                  </div>
               ) : (
                  <div className={styles.quantityBox}>
                     <button onClick={() => dispatch(updateCartAction({ productId: product_id, action: 'decrement' }))}>–</button>
                     <span>{quantity}</span>
                     <button onClick={() => dispatch(updateCartAction({ productId: product_id, action: 'increment' }))}>+</button>
                  </div>
               )
            }


            <div className={styles.price}>{(Number(price) * Number(quantity)).toLocaleString()} ₽</div>

            <div className={styles.actions}>
               {
                  isThisProductLoading ? (
                     <div className={styles.cartItemFavoriteLoader}>
                        <Loader />
                     </div>
                  ) : (
                     <button
                        className={styles.actionIcon}
                        onClick={() => dispatch(toggleFavoriteAction({ productId: product_id }))}
                     >
                        {isFavorite ? <AiFillHeart color="#5bc0de" /> : <AiOutlineHeart />}
                     </button>
                  )
               }

               <button className={styles.actionIcon} onClick={handleRemoveClick}>
                  <AiOutlineDelete />
               </button>
            </div>
         </div>
      </div>
   )
}

export default CartItem
