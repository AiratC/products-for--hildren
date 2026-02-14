import React, { useCallback, useEffect, useMemo } from 'react';
import styles from './CartPage.module.css';
import { useDispatch, useSelector } from 'react-redux';
import CartItem from '../../components/CartItem/CartItem';
import { Button } from 'antd';
import { fetchCart } from '../../redux/slices/cartSlice';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';

const CartPage = () => {
   const { cartItems, isFetching } = useSelector((state) => state.cart);
   const dispatch = useDispatch();

   const totalCount = useMemo(() => {
      return cartItems.reduce((sum, item) => (sum + item.quantity), 0)
   }, [cartItems]);

   const totalPrice = useMemo(() => {
      return cartItems.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0)
   }, [cartItems]);



   useEffect(() => {
      dispatch(fetchCart());
   }, [dispatch]);

   // Функция для склонения слова товар/товаров/товара
   const getProductWord = useCallback((count) => {
      const lastDigit = count % 10;
      const lastTwoDigits = count % 100;
      if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'товаров';
      if (lastDigit === 1) return 'товар';
      if (lastDigit >= 2 && lastDigit <= 4) return 'товара';
      return 'товаров'
   }, [])

   if (cartItems.length === 0 && isFetching) {
      return (
         <div className='preloader'>
            <Loader />
         </div>
      )
   }

   if (cartItems.length === 0) {
      return (
         <div className={styles.emptyContainer}>
            <h2>Ваша корзина пуста</h2>
            <Link to={`/`}>
               <button>На главную</button>
            </Link>
         </div>
      );
   }

   return (
      <div className={`${styles.cartContainer}`}>
         <h1 className={styles.title}>В корзине {totalCount} {getProductWord(totalCount)}</h1>

         <div className={styles.layout}>
            {/* Левая часть список товаров */}
            <div className={styles.itemsList}>
               {
                  cartItems.map((item) => (
                     <CartItem key={item.product_id} data={item} />
                  ))
               }
            </div>

            {/* Правая часть оформление (Order Summary) */}
            <aside className={styles.summaryCard}>
               <div className={styles.summaryInfo}>
                  <div className={styles.promoSection}>
                     <input type="text" placeholder="Промокод" className={styles.promoInput} />
                     <button className={styles.promoBtn}>Применить</button>
                  </div>

                  <div className={styles.summaryRow}>
                     <span>Количество ({totalCount}) {getProductWord(totalCount)}</span>
                     <span>{totalPrice.toLocaleString()} ₽</span>
                  </div>

                  <div className={styles.summaryRow}>
                     <span>Скидка</span>
                     <span className={styles.discount}>0 ₽</span>
                  </div>

                  <hr className={styles.divider} />
                  <div className={styles.totalRow}>
                     <span>Итого</span>
                     <span className={styles.totalPrice}>{totalPrice.toLocaleString()} ₽</span>
                  </div>
               </div>

               <Button type="primary" size="large" block className={styles.checkoutBtn}>
                  Перейти к оформлению
               </Button>

               <p className={styles.terms}>
                  Нажимая кнопку, вы соглашаетесь с правилами возврата и условиями продажи
               </p>
            </aside>
         </div>
      </div>
   )
}

export default CartPage
